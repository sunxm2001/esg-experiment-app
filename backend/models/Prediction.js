const db = require('../config/database');

/**
 * Prediction model for storing user predictions and trading decisions
 */
class Prediction {
  /**
   * Create a new prediction record
   * @param {Object} predictionData - Prediction data
   * @returns {Promise<Object>} Created prediction record
   */
  static async create(predictionData) {
    const {
      user_id,
      article_id,
      future_stock_price_rating,
      future_profitability_rating,
      capital_allocation_percentage
    } = predictionData;

    const query = `
      INSERT INTO predictions (
        user_id, article_id,
        future_stock_price_rating, future_profitability_rating,
        capital_allocation_percentage
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      user_id,
      article_id,
      future_stock_price_rating,
      future_profitability_rating,
      capital_allocation_percentage
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating prediction:', error);
      throw error;
    }
  }

  /**
   * Get predictions by user
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} List of predictions for the user
   */
  static async findByUser(userId) {
    const query = `
      SELECT p.*, na.title, na.article_type, na.is_filler
      FROM predictions p
      JOIN news_articles na ON p.article_id = na.id
      WHERE p.user_id = $1
      ORDER BY p.created_at;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get predictions by article
   * @param {string} articleId - Article UUID
   * @returns {Promise<Array>} List of predictions for the article
   */
  static async findByArticle(articleId) {
    const query = `
      SELECT p.*, u.email, u.experiment_group
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      WHERE p.article_id = $1
      ORDER BY p.created_at;
    `;
    const result = await db.query(query, [articleId]);
    return result.rows;
  }

  /**
   * Get prediction by ID
   * @param {string} predictionId - Prediction UUID
   * @returns {Promise<Object>} Prediction record
   */
  static async findById(predictionId) {
    const query = 'SELECT * FROM predictions WHERE id = $1';
    const result = await db.query(query, [predictionId]);
    return result.rows[0];
  }

  /**
   * Get average ratings by article type
   * @returns {Promise<Array>} Average ratings by article type
   */
  static async getAverageRatingsByArticleType() {
    const query = `
      SELECT na.article_type,
             AVG(p.future_stock_price_rating) as avg_stock_rating,
             AVG(p.future_profitability_rating) as avg_profitability_rating,
             AVG(p.capital_allocation_percentage) as avg_allocation,
             COUNT(*) as prediction_count
      FROM predictions p
      JOIN news_articles na ON p.article_id = na.id
      WHERE na.is_filler = FALSE
      GROUP BY na.article_type
      ORDER BY na.article_type;
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Get predictions by experiment group
   * @param {string} group - Experiment group (G1-G5)
   * @returns {Promise<Array>} List of predictions for the group
   */
  static async findByExperimentGroup(group) {
    const query = `
      SELECT p.*, u.email, na.title, na.article_type
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      JOIN news_articles na ON p.article_id = na.id
      WHERE u.experiment_group = $1 AND na.is_filler = FALSE
      ORDER BY p.created_at;
    `;
    const result = await db.query(query, [group]);
    return result.rows;
  }

  /**
   * Update prediction
   * @param {string} predictionId - Prediction UUID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated prediction record
   */
  static async update(predictionId, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(predictionId);
    const query = `
      UPDATE predictions
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete prediction
   * @param {string} predictionId - Prediction UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(predictionId) {
    const query = 'DELETE FROM predictions WHERE id = $1';
    const result = await db.query(query, [predictionId]);
    return result.rowCount > 0;
  }

  /**
   * Get prediction statistics for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Statistics for the user
   */
  static async getUserStatistics(userId) {
    const query = `
      SELECT
        COUNT(*) as total_predictions,
        AVG(future_stock_price_rating) as avg_stock_rating,
        AVG(future_profitability_rating) as avg_profitability_rating,
        AVG(capital_allocation_percentage) as avg_allocation,
        SUM(capital_allocation_percentage) as total_allocation
      FROM predictions
      WHERE user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Check if user has already predicted for an article
   * @param {string} userId - User UUID
   * @param {string} articleId - Article UUID
   * @returns {Promise<boolean>} Whether prediction exists
   */
  static async hasPrediction(userId, articleId) {
    const query = `
      SELECT COUNT(*) as count
      FROM predictions
      WHERE user_id = $1 AND article_id = $2;
    `;
    const result = await db.query(query, [userId, articleId]);
    return result.rows[0].count > 0;
  }
}

module.exports = Prediction;