const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

/**
 * Performance calculation routes
 */

// Calculate performance for a specific user
router.post('/calculate/:userId', performanceController.calculateUserPerformance);

// Calculate performance for all users
router.post('/calculate-all', performanceController.calculateAllPerformance);

// Get performance statistics
router.get('/stats', performanceController.getPerformanceStats);

// Get detailed performance breakdown for a user
router.get('/user/:userId/detailed', performanceController.getUserPerformanceDetailed);

// Recalculate outdated performance scores
router.post('/recalculate', performanceController.recalculateOutdatedPerformance);

module.exports = router;