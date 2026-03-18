const db = require('../config/database');
const Prediction = require('../models/Prediction');
const NewsArticle = require('../models/NewsArticle');

/**
 * Performance Calculator Service
 * Calculates prediction accuracy and portfolio performance for users
 */
class PerformanceCalculator {
  /**
   * Calculate prediction accuracy for a user
   * Compares user's predictions against true future performance ratings
   * @param {string} userId - User UUID
   * @returns {Promise<number>} Accuracy score (0-100)
   */
  static async calculatePredictionAccuracy(userId) {
    try {
      // Get all non-filler predictions for the user
      const predictions = await Prediction.findByUser(userId);

      // Filter out filler articles (is_filler = true)
      const nonFillerPredictions = predictions.filter(p => !p.is_filler);

      if (nonFillerPredictions.length === 0) {
        return 0; // No predictions to evaluate
      }

      let totalAccuracy = 0;
      let evaluatedPredictions = 0;

      for (const prediction of nonFillerPredictions) {
        const articleId = prediction.article_id;

        // Get true ratings for the article
        const articleQuery = `
          SELECT true_future_stock_price_rating, true_future_profitability_rating
          FROM news_articles
          WHERE id = $1;
        `;
        const articleResult = await db.query(articleQuery, [articleId]);

        if (articleResult.rows.length === 0) {
          continue; // Article not found or missing true ratings
        }

        const article = articleResult.rows[0];
        const trueStockRating = article.true_future_stock_price_rating;
        const trueProfitabilityRating = article.true_future_profitability_rating;

        // Skip if true ratings are not available
        if (trueStockRating === null || trueProfitabilityRating === null) {
          continue;
        }

        // Calculate accuracy for this prediction
        const userStockRating = prediction.future_stock_price_rating;
        const userProfitabilityRating = prediction.future_profitability_rating;

        // Calculate absolute errors (1-7 scale)
        const stockError = Math.abs(userStockRating - trueStockRating);
        const profitabilityError = Math.abs(userProfitabilityRating - trueProfitabilityRating);

        // Convert errors to accuracy scores (0-100%)
        // Maximum error is 6 (from 1 to 7), so accuracy = (6 - error) / 6 * 100
        const stockAccuracy = Math.max(0, (6 - stockError) / 6 * 100);
        const profitabilityAccuracy = Math.max(0, (6 - profitabilityError) / 6 * 100);

        // Average the two accuracy scores
        const predictionAccuracy = (stockAccuracy + profitabilityAccuracy) / 2;

        totalAccuracy += predictionAccuracy;
        evaluatedPredictions++;
      }

      if (evaluatedPredictions === 0) {
        return 0;
      }

      // Return average accuracy across all evaluated predictions
      return totalAccuracy / evaluatedPredictions;

    } catch (error) {
      console.error('Error calculating prediction accuracy:', error);
      throw error;
    }
  }

  /**
   * Calculate portfolio performance for a user
   * Simulates investment returns based on capital allocation and true performance
   * @param {string} userId - User UUID
   * @returns {Promise<number>} Portfolio performance score (0-100)
   */
  static async calculatePortfolioPerformance(userId) {
    try {
      // Get all non-filler predictions for the user with capital allocation
      const predictions = await Prediction.findByUser(userId);
      const nonFillerPredictions = predictions.filter(p => !p.is_filler);

      if (nonFillerPredictions.length === 0) {
        return 0; // No investments to evaluate
      }

      let totalInvestment = 0;
      let totalWeightedReturn = 0;

      for (const prediction of nonFillerPredictions) {
        const articleId = prediction.article_id;
        const capitalAllocation = prediction.capital_allocation_percentage || 0;

        if (capitalAllocation <= 0) {
          continue; // No investment in this article
        }

        // Get true ratings for the article
        const articleQuery = `
          SELECT true_future_stock_price_rating, true_future_profitability_rating
          FROM news_articles
          WHERE id = $1;
        `;
        const articleResult = await db.query(articleQuery, [articleId]);

        if (articleResult.rows.length === 0) {
          continue;
        }

        const article = articleResult.rows[0];
        const trueStockRating = article.true_future_stock_price_rating;
        const trueProfitabilityRating = article.true_future_profitability_rating;

        // Skip if true ratings are not available
        if (trueStockRating === null || trueProfitabilityRating === null) {
          continue;
        }

        // Calculate expected return based on true ratings
        // Normalize ratings to 0-1 scale: (rating - 1) / 6
        const stockReturn = (trueStockRating - 1) / 6; // 0 to 1
        const profitabilityReturn = (trueProfitabilityRating - 1) / 6; // 0 to 1

        // Combined return (average of both dimensions)
        const expectedReturn = (stockReturn + profitabilityReturn) / 2;

        // Scale return to -0.5 to +0.5 range for more realistic simulation
        // Center at 0.25 (corresponding to rating 4)
        const scaledReturn = (expectedReturn - 0.5) * 0.5;

        // Calculate investment return
        const investmentReturn = capitalAllocation * scaledReturn;

        totalInvestment += capitalAllocation;
        totalWeightedReturn += investmentReturn;
      }

      if (totalInvestment === 0) {
        return 50; // Neutral performance if no investments
      }

      // Calculate overall portfolio return percentage
      const portfolioReturnPercent = (totalWeightedReturn / totalInvestment) * 100;

      // Convert to performance score (0-100)
      // Shift and scale: -50% to +50% return maps to 0 to 100 score
      const performanceScore = Math.max(0, Math.min(100, 50 + portfolioReturnPercent));

      return performanceScore;

    } catch (error) {
      console.error('Error calculating portfolio performance:', error);
      throw error;
    }
  }

