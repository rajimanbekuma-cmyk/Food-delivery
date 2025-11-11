const express = require('express');
const { body, validationResult } = require('express-validator');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { cuisine, city, isOpen, search } = req.query;
    const query = { isActive: true };

    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    if (isOpen !== undefined) {
      query.isOpen = isOpen === 'true';
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email')
      .sort({ rating: -1, createdAt: -1 });

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

// @route   GET /api/restaurants/:id
// @desc    Get single restaurant
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found',
      });
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   POST /api/restaurants
// @desc    Create restaurant (restaurant owner only)
// @access  Private (Restaurant role)
router.post(
  '/',
  protect,
  authorize('restaurant', 'admin'),
  [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user already has a restaurant
      if (req.user.role === 'restaurant') {
        const existingRestaurant = await Restaurant.findOne({
          owner: req.user.id,
        });
        if (existingRestaurant) {
          return res.status(400).json({
            message: 'You already have a restaurant registered',
          });
        }
      }

      const restaurant = await Restaurant.create({
        ...req.body,
        owner: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: restaurant,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private (Restaurant owner or Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found',
      });
    }

    // Check if user is owner or admin
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized to update this restaurant',
      });
    }

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private (Restaurant owner or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found',
      });
    }

    // Check if user is owner or admin
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized to delete this restaurant',
      });
    }

    await Restaurant.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Restaurant deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;

