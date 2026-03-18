const db = require('../config/database');

/**
 * Reading Session model for tracking user attention
 */
class ReadingSession {
  /**
   * Start a new reading session
   * @param {string} userId - User UUID
   * @param {string} articleId - Article UUID
   * @returns {Promise<Object>} Started session record
   */
  static async startSession(userId, articleId) {
    const query = `
      INSERT INTO reading_sessions (user_id, article_id, start_time)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    try {
      const result = await db.query(query, [userId, articleId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error starting reading session:', error);
      throw error;
    }
  }

  /**
   * Complete a reading session
   * @param {string} userId - User UUID
   * @param {string} articleId - Article UUID
   * @param {number} durationSeconds - Duration in seconds
   * @param {boolean} completedWithinLimit - Whether completed within time limit
   * @param {number} credibilityRating - Credibility rating (1-7)
   * @returns {Promise<Object>} Completed session record
   */
  static async completeSession(userId, articleId, durationSeconds, completedWithinLimit, credibilityRating) {
    // First, find the most recent session for this user and article
    const findQuery = `
      SELECT * FROM reading_sessions
      WHERE user_id = $1 AND article_id = $2 AND end_time IS NULL
      ORDER BY start_time DESC
      LIMIT 1;
    `;

    const findResult = await db.query(findQuery, [userId, articleId]);

    if (findResult.rows.length === 0) {
      // No existing session, create a new one with both start and end times
      const insertQuery = `
        INSERT INTO reading_sessions (
          user_id, article_id, start_time, end_time,
          duration_seconds, completed_within_limit, credibility_rating
        ) VALUES ($1, $2, CURRENT_TIMESTAMP - INTERVAL '${durationSeconds} seconds',
                  CURRENT_TIMESTAMP, $3, $4, $5)
        RETURNING *;
      `;

      const result = await db.query(insertQuery, [
        userId, articleId, durationSeconds, completedWithinLimit, credibilityRating
      ]);
      return result.rows[0];
    } else {
      // Update existing session
      const session = findResult.rows[0];
      const updateQuery = `
        UPDATE reading_sessions
        SET end_time = CURRENT_TIMESTAMP,
            duration_seconds = $1,
            completed_within_limit = $2,
            credibility_rating = $3
        WHERE id = $4
        RETURNING *;
      `;

      const result = await db.query(updateQuery, [
        durationSeconds,
        completedWithinLimit,
        credibilityRating,
        session.id
      ]);
      return result.rows[0];
    }
  }

  /**
   * Get reading sessions for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} List of reading sessions
   */
  static async findByUser(userId) {
    const query = `
      SELECT rs.*, na.title, na.article_type, na.is_filler
      FROM reading_sessions rs
      JOIN news_articles na ON rs.article_id = na.id
      WHERE rs.user_id = $1
      ORDER BY rs.start_time;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get reading sessions for an article
   * @param {string} articleId - Article UUID
   * @returns {Promise<Array>} List of reading sessions
   */
  static async findByArticle(articleId) {
    const query = `
      SELECT rs.*, u.email, u.experiment_group
      FROM reading_sessions rs
      JOIN users u ON rs.user_id = u.id
      WHERE rs.article_id = $1
      ORDER BY rs.start_time;
    `;
    const result = await db.query(query, [articleId]);
    return result.rows;
  }

  /**
   * Get average reading time by article type
   * @returns {Promise<Array>} Average duration by article type
   */
  static async getAverageReadingTimeByType() {
    const query = `
      SELECT na.article_type,
             AVG(rs.duration_seconds) as avg_duration,
             COUNT(*) as session_count
      FROM reading_sessions rs
      JOIN news_articles na ON rs.article_id = na.id
      WHERE rs.duration_seconds IS NOT NULL
      GROUP BY na.article_type
      ORDER BY na.article_type;
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Get reading session by ID
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object>} Session record
   */
  static async findById(sessionId) {
    const query = 'SELECT * FROM reading_sessions WHERE id = $1';
    const result = await db.query(query, [sessionId]);
    return result.rows[0];
  }

  /**
   * Get reading sessions with credibility ratings
   * @param {string} userId - User UUID (optional)
   * @returns {Promise<Array>} Sessions with credibility ratings
   */
  static async getCredibilityRatings(userId = null) {
    let query = `
      SELECT rs.*, na.title, na.article_type, u.email
      FROM reading_sessions rs
      JOIN news_articles na ON rs.article_id = na.id
      JOIN users u ON rs.user_id = u.id
      WHERE rs.credibility_rating IS NOT NULL
    `;

    const values = [];
    if (userId) {
      query += ` AND rs.user_id = $1`;
      values.push(userId);
    }

    query += ` ORDER BY rs.created_at DESC`;
    const result = await db.query(query, values);
    return result.rows;
  }

  /**
   * Get total reading time for a user
   * @param {string} userId - User UUID
   * @returns {Promise<number>} Total reading time in seconds
   */
  static async getTotalReadingTime(userId) {
    const query = `
      SELECT SUM(duration_seconds) as total_seconds
      FROM reading_sessions
      WHERE user_id = $1 AND duration_seconds IS NOT NULL;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.total_seconds || 0;
  }
}

module.exports = ReadingSession;