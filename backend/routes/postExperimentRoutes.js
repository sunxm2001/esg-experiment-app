const express = require('express');
const router = express.Router();
const postExperimentController = require('../controllers/postExperimentController');

// Submit post-experiment evaluation
router.post('/', postExperimentController.submitEvaluation);

// Get evaluation for a user
router.get('/user/:userId', postExperimentController.getUserEvaluation);

// Get manipulation check statistics
router.get('/stats/manipulation-check', postExperimentController.getManipulationCheckStats);

// Get average ratings by experiment group
router.get('/stats/average-ratings', postExperimentController.getAverageRatingsByGroup);

// Get preference changes (pre-post)
router.get('/stats/preference-changes', postExperimentController.getPreferenceChanges);

// Admin routes (protected in production)

// Get all evaluations
router.get('/', postExperimentController.getAllEvaluations);

// Update evaluation
router.put('/user/:userId', postExperimentController.updateEvaluation);

// Delete evaluation
router.delete('/user/:userId', postExperimentController.deleteEvaluation);

module.exports = router;