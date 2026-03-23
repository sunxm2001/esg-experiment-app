const NewsArticle = require('../models/NewsArticle');
const ReadingSession = require('../models/ReadingSession');

/**
 * News controller for handling news-related HTTP requests
 */
const newsController = {
  /**
   * Get articles for a user based on their experiment group
   * GET /api/news/user/:userId
   */
  async getArticlesForUser(req, res, next) {
    try {
      const { userId } = req.params;

      // In production, verify user exists and get their group from database
      // For now, we'll assume user group is passed in query or from authentication
      const { experimentGroup, g4Subgroup, language = 'en' } = req.query;

      if (!experimentGroup) {
        return res.status(400).json({
          error: 'Experiment group is required'
        });
      }

      const validGroups = ['G1', 'G2', 'G3', 'G4', 'G5'];
      if (!validGroups.includes(experimentGroup)) {
        return res.status(400).json({
          error: 'Invalid experiment group'
        });
      }

      // For G4 group, subgroup is required
      if (experimentGroup === 'G4' && !g4Subgroup) {
        return res.status(400).json({
          error: 'G4 subgroup (single or split) is required for G4 group'
        });
      }

      const articles = await NewsArticle.getArticlesForGroup(experimentGroup, g4Subgroup);

      // Format response with article metadata including full content
      const formattedArticles = articles.map(article => {
        // Select title and content based on language preference
        const useChinese = language === 'zh';
        const title = useChinese && article.title_zh ? article.title_zh : article.title;
        const content = useChinese && article.content_zh ? article.content_zh : article.content;

        return {
          id: article.id,
          title,
          title_en: article.title, // Keep original for reference
          title_zh: article.title_zh,
          article_type: article.article_type,
          bundle_type: article.bundle_type,
          time_limit_seconds: article.time_limit_seconds,
          is_filler: article.is_filler,
          display_order: article.display_order,
          // Include full content for immediate display
          content,
          content_en: article.content, // Keep original for reference
          content_zh: article.content_zh,
          has_chinese_translation: !!article.title_zh && !!article.content_zh
        };
      });

      res.json({
        experiment_group: experimentGroup,
        g4_subgroup: g4Subgroup,
        article_count: articles.length,
        articles: formattedArticles
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a specific article by ID
   * GET /api/news/article/:articleId
   */
  async getArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      const article = await NewsArticle.findById(articleId);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      // Start reading session if user ID is provided
      const { userId } = req.query;
      if (userId) {
        // Create reading session start record
        await ReadingSession.startSession(userId, articleId);
      }

      // Get language preference from query parameter or default to English
      const { language = 'en' } = req.query;
      const useChinese = language === 'zh';

      res.json({
        article: {
          id: article.id,
          title: useChinese && article.title_zh ? article.title_zh : article.title,
          title_en: article.title,
          title_zh: article.title_zh,
          content: useChinese && article.content_zh ? article.content_zh : article.content,
          content_en: article.content,
          content_zh: article.content_zh,
          article_type: article.article_type,
          bundle_type: article.bundle_type,
          time_limit_seconds: article.time_limit_seconds,
          is_filler: article.is_filler,
          has_chinese_translation: !!article.title_zh && !!article.content_zh
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Record reading session completion
   * POST /api/news/reading-session
   */
  async recordReadingSession(req, res, next) {
    try {
      const { userId, articleId, durationSeconds, completedWithinLimit, credibilityRating } = req.body;

      if (!userId || !articleId || durationSeconds === undefined) {
        return res.status(400).json({
          error: 'userId, articleId, and durationSeconds are required'
        });
      }

      const session = await ReadingSession.completeSession(
        userId,
        articleId,
        durationSeconds,
        completedWithinLimit,
        credibilityRating
      );

      res.json({
        message: 'Reading session recorded',
        session: {
          id: session.id,
          user_id: session.user_id,
          article_id: session.article_id,
          duration_seconds: session.duration_seconds,
          completed_within_limit: session.completed_within_limit,
          credibility_rating: session.credibility_rating,
          created_at: session.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Create a new article
   * POST /api/news
   */
  async createArticle(req, res, next) {
    try {
      const {
        title,
        content,
        article_type,
        bundle_type,
        target_group,
        display_order,
        time_limit_seconds,
        is_filler
      } = req.body;

      // Validate required fields
      if (!title || !content || !article_type) {
        return res.status(400).json({
          error: 'title, content, and article_type are required'
        });
      }

      const article = await NewsArticle.create({
        title,
        content,
        article_type,
        bundle_type,
        target_group,
        display_order,
        time_limit_seconds,
        is_filler
      });

      res.status(201).json({
        message: 'Article created successfully',
        article
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Get all articles
   * GET /api/news
   */
  async getAllArticles(req, res, next) {
    try {
      const articles = await NewsArticle.findAll();
      res.json({ articles });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Update article
   * PUT /api/news/:articleId
   */
  async updateArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      const updateData = req.body;

      const article = await NewsArticle.findById(articleId);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      const updatedArticle = await NewsArticle.update(articleId, updateData);
      res.json({
        message: 'Article updated successfully',
        article: updatedArticle
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Delete article
   * DELETE /api/news/:articleId
   */
  async deleteArticle(req, res, next) {
    try {
      const { articleId } = req.params;

      const article = await NewsArticle.findById(articleId);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      const deleted = await NewsArticle.delete(articleId);
      if (deleted) {
        res.json({ message: 'Article deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete article' });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get article counts by type
   * GET /api/news/stats/counts
   */
  async getArticleCounts(req, res, next) {
    try {
      const counts = await NewsArticle.getCountsByType();
      res.json({ counts });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = newsController;