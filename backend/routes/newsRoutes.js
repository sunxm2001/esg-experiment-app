const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Get articles for a user (requires experiment group)
router.get('/user/:userId', newsController.getArticlesForUser);

// Get specific article
router.get('/article/:articleId', newsController.getArticle);

// Record reading session completion
router.post('/reading-session', newsController.recordReadingSession);

// Admin routes (protected in production)

// Create new article
router.post('/', newsController.createArticle);

// Get all articles
router.get('/', newsController.getAllArticles);

// Update article
router.put('/:articleId', newsController.updateArticle);

// Delete article
router.delete('/:articleId', newsController.deleteArticle);

// Get article counts by type
router.get('/stats/counts', newsController.getArticleCounts);

module.exports = router;