const PerformanceCalculator = require('../services/performanceCalculator');
const PerformanceTracking = require('../models/PerformanceTracking');

/**
 * Performance Controller for calculating and managing performance scores
 */
const performanceController = {
  /**
   * Calculate performance for a specific user
   * POST /api/performance/calculate/:userId
   */
  async calculateUserPerformance(req, res, next) {
    try {
      const { userId } = req.params;

      // Validate user exists (simple check)
      const userCheckQuery = 'SELECT id FROM users WHERE id = $1';
      const userResult = await db.query(userCheckQuery, [userId]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const performance = await PerformanceCalculator.calculateAndUpdateUserPerformance(userId);

      res.json({
        message: 'Performance calculated successfully',
        performance: {
          user_id: userId,
          prediction_accuracy_score: performance.prediction_accuracy_score,
          portfolio_performance_score: performance.portfolio_performance_score,
          bonus_calculated: performance.bonus_calculated,
          tracking_id: performance.tracking_id
        }
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Calculate performance for all users
   * POST /api/performance/calculate-all
   */
  async calculateAllPerformance(req, res, next) {
    try {
      const results = await PerformanceCalculator.calculateAllUsersPerformance();

      res.json({
        message: 'Performance calculated for all users',
        results: {
          total_users: results.length,
          successful: results.filter(r => !r.error).length,
          failed: results.filter(r => r.error).length,
          users: results.map(r => ({
            user_id: r.user_id,
            email: r.email,
            experiment_group: r.experiment_group,
            prediction_accuracy_score: r.prediction_accuracy_score,
            portfolio_performance_score: r.portfolio_performance_score,
            bonus_calculated: r.bonus_calculated,
            error: r.error
          }))
        }
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Get performance statistics
   * GET /api/performance/stats
   */
  async getPerformanceStats(req, res, next) {
    try {
      const stats = await PerformanceCalculator.getPerformanceStatistics();

      res.json({
        statistics: {
          users_with_scores: stats.users_with_scores || 0,
          average_accuracy: stats.avg_accuracy ? Math.round(stats.avg_accuracy * 100) / 100 : 0,
          average_portfolio: stats.avg_portfolio ? Math.round(stats.avg_portfolio * 100) / 100 : 0,
          average_bonus: stats.avg_bonus ? Math.round(stats.avg_bonus * 100) / 100 : 0,
          min_accuracy: stats.min_accuracy ? Math.round(stats.min_accuracy * 100) / 100 : 0,
          max_accuracy: stats.max_accuracy ? Math.round(stats.max_accuracy * 100) / 100 : 0,
          min_portfolio: stats.min_portfolio ? Math.round(stats.min_portfolio * 100) / 100 : 0,
          max_portfolio: stats.max_portfolio ? Math.round(stats.max_portfolio * 100) / 100 : 0
        }
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Get detailed performance breakdown for a user
   * GET /api/performance/user/:userId/detailed
   */
  async getUserPerformanceDetailed(req, res, next) {
    try {
      const { userId } = req.params;

      // Get performance tracking record
      const tracking = await PerformanceTracking.findByUser(userId);
      if (!tracking) {
        return res.status(404).json({ error: 'Performance tracking not found for this user' });
      }

      // Get user's predictions with article details
      const Prediction = require('../models/Prediction');
      const predictions = await Prediction.findByUser(userId);

      // Get article true ratings for comparison
      const predictionsWithComparison = await Promise.all(
        predictions.map(async (prediction) => {
          const articleQuery = `
            SELECT title, article_type, is_filler,
                   true_future_stock_price_rating, true_future_profitability_rating
            FROM news_articles
            WHERE id = $1
          `;
          const articleResult = await db.query(articleQuery, [prediction.article_id]);
          const article = articleResult.rows[0] || {};

          // Calculate accuracy for this prediction if true ratings exist
          let stockAccuracy = null;
          let profitabilityAccuracy = null;
          let overallAccuracy = null;

          if (article.true_future_stock_price_rating !== null &&
              article.true_future_profitability_rating !== null &&
              !article.is_filler) {
            const stockError = Math.abs(prediction.future_stock_price_rating - article.true_future_stock_price_rating);
            const profitabilityError = Math.abs(prediction.future_profitability_rating - article.true_future_profitability_rating);

            stockAccuracy = Math.max(0, (6 - stockError) / 6 * 100);
            profitabilityAccuracy = Math.max(0, (6 - profitabilityError) / 6 * 100);
            overallAccuracy = (stockAccuracy + profitabilityAccuracy) / 2;
          }

          return {
            prediction_id: prediction.id,
            article_id: prediction.article_id,
            article_title: article.title || 'Unknown',
            article_type: article.article_type,
            is_filler: article.is_filler || false,
            user_stock_rating: prediction.future_stock_price_rating,
            user_profitability_rating: prediction.future_profitability_rating,
            true_stock_rating: article.true_future_stock_price_rating,
            true_profitability_rating: article.true_future_profitability_rating,
            capital_allocation: prediction.capital_allocation_percentage,
            stock_accuracy: stockAccuracy ? Math.round(stockAccuracy * 100) / 100 : null,
            profitability_accuracy: profitabilityAccuracy ? Math.round(profitabilityAccuracy * 100) / 100 : null,
            overall_accuracy: overallAccuracy ? Math.round(overallAccuracy * 100) / 100 : null,
            created_at: prediction.created_at
          };
        })
      );

      // Separate filler and non-filler predictions
      const nonFillerPredictions = predictionsWithComparison.filter(p => !p.is_filler);
      const fillerPredictions = predictionsWithComparison.filter(p => p.is_filler);

      res.json({
        user_id: userId,
        user_email: tracking.email,
        experiment_group: tracking.experiment_group,
        performance_summary: {
          prediction_accuracy_score: tracking.prediction_accuracy_score,
          portfolio_performance_score: tracking.portfolio_performance_score,
          bonus_calculated: tracking.bonus_calculated,
          bonus_awarded: tracking.bonus_awarded,
          updated_at: tracking.updated_at
        },
        predictions: {
          total: predictionsWithComparison.length,
          non_filler: nonFillerPredictions.length,
          filler: fillerPredictions.length,
          non_filler_predictions: nonFillerPredictions,
          filler_predictions: fillerPredictions
        }
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Recalculate performance for users with missing or outdated scores
   * POST /api/performance/recalculate
   */
  async recalculateOutdatedPerformance(req, res, next) {
    try {
      // Find users with predictions but no performance tracking
      const query = `
        SELECT DISTINCT p.user_id, u.email
        FROM predictions p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN performance_tracking pt ON p.user_id = pt.user_id
        WHERE pt.user_id IS NULL
           OR pt.updated_at < (SELECT MAX(created_at) FROM predictions WHERE user_id = p.user_id)
      `;

      const result = await db.query(query);
      const usersToUpdate = result.rows;

      const updateResults = [];

      for (const user of usersToUpdate) {
        try {
          const performance = await PerformanceCalculator.calculateAndUpdateUserPerformance(user.user_id);
          updateResults.push({
            user_id: user.user_id,
            email: user.email,
            success: true,
            prediction_accuracy_score: performance.prediction_accuracy_score,
            portfolio_performance_score: performance.portfolio_performance_score
          });
        } catch (userError) {
          updateResults.push({
            user_id: user.user_id,
            email: user.email,
            success: false,
            error: userError.message
          });
        }
      }

      res.json({
        message: 'Recalculation completed',
        results: {
          total_users: usersToUpdate.length,
          successful: updateResults.filter(r => r.success).length,
          failed: updateResults.filter(r => !r.success).length,
          updates: updateResults
        }
      });

    } catch (error) {
      next(error);
    }
  }
};

// Database connection for direct queries
const db = require('../config/database');

module.exports = performanceController;