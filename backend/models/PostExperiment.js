const db = require('../config/database');

/**
 * Post-Experiment Evaluation model
 */
class PostExperiment {
  /**
   * Create a new post-experiment evaluation record
   * @param {Object} evaluationData - Evaluation data
   * @returns {Promise<Object>} Created evaluation record
   */
  static async create(evaluationData) {
    const {
      user_id,
      esg_financial_link_rating,
      positive_affect_score,
      negative_affect_score,
      overall_credibility_rating,
      recalled_news_topic,
      recalled_news_tone,
      passed_manipulation_check,
      esg_preference_post,
      risk_preference_post,
      comments,
      quality_metrics = null,
      attention_check_score = null,
      straightlining_detected = false,
      inconsistent_responses = false,
      completion_time_seconds = null
    } = evaluationData;

    const query = `
      INSERT INTO post_experiment_evaluations (
        user_id,
        esg_financial_link_rating,
        positive_affect_score,
        negative_affect_score,
        overall_credibility_rating,
        recalled_news_topic,
        recalled_news_tone,
        passed_manipulation_check,
        esg_preference_post,
        risk_preference_post,
        comments,
        quality_metrics,
        attention_check_score,
        straightlining_detected,
        inconsistent_responses,
        completion_time_seconds
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;

    const values = [
      user_id,
      esg_financial_link_rating,
      positive_affect_score,
      negative_affect_score,
      overall_credibility_rating,
      recalled_news_topic,
      recalled_news_tone,
      passed_manipulation_check,
      esg_preference_post,
      risk_preference_post,
      comments,
      quality_metrics,
      attention_check_score,
      straightlining_detected,
      inconsistent_responses,
      completion_time_seconds
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating post-experiment evaluation:', error);
      throw error;
    }
  }

  /**
   * Get evaluation by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Evaluation record
   */
  static async findByUser(userId) {
    const query = `
      SELECT pe.*, u.email, u.experiment_group, u.g4_subgroup
      FROM post_experiment_evaluations pe
      JOIN users u ON pe.user_id = u.id
      WHERE pe.user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get all evaluations (for admin)
   * @returns {Promise<Array>} List of all evaluations
   */
  static async findAll() {
    const query = `
      SELECT pe.*, u.email, u.experiment_group, u.g4_subgroup
      FROM post_experiment_evaluations pe
      JOIN users u ON pe.user_id = u.id
      ORDER BY pe.created_at DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update evaluation
   * @param {string} userId - User UUID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated evaluation record
   */
  static async update(userId, updateData) {
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

    values.push(userId);
    const query = `
      UPDATE post_experiment_evaluations
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete evaluation
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(userId) {
    const query = 'DELETE FROM post_experiment_evaluations WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rowCount > 0;
  }

  /**
   * Get statistics about manipulation check results
   * @returns {Promise<Object>} Manipulation check statistics
   */
  static async getManipulationCheckStats() {
    const query = `
      SELECT
        COUNT(*) as total_evaluations,
        SUM(CASE WHEN passed_manipulation_check = TRUE THEN 1 ELSE 0 END) as passed_count,
        SUM(CASE WHEN passed_manipulation_check = FALSE THEN 1 ELSE 0 END) as failed_count,
        AVG(CASE WHEN passed_manipulation_check = TRUE THEN 1.0 ELSE 0.0 END) as pass_rate
      FROM post_experiment_evaluations;
    `;
    const result = await db.query(query);
    return result.rows[0];
  }

  /**
   * Get average ratings by experiment group
   * @returns {Promise<Array>} Average ratings by group
   */
  static async getAverageRatingsByGroup() {
    const query = `
      SELECT
        u.experiment_group,
        AVG(pe.esg_financial_link_rating) as avg_esg_financial_link,
        AVG(pe.positive_affect_score) as avg_positive_affect,
        AVG(pe.negative_affect_score) as avg_negative_affect,
        AVG(pe.overall_credibility_rating) as avg_credibility,
        COUNT(*) as evaluation_count
      FROM post_experiment_evaluations pe
      JOIN users u ON pe.user_id = u.id
      GROUP BY u.experiment_group
      ORDER BY u.experiment_group;
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Get preference changes (pre-post)
   * @returns {Promise<Array>} Preference changes per user
   */
  static async getPreferenceChanges() {
    const query = `
      SELECT
        u.id as user_id,
        u.email,
        u.experiment_group,
        u.esg_preference_pre,
        pe.esg_preference_post,
        (pe.esg_preference_post - u.esg_preference_pre) as esg_preference_change,
        u.risk_preference_score as risk_preference_pre,
        pe.risk_preference_post,
        (pe.risk_preference_post - u.risk_preference_score) as risk_preference_change
      FROM users u
      JOIN post_experiment_evaluations pe ON u.id = pe.user_id
      WHERE u.esg_preference_pre IS NOT NULL AND pe.esg_preference_post IS NOT NULL
      ORDER BY u.experiment_group, u.id;
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Check if user has completed post-experiment evaluation
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Whether evaluation exists
   */
  static async hasEvaluation(userId) {
    const query = 'SELECT COUNT(*) as count FROM post_experiment_evaluations WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0].count > 0;
  }
}

module.exports = PostExperiment;