const express = require('express');
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/menu/restaurant/:restaurantId
// @desc    Get all menu items for a restaurant
// @access  Public
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { category, isAvailable } = req.query;
    const query = { restaurant: req.params.restaurantId };

    if (category) {
      query.category = new RegExp(category, 'i');
    }
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      'restaurant',
      'name address'
    );

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   POST /api/menu
// @desc    Create menu item (restaurant owner only)
// @access  Private (Restaurant role)
router.post(
  '/',
  protect,
  authorize('restaurant', 'admin'),
  [
    body('name').notEmpty().withMessage('Menu item name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('restaurant').notEmpty().withMessage('Restaurant ID is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if restaurant exists and user owns it
      const restaurant = await Restaurant.findById(req.body.restaurant);
      if (!restaurant) {
        return res.status(404).json({
          message: 'Restaurant not found',
        });
      }

      if (
        restaurant.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          message: 'Not authorized to add menu items to this restaurant',
        });
      }

      const menuItem = await MenuItem.create(req.body);

      res.status(201).json({
        success: true,
        data: menuItem,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private (Restaurant owner or Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      'restaurant',
      'owner'
    );

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    // Check if user is restaurant owner or admin
    if (
      menuItem.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized to update this menu item',
      });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private (Restaurant owner or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      'restaurant',
      'owner'
    );

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    // Check if user is restaurant owner or admin
    if (
      menuItem.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized to delete this menu item',
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;

