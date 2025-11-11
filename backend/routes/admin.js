const express = require('express');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/Deactivate user
// @access  Private (Admin)
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Private (Admin)
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date query
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    // Get statistics
    const [
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue,
      activeOrders,
      completedOrders,
      cancelledOrders,
    ] = await Promise.all([
      User.countDocuments({ ...dateQuery }),
      Restaurant.countDocuments({ ...dateQuery, isActive: true }),
      Order.countDocuments(dateQuery),
      Order.aggregate([
        { $match: { ...dateQuery, status: 'delivered', paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments({ ...dateQuery, status: { $in: ['pending', 'accepted', 'preparing', 'ready', 'assigned', 'picked_up', 'on_the_way'] } }),
      Order.countDocuments({ ...dateQuery, status: 'delivered' }),
      Order.countDocuments({ ...dateQuery, status: 'cancelled' }),
    ]);

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get revenue by day (last 7 days)
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          ...dateQuery,
          status: 'delivered',
          paymentStatus: 'paid',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const analytics = {
      users: {
        total: totalUsers,
      },
      restaurants: {
        total: totalRestaurants,
      },
      orders: {
        total: totalOrders,
        active: activeOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        byStatus: ordersByStatus,
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        byDay: revenueByDay,
      },
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/admin/restaurants
// @desc    Get all restaurants (admin view)
// @access  Private (Admin)
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders (admin view)
// @access  Private (Admin)
router.get('/orders', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address')
      .populate('driver', 'name phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 })
      .limit(100);

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

module.exports = router;

