const db = require('../config/database');

/**
 * User model for ESG experiment
 */
class User {
  // Cache for group counts to reduce database queries during registration bursts
  static groupCountsCache = {
    counts: null,
    timestamp: 0,
    ttl: 10000 // 10 seconds cache time
  };
  /**
   * Create a new user with random experiment group assignment
   * @param {Object} userData - User demographics and pre-test data
   * @returns {Promise<Object>} Created user record
   */
  static async create(userData) {
    const {
      email,
      age,
      gender,
      education,
      investment_years,
      risk_preference_score,
      esg_preference_pre,
      // Device information (optional, with defaults)
      device_type = 'desktop',
      device_platform = 'unknown',
      user_agent = '',
      screen_width = null,
      screen_height = null,
      language_preference = 'en'
    } = userData;

    // Generate balanced random experiment group assignment
    const { experimentGroup, g4Subgroup } = await this.assignExperimentGroupBalanced();

    const query = `
      INSERT INTO users (
        email, age, gender, education, investment_years,
        risk_preference_score, esg_preference_pre,
        experiment_group, g4_subgroup,
        device_type, device_platform, user_agent,
        screen_width, screen_height, language_preference
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;

    const values = [
      email,
      age,
      gender,
      education,
      investment_years,
      risk_preference_score,
      esg_preference_pre,
      experimentGroup,
      g4Subgroup,
      device_type,
      device_platform,
      user_agent,
      screen_width,
      screen_height,
      language_preference
    ];

    try {
      const result = await db.query(query, values);

      // Invalidate group counts cache since we added a new user
      this.groupCountsCache.counts = null;
      this.groupCountsCache.timestamp = 0;

      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get current counts of users in each experiment group
   * @returns {Promise<Object>} Group counts
   */
  static async getGroupCounts(forceRefresh = false) {
    // Return cached counts if still valid and not forcing refresh
    const now = Date.now();
    if (!forceRefresh &&
        this.groupCountsCache.counts &&
        (now - this.groupCountsCache.timestamp) < this.groupCountsCache.ttl) {
      return { ...this.groupCountsCache.counts }; // Return a copy
    }

    const query = `
      SELECT experiment_group, COUNT(*) as count
      FROM users
      GROUP BY experiment_group
      ORDER BY experiment_group;
    `;
    const result = await db.query(query);

    const counts = { G1: 0, G2: 0, G3: 0, G4: 0, G5: 0 };
    result.rows.forEach(row => {
      counts[row.experiment_group] = parseInt(row.count);
    });

    // Update cache
    this.groupCountsCache.counts = { ...counts }; // Store a copy
    this.groupCountsCache.timestamp = now;

    return counts;
  }

  /**
   * Assign user to experiment group with balanced randomization
   * Uses minimization algorithm to keep groups balanced
   * G1 (control): neutral news
   * G2 (financial only): positive financial narrative
   * G3 (ESG only): positive ESG, financially neutral
   * G4 (bundled): positive ESG + positive financial content
   *   - G4a (single bundle): cues in same article
   *   - G4b (split bundle): cues across two consecutive articles
   * G5 (placebo): positive but non-ESG, non-financial news
   * @returns {Object} experimentGroup and g4Subgroup (if applicable)
   */
  static async assignExperimentGroupBalanced() {
    const groups = ['G1', 'G2', 'G3', 'G4', 'G5'];

    // Get current group counts
    const counts = await this.getGroupCounts();

    // Calculate total users and find minimum count group
    const totalUsers = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const minCount = Math.min(...Object.values(counts));

    // Create weighted probabilities - lower count groups get higher probability
    const weights = groups.map(group => {
      const count = counts[group];
      // Base weight inversely proportional to relative size
      // If group has minimum count, weight = 2, else weight = 1
      return count === minCount ? 2 : 1;
    });

    // Normalize weights to probabilities
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const probabilities = weights.map(w => w / totalWeight);

    // Random selection with weighted probabilities
    let randomValue = Math.random();
    let selectedGroup = groups[0]; // default

    for (let i = 0; i < groups.length; i++) {
      if (randomValue < probabilities[i]) {
        selectedGroup = groups[i];
        break;
      }
      randomValue -= probabilities[i];
    }

    const experimentGroup = selectedGroup;
    let g4Subgroup = null;

    // For G4, randomly assign to subgroup G4a or G4b
    if (experimentGroup === 'G4') {
      g4Subgroup = Math.random() < 0.5 ? 'single' : 'split';
    }

    console.log(`Assigned user to group ${experimentGroup} (G4 subgroup: ${g4Subgroup})`);
    console.log(`Current group distribution:`, counts);

    return { experimentGroup, g4Subgroup };
  }

  /**
   * Assign user to experiment group (legacy method - maintains backward compatibility)
   * @returns {Object} experimentGroup and g4Subgroup (if applicable)
   */
  static assignExperimentGroup() {
    const groups = ['G1', 'G2', 'G3', 'G4', 'G5'];

    // Simple random assignment with equal probability
    // Kept for backward compatibility, but recommend using assignExperimentGroupBalanced
    const randomIndex = Math.floor(Math.random() * groups.length);
    const experimentGroup = groups[randomIndex];

    let g4Subgroup = null;

    // For G4, randomly assign to subgroup G4a or G4b
    if (experimentGroup === 'G4') {
      g4Subgroup = Math.random() < 0.5 ? 'single' : 'split';
    }

    return { experimentGroup, g4Subgroup };
  }

  /**
   * Find user by ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} User record
   */
  static async findById(userId) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User record
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Update user completion status
   * @param {string} userId - User UUID
   * @param {string} stage - Completion stage: 'pretest', 'news', 'prediction', 'posttest', 'all'
   * @returns {Promise<Object>} Updated user record
   */
  static async updateCompletion(userId, stage) {
    const stageMap = {
      pretest: 'completed_pretest',
      news: 'completed_news',
      prediction: 'completed_prediction',
      posttest: 'completed_posttest',
      all: 'completed_all'
    };

    const column = stageMap[stage];
    if (!column) {
      throw new Error('Invalid completion stage');
    }

    const query = `
      UPDATE users
      SET ${column} = TRUE, last_activity = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Update user's post-experiment preferences
   * @param {string} userId - User UUID
   * @param {Object} data - Post-experiment preference scores
   * @returns {Promise<Object>} Updated user record
   */
  static async updatePostPreferences(userId, data) {
    const { esg_preference_post, risk_preference_post } = data;

    const query = `
      UPDATE users
      SET esg_preference_post = $1, risk_preference_post = $2,
          last_activity = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;

    const result = await db.query(query, [esg_preference_post, risk_preference_post, userId]);
    return result.rows[0];
  }

  /**
   * Get all users (for admin purposes)
   * @returns {Promise<Array>} List of users
   */
  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Get users by experiment group
   * @param {string} group - Experiment group (G1-G5)
   * @returns {Promise<Array>} List of users in the group
   */
  static async findByGroup(group) {
    const query = 'SELECT * FROM users WHERE experiment_group = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [group]);
    return result.rows;
  }

  /**
   * Update user payment information
   * @param {string} userId - User UUID
   * @param {Object} payment - Payment amounts
   * @returns {Promise<Object>} Updated user record
   */
  static async updatePayment(userId, payment) {
    const { base_pay_awarded, performance_bonus, total_payment } = payment;

    const query = `
      UPDATE users
      SET base_pay_awarded = $1, performance_bonus = $2, total_payment = $3,
          last_activity = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;

    const result = await db.query(query, [base_pay_awarded, performance_bonus, total_payment, userId]);
    return result.rows[0];
  }
}

module.exports = User;