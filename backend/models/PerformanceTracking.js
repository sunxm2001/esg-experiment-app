const db = require('../config/database');

/**
 * Performance Tracking model for incentive calculation
 */
class PerformanceTracking {
  /**
   * Create or update performance tracking record
   * @param {Object} trackingData - Performance data
   * @returns {Promise<Object>} Created/updated tracking record
   */
  static async upsert(trackingData) {
    const {
      user_id,
      prediction_accuracy_score,
      portfolio_performance_score,
      bonus_calculated,
      bonus_awarded
    } = trackingData;

    // Check if record already exists
    const existingQuery = 'SELECT * FROM performance_tracking WHERE user_id = $1';
    const existingResult = await db.query(existingQuery, [user_id]);

    if (existingResult.rows.length > 0) {
      // Update existing record
      const updateQuery = `
        UPDATE performance_tracking
        SET prediction_accuracy_score = $1,
            portfolio_performance_score = $2,
            bonus_calculated = $3,
            bonus_awarded = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $5
        RETURNING *;
      `;

      const result = await db.query(updateQuery, [
        prediction_accuracy_score,
        portfolio_performance_score,
        bonus_calculated,
        bonus_awarded,
        user_id
      ]);
      return result.rows[0];
    } else {
      // Create new record
      const insertQuery = `
        INSERT INTO performance_tracking (
          user_id,
          prediction_accuracy_score,
          portfolio_performance_score,
          bonus_calculated,
          bonus_awarded
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const result = await db.query(insertQuery, [
        user_id,
        prediction_accuracy_score,
        portfolio_performance_score,
        bonus_calculated,
        bonus_awarded
      ]);
      return result.rows[0];
    }
  }

  /**
   * Get performance tracking by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Tracking record
   */
  static async findByUser(userId) {
    const query = `
      SELECT pt.*, u.email, u.experiment_group
      FROM performance_tracking pt
      JOIN users u ON pt.user_id = u.id
      WHERE pt.user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get all performance tracking records (admin)
   * @returns {Promise<Array>} List of tracking records
   */
  static async findAll() {
    const query = `
      SELECT pt.*, u.email, u.experiment_group
      FROM performance_tracking pt
      JOIN users u ON pt.user_id = u.id
      ORDER BY pt.updated_at DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Calculate bonus based on scores
   * @param {number} predictionAccuracy - Prediction accuracy score (0-100)
   * @param {number} portfolioPerformance - Portfolio performance score (0-100)
   * @param {Object} config - Bonus calculation configuration
   * @returns {number} Calculated bonus amount
   */
  static calculateBonus(predictionAccuracy, portfolioPerformance, config = {}) {
    const {
      baseBonus = 0,
      predictionWeight = 0.5,
      portfolioWeight = 0.5,
      maxBonus = 50
    } = config;

    // Simple weighted average calculation
    const weightedScore = (predictionAccuracy * predictionWeight) +
                         (portfolioPerformance * portfolioWeight);

    // Scale to bonus amount (0 to maxBonus)
    const bonus = baseBonus + (weightedScore / 100) * maxBonus;

    return Math.min(bonus, maxBonus + baseBonus);
  }

  /**
   * Get performance statistics
   * @returns {Promise<Object>} Performance statistics
   */
  static async getStatistics() {
    const query = `
      SELECT
        COUNT(*) as total_tracked,
        AVG(prediction_accuracy_score) as avg_prediction_accuracy,
        AVG(portfolio_performance_score) as avg_portfolio_performance,
        AVG(bonus_calculated) as avg_bonus_calculated,
        SUM(CASE WHEN bonus_awarded = TRUE THEN 1 ELSE 0 END) as bonuses_awarded
      FROM performance_tracking;
    `;
    const result = await db.query(query);
    return result.rows[0];
  }

  /**
   * Update bonus awarded status
   * @param {string} userId - User UUID
   * @param {boolean} awarded - Whether bonus has been awarded
   * @returns {Promise<Object>} Updated tracking record
   */
  static async updateBonusAwarded(userId, awarded) {
    const query = `
      UPDATE performance_tracking
      SET bonus_awarded = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING *;
    `;
    const result = await db.query(query, [awarded, userId]);
    return result.rows[0];
  }

  /**
   * Get users eligible for bonus (score above threshold)
   * @param {number} threshold - Minimum score threshold
   * @returns {Promise<Array>} Eligible users
   */
  static async getEligibleForBonus(threshold = 60) {
    const query = `
      SELECT pt.*, u.email, u.experiment_group
      FROM performance_tracking pt
      JOIN users u ON pt.user_id = u.id
      WHERE (pt.prediction_accuracy_score >= $1 OR
             pt.portfolio_performance_score >= $1)
        AND pt.bonus_awarded = FALSE
      ORDER BY pt.bonus_calculated DESC;
    `;
    const result = await db.query(query, [threshold]);
    return result.rows;
  }
}

module.exports = PerformanceTracking;