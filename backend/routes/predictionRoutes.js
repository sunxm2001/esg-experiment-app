const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Submit prediction and trading decision
router.post('/', predictionController.submitPrediction);

// Get predictions for a user
router.get('/user/:userId', predictionController.getUserPredictions);

// Get predictions for an article
router.get('/article/:articleId', predictionController.getArticlePredictions);

// Get user prediction statistics
router.get('/user/:userId/statistics', predictionController.getUserStatistics);

// Get average ratings by article type
router.get('/stats/average-ratings', predictionController.getAverageRatings);

// Get predictions by experiment group
router.get('/group/:group', predictionController.getPredictionsByGroup);

// Admin routes (protected in production)

// Update prediction
router.put('/:predictionId', predictionController.updatePrediction);

// Delete prediction
router.delete('/:predictionId', predictionController.deletePrediction);

module.exports = router;