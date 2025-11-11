const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post(
  '/',
  protect,
  authorize('customer'),
  [
    body('restaurant').notEmpty().withMessage('Restaurant ID is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('paymentMethod')
      .isIn(['cash', 'card', 'wallet'])
      .withMessage('Invalid payment method'),
    body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { restaurant, items, paymentMethod, deliveryAddress, specialInstructions } =
        req.body;

      // Verify restaurant exists
      const restaurantData = await Restaurant.findById(restaurant);
      if (!restaurantData || !restaurantData.isActive) {
        return res.status(404).json({
          message: 'Restaurant not found or inactive',
        });
      }

      // Calculate order total
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({
            message: `Menu item ${item.menuItem} not found or unavailable`,
          });
        }

        const itemTotal = menuItem.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          price: menuItem.price,
          specialInstructions: item.specialInstructions,
        });
      }

      // Check minimum order
      if (subtotal < restaurantData.minimumOrder) {
        return res.status(400).json({
          message: `Minimum order amount is $${restaurantData.minimumOrder}`,
        });
      }

      const deliveryFee = restaurantData.deliveryFee || 0;
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + deliveryFee + tax;

      // Check wallet balance if payment method is wallet
      if (paymentMethod === 'wallet') {
        const user = await User.findById(req.user.id);
        if (user.wallet < total) {
          return res.status(400).json({
            message: 'Insufficient wallet balance',
          });
        }
        // Deduct from wallet
        user.wallet -= total;
        await user.save();
      }

      // Create order
      const order = await Order.create({
        customer: req.user.id,
        restaurant,
        items: orderItems,
        subtotal,
        deliveryFee,
        tax,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
        deliveryAddress,
        specialInstructions,
        estimatedDeliveryTime: new Date(
          Date.now() + restaurantData.estimatedDeliveryTime * 60000
        ),
      });

      const populatedOrder = await Order.findById(order._id)
        .populate('customer', 'name email phone')
        .populate('restaurant', 'name address phone')
        .populate('items.menuItem', 'name price image');

      res.status(201).json({
        success: true,
        data: populatedOrder,
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

// @route   GET /api/orders
// @desc    Get orders (filtered by user role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Filter by user role
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ owner: req.user.id });
      if (restaurant) {
        query.restaurant = restaurant._id;
      } else {
        return res.json({ success: true, count: 0, data: [] });
      }
    } else if (req.user.role === 'driver') {
      query.driver = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admin can see all orders
    }

    const { status } = req.query;
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address phone')
      .populate('driver', 'name phone')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('restaurant', 'name address phone coordinates')
      .populate('driver', 'name phone address')
      .populate('items.menuItem', 'name price image description');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Check authorization
    const isAuthorized =
      order.customer._id.toString() === req.user.id ||
      order.driver?._id?.toString() === req.user.id ||
      req.user.role === 'admin' ||
      (req.user.role === 'restaurant' &&
        (await Restaurant.findOne({ owner: req.user.id, _id: order.restaurant._id })));

    if (!isAuthorized) {
      return res.status(403).json({
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put(
  '/:id/status',
  protect,
  [body('status').notEmpty().withMessage('Status is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findById(req.params.id).populate('restaurant', 'owner');

      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }

      const { status } = req.body;
      const validStatuses = [
        'pending',
        'accepted',
        'preparing',
        'ready',
        'assigned',
        'picked_up',
        'on_the_way',
        'delivered',
        'cancelled',
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status',
        });
      }

      // Authorization checks
      if (req.user.role === 'restaurant') {
        if (order.restaurant.owner.toString() !== req.user.id) {
          return res.status(403).json({
            message: 'Not authorized to update this order',
          });
        }
        // Restaurant can only update to: accepted, preparing, ready, cancelled
        if (!['accepted', 'preparing', 'ready', 'cancelled'].includes(status)) {
          return res.status(403).json({
            message: 'Restaurant cannot set this status',
          });
        }
      } else if (req.user.role === 'driver') {
        if (order.driver?.toString() !== req.user.id) {
          return res.status(403).json({
            message: 'Not authorized to update this order',
          });
        }
        // Driver can only update to: picked_up, on_the_way, delivered
        if (!['picked_up', 'on_the_way', 'delivered'].includes(status)) {
          return res.status(403).json({
            message: 'Driver cannot set this status',
          });
        }
      } else if (req.user.role === 'customer') {
        // Customer can only cancel pending orders
        if (status === 'cancelled' && order.status !== 'pending') {
          return res.status(400).json({
            message: 'Cannot cancel order at this stage',
          });
        }
        if (status !== 'cancelled') {
          return res.status(403).json({
            message: 'Customer can only cancel orders',
          });
        }
      }

      // Update status
      order.status = status;

      // Set delivery time when delivered
      if (status === 'delivered') {
        order.actualDeliveryTime = new Date();
        order.paymentStatus = 'paid';
      }

      await order.save();

      const updatedOrder = await Order.findById(order._id)
        .populate('customer', 'name email phone')
        .populate('restaurant', 'name address phone')
        .populate('driver', 'name phone')
        .populate('items.menuItem', 'name price image');

      res.json({
        success: true,
        data: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

// @route   POST /api/orders/:id/rating
// @desc    Rate and review order
// @access  Private (Customer)
router.post(
  '/:id/rating',
  protect,
  authorize('customer'),
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }

      if (order.customer.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Not authorized to rate this order',
        });
      }

      if (order.status !== 'delivered') {
        return res.status(400).json({
          message: 'Can only rate delivered orders',
        });
      }

      order.rating = req.body.rating;
      order.review = req.body.review;

      await order.save();

      // Update restaurant rating
      const restaurant = await Restaurant.findById(order.restaurant);
      const restaurantOrders = await Order.find({
        restaurant: order.restaurant,
        rating: { $exists: true },
      });

      const avgRating =
        restaurantOrders.reduce((sum, o) => sum + o.rating, 0) / restaurantOrders.length;
      restaurant.rating = avgRating;
      restaurant.totalReviews = restaurantOrders.length;
      await restaurant.save();

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

module.exports = router;

