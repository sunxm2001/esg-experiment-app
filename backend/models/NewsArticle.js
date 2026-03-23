const db = require('../config/database');

/**
 * News Article model for ESG experiment
 */
class NewsArticle {
  /**
   * Create a new news article
   * @param {Object} articleData - Article data
   * @returns {Promise<Object>} Created article record
   */
  static async create(articleData) {
    const {
      title,
      content,
      title_zh,
      content_zh,
      article_type,
      bundle_type,
      target_group,
      display_order,
      time_limit_seconds,
      is_filler,
      true_future_stock_price_rating,
      true_future_profitability_rating
    } = articleData;

    const query = `
      INSERT INTO news_articles (
        title, content, title_zh, content_zh, article_type, bundle_type, target_group,
        display_order, time_limit_seconds, is_filler,
        true_future_stock_price_rating, true_future_profitability_rating
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const values = [
      title,
      content,
      title_zh || null,
      content_zh || null,
      article_type,
      bundle_type,
      target_group,
      display_order,
      time_limit_seconds || 60,
      is_filler || false,
      true_future_stock_price_rating || null,
      true_future_profitability_rating || null
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating news article:', error);
      throw error;
    }
  }

  /**
   * Get article by ID
   * @param {string} articleId - Article UUID
   * @returns {Promise<Object>} Article record
   */
  static async findById(articleId) {
    const query = 'SELECT * FROM news_articles WHERE id = $1';
    const result = await db.query(query, [articleId]);
    return result.rows[0];
  }

  /**
   * Get articles for a specific experiment group
   * Includes both target articles and filler articles
   * @param {string} experimentGroup - Experiment group (G1-G5)
   * @param {string} g4Subgroup - For G4 group: 'single' or 'split' (optional)
   * @returns {Promise<Array>} List of articles in display order
   */
  static async getArticlesForGroup(experimentGroup, g4Subgroup = null) {
    // Base query for target articles
    let query = `
      SELECT * FROM news_articles
      WHERE (target_group = $1 OR target_group IS NULL)
    `;
    const values = [experimentGroup];

    // For G4 group, filter by bundle_type if subgroup is specified
    if (experimentGroup === 'G4' && g4Subgroup) {
      query += ` AND (bundle_type = $2 OR bundle_type IS NULL)`;
      values.push(g4Subgroup);
    }

    // Add filler articles (is_filler = TRUE)
    query += ` OR is_filler = TRUE`;

    // Order by display_order (NULLS LAST for fillers without order)
    query += ` ORDER BY display_order NULLS LAST, created_at`;

    const result = await db.query(query, values);
    return result.rows;
  }

  /**
   * Get articles by type
   * @param {string} articleType - Article type
   * @returns {Promise<Array>} List of articles
   */
  static async findByType(articleType) {
    const query = 'SELECT * FROM news_articles WHERE article_type = $1 ORDER BY display_order';
    const result = await db.query(query, [articleType]);
    return result.rows;
  }

  /**
   * Get all articles (for admin)
   * @returns {Promise<Array>} List of all articles
   */
  static async findAll() {
    const query = 'SELECT * FROM news_articles ORDER BY target_group, display_order';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update article
   * @param {string} articleId - Article UUID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated article record
   */
  static async update(articleId, updateData) {
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

    values.push(articleId);
    const query = `
      UPDATE news_articles
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete article
   * @param {string} articleId - Article UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(articleId) {
    const query = 'DELETE FROM news_articles WHERE id = $1';
    const result = await db.query(query, [articleId]);
    return result.rowCount > 0;
  }

  /**
   * Get filler articles only
   * @returns {Promise<Array>} List of filler articles
   */
  static async getFillerArticles() {
    const query = 'SELECT * FROM news_articles WHERE is_filler = TRUE ORDER BY display_order';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Get article count by type
   * @returns {Promise<Object>} Counts by article type
   */
  static async getCountsByType() {
    const query = `
      SELECT article_type, COUNT(*) as count
      FROM news_articles
      GROUP BY article_type
      ORDER BY article_type;
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = NewsArticle;