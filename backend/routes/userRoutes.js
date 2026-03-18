const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User registration with pre-experiment data
router.post('/register', userController.register);

// Get user profile
router.get('/:userId', userController.getUser);

// Update completion status
router.post('/:userId/complete', userController.updateCompletion);

// Update post-experiment preferences
router.post('/:userId/post-preferences', userController.updatePostPreferences);

// Admin routes (protected in production)
router.get('/', userController.getAllUsers);
router.get('/group/:group', userController.getUsersByGroup);

module.exports = router;