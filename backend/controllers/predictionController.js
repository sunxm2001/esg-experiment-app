const Prediction = require('../models/Prediction');

/**
 * Prediction controller for handling prediction and trading HTTP requests
 */
const predictionController = {
  /**
   * Submit a prediction and trading decision
   * POST /api/predictions
   */
  async submitPrediction(req, res, next) {
    try {
      const {
        user_id,
        article_id,
        future_stock_price_rating,
        future_profitability_rating,
        capital_allocation_percentage
      } = req.body;

      // Validate required fields
      if (!user_id || !article_id) {
        return res.status(400).json({
          error: 'user_id and article_id are required'
        });
      }

      // Validate rating ranges (1-7)
      if (future_stock_price_rating !== undefined) {
        if (future_stock_price_rating < 1 || future_stock_price_rating > 7) {
          return res.status(400).json({
            error: 'future_stock_price_rating must be between 1 and 7'
          });
        }
      }

      if (future_profitability_rating !== undefined) {
        if (future_profitability_rating < 1 || future_profitability_rating > 7) {
          return res.status(400).json({
            error: 'future_profitability_rating must be between 1 and 7'
          });
        }
      }

      // Validate capital allocation (0-100)
      if (capital_allocation_percentage !== undefined) {
        if (capital_allocation_percentage < 0 || capital_allocation_percentage > 100) {
          return res.status(400).json({
            error: 'capital_allocation_percentage must be between 0 and 100'
          });
        }
      }

      // Check if prediction already exists for this user and article
      const existingPrediction = await Prediction.hasPrediction(user_id, article_id);
      if (existingPrediction) {
        return res.status(409).json({
          error: 'Prediction already exists for this user and article'
        });
      }

      const prediction = await Prediction.create({
        user_id,
        article_id,
        future_stock_price_rating,
        future_profitability_rating,
        capital_allocation_percentage
      });

      res.status(201).json({
        message: 'Prediction submitted successfully',
        prediction: {
          id: prediction.id,
          user_id: prediction.user_id,
          article_id: prediction.article_id,
          future_stock_price_rating: prediction.future_stock_price_rating,
          future_profitability_rating: prediction.future_profitability_rating,
          capital_allocation_percentage: prediction.capital_allocation_percentage,
          created_at: prediction.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get predictions for a user
   * GET /api/predictions/user/:userId
   */
  async getUserPredictions(req, res, next) {
    try {
      const { userId } = req.params;
      const predictions = await Prediction.findByUser(userId);

      res.json({
        user_id: userId,
        prediction_count: predictions.length,
        predictions: predictions.map(p => ({
          id: p.id,
          article_id: p.article_id,
          article_title: p.title,
          article_type: p.article_type,
          is_filler: p.is_filler,
          future_stock_price_rating: p.future_stock_price_rating,
          future_profitability_rating: p.future_profitability_rating,
          capital_allocation_percentage: p.capital_allocation_percentage,
          created_at: p.created_at
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get predictions for an article
   * GET /api/predictions/article/:articleId
   */
  async getArticlePredictions(req, res, next) {
    try {
      const { articleId } = req.params;
      const predictions = await Prediction.findByArticle(articleId);

      res.json({
        article_id: articleId,
        prediction_count: predictions.length,
        predictions: predictions.map(p => ({
          id: p.id,
          user_id: p.user_id,
          user_email: p.email,
          experiment_group: p.experiment_group,
          future_stock_price_rating: p.future_stock_price_rating,
          future_profitability_rating: p.future_profitability_rating,
          capital_allocation_percentage: p.capital_allocation_percentage,
          created_at: p.created_at
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get prediction statistics for a user
   * GET /api/predictions/user/:userId/statistics
   */
  async getUserStatistics(req, res, next) {
    try {
      const { userId } = req.params;
      const statistics = await Prediction.getUserStatistics(userId);

      res.json({
        user_id: userId,
        statistics
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get average ratings by article type
   * GET /api/predictions/stats/average-ratings
   */
  async getAverageRatings(req, res, next) {
    try {
      const averages = await Prediction.getAverageRatingsByArticleType();
      res.json({ averages });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get predictions by experiment group
   * GET /api/predictions/group/:group
   */
  async getPredictionsByGroup(req, res, next) {
    try {
      const { group } = req.params;
      const validGroups = ['G1', 'G2', 'G3', 'G4', 'G5'];

      if (!validGroups.includes(group)) {
        return res.status(400).json({ error: 'Invalid experiment group' });
      }

      const predictions = await Prediction.findByExperimentGroup(group);

      res.json({
        group,
        prediction_count: predictions.length,
        predictions: predictions.map(p => ({
          id: p.id,
          user_id: p.user_id,
          user_email: p.email,
          article_id: p.article_id,
          article_title: p.title,
          article_type: p.article_type,
          future_stock_price_rating: p.future_stock_price_rating,
          future_profitability_rating: p.future_profitability_rating,
          capital_allocation_percentage: p.capital_allocation_percentage,
          created_at: p.created_at
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Update a prediction
   * PUT /api/predictions/:predictionId
   */
  async updatePrediction(req, res, next) {
    try {
      const { predictionId } = req.params;
      const updateData = req.body;

      const prediction = await Prediction.findById(predictionId);
      if (!prediction) {
        return res.status(404).json({ error: 'Prediction not found' });
      }

      const updatedPrediction = await Prediction.update(predictionId, updateData);
      res.json({
        message: 'Prediction updated successfully',
        prediction: updatedPrediction
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Delete a prediction
   * DELETE /api/predictions/:predictionId
   */
  async deletePrediction(req, res, next) {
    try {
      const { predictionId } = req.params;

      const prediction = await Prediction.findById(predictionId);
      if (!prediction) {
        return res.status(404).json({ error: 'Prediction not found' });
      }

      const deleted = await Prediction.delete(predictionId);
      if (deleted) {
        res.json({ message: 'Prediction deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete prediction' });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = predictionController;