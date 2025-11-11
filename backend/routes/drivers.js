const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/drivers/available-orders
// @desc    Get available orders for drivers
// @access  Private (Driver)
router.get('/available-orders', protect, authorize('driver'), async (req, res) => {
  try {
    // Get orders that are ready for pickup and not assigned
    const orders = await Order.find({
      status: 'ready',
      driver: { $exists: false },
    })
      .populate('restaurant', 'name address phone coordinates')
      .populate('customer', 'name phone')
      .populate('items.menuItem', 'name price')
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

// @route   POST /api/drivers/accept-order/:orderId
// @desc    Accept a delivery order
// @access  Private (Driver)
router.post('/accept-order/:orderId', protect, authorize('driver'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    if (order.status !== 'ready') {
      return res.status(400).json({
        message: 'Order is not ready for pickup',
      });
    }

    if (order.driver) {
      return res.status(400).json({
        message: 'Order is already assigned to a driver',
      });
    }

    // Assign driver to order
    order.driver = req.user.id;
    order.status = 'assigned';
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name phone address')
      .populate('restaurant', 'name address phone coordinates')
      .populate('driver', 'name phone')
      .populate('items.menuItem', 'name price image');

    res.json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/drivers/my-deliveries
// @desc    Get driver's delivery history
// @access  Private (Driver)
router.get('/my-deliveries', protect, authorize('driver'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = { driver: req.user.id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name phone address')
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    // Calculate earnings
    const totalEarnings = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.deliveryFee || 0), 0);

    res.json({
      success: true,
      count: orders.length,
      totalEarnings,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/drivers/stats
// @desc    Get driver statistics
// @access  Private (Driver)
router.get('/stats', protect, authorize('driver'), async (req, res) => {
  try {
    const orders = await Order.find({ driver: req.user.id });

    const stats = {
      totalDeliveries: orders.filter((o) => o.status === 'delivered').length,
      pendingDeliveries: orders.filter((o) =>
        ['assigned', 'picked_up', 'on_the_way'].includes(o.status)
      ).length,
      totalEarnings: orders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.deliveryFee || 0), 0),
      averageRating: 0, // Can be calculated from customer ratings if implemented
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;