  /**
   * Calculate both scores for a user and update performance tracking
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Calculated scores
   */
  static async calculateAndUpdateUserPerformance(userId) {
    try {
      const predictionAccuracy = await this.calculatePredictionAccuracy(userId);
      const portfolioPerformance = await this.calculatePortfolioPerformance(userId);

      // Round to 2 decimal places
      const accuracyScore = Math.round(predictionAccuracy * 100) / 100;
      const portfolioScore = Math.round(portfolioPerformance * 100) / 100;

      // Get bonus configuration (could be from config file)
      const bonusConfig = {
        baseBonus: 0,
        predictionWeight: 0.6, // Weight prediction accuracy more heavily
        portfolioWeight: 0.4,
        maxBonus: 50
      };

      // Calculate bonus using existing PerformanceTracking method
      const PerformanceTracking = require('../models/PerformanceTracking');
      const bonusCalculated = PerformanceTracking.calculateBonus(
        accuracyScore,
        portfolioScore,
        bonusConfig
      );

      // Update performance tracking record
      const tracking = await PerformanceTracking.upsert({
        user_id: userId,
        prediction_accuracy_score: accuracyScore,
        portfolio_performance_score: portfolioScore,
        bonus_calculated: bonusCalculated,
        bonus_awarded: false
      });

      return {
        prediction_accuracy_score: accuracyScore,
        portfolio_performance_score: portfolioScore,
        bonus_calculated: bonusCalculated,
        tracking_id: tracking.id
      };

    } catch (error) {
      console.error('Error calculating and updating user performance:', error);
      throw error;
    }
  }

  /**
   * Calculate performance for all users who have completed predictions
   * @returns {Promise<Array>} Results for all users
   */
  static async calculateAllUsersPerformance() {
    try {
      // Get all users who have made predictions
      const query = `
        SELECT DISTINCT p.user_id, u.email, u.experiment_group
        FROM predictions p
        JOIN users u ON p.user_id = u.id
        WHERE u.completed_all = TRUE
      `;
      const result = await db.query(query);
      const users = result.rows;

      const results = [];

      for (const user of users) {
        try {
          const performance = await this.calculateAndUpdateUserPerformance(user.user_id);
          results.push({
            user_id: user.user_id,
            email: user.email,
            experiment_group: user.experiment_group,
            ...performance
          });
        } catch (userError) {
          console.error(`Error processing user ${user.user_id}:`, userError);
          results.push({
            user_id: user.user_id,
            email: user.email,
            error: userError.message
          });
        }
      }

      return results;

    } catch (error) {
      console.error('Error calculating all users performance:', error);
      throw error;
    }
  }

  /**
   * Get performance statistics across all users
   * @returns {Promise<Object>} Performance statistics
   */
  static async getPerformanceStatistics() {
    try {
      const query = `
        SELECT
          COUNT(DISTINCT pt.user_id) as users_with_scores,
          AVG(pt.prediction_accuracy_score) as avg_accuracy,
          AVG(pt.portfolio_performance_score) as avg_portfolio,
          AVG(pt.bonus_calculated) as avg_bonus,
          MIN(pt.prediction_accuracy_score) as min_accuracy,
          MAX(pt.prediction_accuracy_score) as max_accuracy,
          MIN(pt.portfolio_performance_score) as min_portfolio,
          MAX(pt.portfolio_performance_score) as max_portfolio
        FROM performance_tracking pt
        WHERE pt.prediction_accuracy_score IS NOT NULL
          AND pt.portfolio_performance_score IS NOT NULL
      `;

      const result = await db.query(query);
      return result.rows[0];

    } catch (error) {
      console.error('Error getting performance statistics:', error);
      throw error;
    }
  }
}

module.exports = PerformanceCalculator;