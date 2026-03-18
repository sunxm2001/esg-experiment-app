const express = require('express');
const router = express.Router();
const incentiveController = require('../controllers/incentiveController');

// Calculate bonus for a user
router.post('/calculate/:userId', incentiveController.calculateBonus);

// Automatically calculate bonus based on predictions
router.post('/calculate-auto/:userId', incentiveController.calculateBonusAuto);

// Award bonus to user
router.post('/award/:userId', incentiveController.awardBonus);

// Get performance tracking for a user
router.get('/user/:userId', incentiveController.getUserPerformance);

// Get performance statistics
router.get('/stats', incentiveController.getPerformanceStats);

// Get users eligible for bonus
router.get('/eligible', incentiveController.getEligibleUsers);

// Admin routes (protected in production)

// Get all performance tracking records
router.get('/', incentiveController.getAllPerformance);

// Recalculate all bonuses (admin)
router.post('/recalculate', incentiveController.recalculateAllBonuses);

module.exports = router;