// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Protect routes - verify token and attach user to request
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header (Bearer token)
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user to request
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

// Authorize based on user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: 'User role not defined'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Optional middleware to check if user is the owner of a resource
exports.checkOwnership = (model, paramName = 'id', userField = 'user') => {
  return async (req, res, next) => {
    try {
      // Skip for admin users (they can access all resources)
      if (req.user.role === 'Admin') {
        return next();
      }

      const resource = await model.findById(req.params[paramName]);

      // Check if resource exists
      if (!resource) {
        return res.status(404).json({
          message: 'Resource not found'
        });
      }

      // Check if user is the owner
      if (resource[userField] && resource[userField].toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Not authorized to access this resource'
        });
      }

      // All checks passed
      next();
    } catch (error) {
      console.error('Check ownership middleware error:', error);
      res.status(500).json({ message: 'Server error in ownership middleware' });
    }
  };
};

// Middleware for restaurant managers to check if they own a restaurant
exports.checkRestaurantOwnership = async (req, res, next) => {
  try {
    // Skip for admin users (they can access all restaurants)
    if (req.user.role === 'Admin') {
      return next();
    }

    // Check if user is a restaurant manager
    if (req.user.role !== 'RestaurantManager') {
      return res.status(403).json({
        message: 'Only restaurant managers can access this resource'
      });
    }

    const restaurantId = req.params.id || req.params.restaurantId || req.body.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({
        message: 'Restaurant ID is required'
      });
    }

    // Find the restaurant with the given ID
    const restaurant = await require('../models/Restaurant').findById(restaurantId);

    // Check if restaurant exists
    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found'
      });
    }

    // Check if the user is the manager of this restaurant
    if (restaurant.managerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to manage this restaurant'
      });
    }

    // All checks passed
    req.restaurant = restaurant; // Attach restaurant to request for convenience
    next();
  } catch (error) {
    console.error('Restaurant ownership middleware error:', error);
    res.status(500).json({ message: 'Server error in restaurant ownership middleware' });
  }
};