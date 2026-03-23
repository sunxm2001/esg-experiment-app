const db = require('../config/database');
const { createObjectCsvStringifier } = require('csv-writer');

/**
 * Data Export controller for exporting experiment data
 */
const dataExportController = {
  /**
   * Export all experiment data as CSV
   * GET /api/export/csv
   */
  async exportCSV(req, res, next) {
    try {
      // Complex query to join all relevant data
      const query = `
        -- Main user data with experiment group
        SELECT
          u.id as user_id,
          u.email,
          u.age,
          u.gender,
          u.education,
          u.investment_years,
          u.risk_preference_score,
          u.esg_preference_pre,
          u.experiment_group,
          u.g4_subgroup,
          u.completed_pretest,
          u.completed_news,
          u.completed_prediction,
          u.completed_posttest,
          u.completed_all,
          u.base_pay_awarded,
          u.performance_bonus,
          u.total_payment,
          u.device_type,
          u.device_platform,
          u.user_agent,
          u.screen_width,
          u.screen_height,
          u.language_preference,
          u.created_at as user_created_at,
          u.last_activity,

          -- Post-experiment evaluation
          pe.esg_financial_link_rating,
          pe.positive_affect_score,
          pe.negative_affect_score,
          pe.overall_credibility_rating,
          pe.recalled_news_topic,
          pe.recalled_news_tone,
          pe.passed_manipulation_check,
          pe.esg_preference_post,
          pe.risk_preference_post,
          pe.comments as post_experiment_comments,
          pe.created_at as post_evaluation_created_at,

          -- Performance tracking
          pt.prediction_accuracy_score,
          pt.portfolio_performance_score,
          pt.bonus_calculated,
          pt.bonus_awarded,
          pt.created_at as performance_tracking_created_at,
          pt.updated_at as performance_tracking_updated_at,

          -- Reading sessions aggregated
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'article_id', rs.article_id,
                'duration_seconds', rs.duration_seconds,
                'completed_within_limit', rs.completed_within_limit,
                'credibility_rating', rs.credibility_rating,
                'start_time', rs.start_time,
                'end_time', rs.end_time
              )
            )
            FROM reading_sessions rs
            WHERE rs.user_id = u.id
          ) as reading_sessions,

          -- Predictions aggregated
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'article_id', p.article_id,
                'future_stock_price_rating', p.future_stock_price_rating,
                'future_profitability_rating', p.future_profitability_rating,
                'capital_allocation_percentage', p.capital_allocation_percentage,
                'created_at', p.created_at
              )
            )
            FROM predictions p
            WHERE p.user_id = u.id
          ) as predictions

        FROM users u
        LEFT JOIN post_experiment_evaluations pe ON u.id = pe.user_id
        LEFT JOIN performance_tracking pt ON u.id = pt.user_id
        ORDER BY u.created_at;
      `;

      const result = await db.query(query);
      const users = result.rows;

      if (users.length === 0) {
        return res.status(404).json({ error: 'No data available for export' });
      }

      // Prepare CSV headers
      const csvHeaders = [
        { id: 'user_id', title: 'user_id' },
        { id: 'email', title: 'email' },
        { id: 'age', title: 'age' },
        { id: 'gender', title: 'gender' },
        { id: 'education', title: 'education' },
        { id: 'investment_years', title: 'investment_years' },
        { id: 'risk_preference_score', title: 'risk_preference_score' },
        { id: 'esg_preference_pre', title: 'esg_preference_pre' },
        { id: 'experiment_group', title: 'experiment_group' },
        { id: 'g4_subgroup', title: 'g4_subgroup' },
        { id: 'completed_pretest', title: 'completed_pretest' },
        { id: 'completed_news', title: 'completed_news' },
        { id: 'completed_prediction', title: 'completed_prediction' },
        { id: 'completed_posttest', title: 'completed_posttest' },
        { id: 'completed_all', title: 'completed_all' },
        { id: 'base_pay_awarded', title: 'base_pay_awarded' },
        { id: 'performance_bonus', title: 'performance_bonus' },
        { id: 'total_payment', title: 'total_payment' },
        { id: 'device_type', title: 'device_type' },
        { id: 'device_platform', title: 'device_platform' },
        { id: 'user_agent', title: 'user_agent' },
        { id: 'screen_width', title: 'screen_width' },
        { id: 'screen_height', title: 'screen_height' },
        { id: 'language_preference', title: 'language_preference' },
        { id: 'user_created_at', title: 'user_created_at' },
        { id: 'last_activity', title: 'last_activity' },
        { id: 'esg_financial_link_rating', title: 'esg_financial_link_rating' },
        { id: 'positive_affect_score', title: 'positive_affect_score' },
        { id: 'negative_affect_score', title: 'negative_affect_score' },
        { id: 'overall_credibility_rating', title: 'overall_credibility_rating' },
        { id: 'recalled_news_topic', title: 'recalled_news_topic' },
        { id: 'recalled_news_tone', title: 'recalled_news_tone' },
        { id: 'passed_manipulation_check', title: 'passed_manipulation_check' },
        { id: 'esg_preference_post', title: 'esg_preference_post' },
        { id: 'risk_preference_post', title: 'risk_preference_post' },
        { id: 'post_experiment_comments', title: 'post_experiment_comments' },
        { id: 'post_evaluation_created_at', title: 'post_evaluation_created_at' },
        { id: 'prediction_accuracy_score', title: 'prediction_accuracy_score' },
        { id: 'portfolio_performance_score', title: 'portfolio_performance_score' },
        { id: 'bonus_calculated', title: 'bonus_calculated' },
        { id: 'bonus_awarded', title: 'bonus_awarded' },
        { id: 'performance_tracking_created_at', title: 'performance_tracking_created_at' },
        { id: 'performance_tracking_updated_at', title: 'performance_tracking_updated_at' },
        { id: 'reading_sessions', title: 'reading_sessions' },
        { id: 'predictions', title: 'predictions' }
      ];

      // Create CSV stringifier
      const csvStringifier = createObjectCsvStringifier({
        header: csvHeaders
      });

      // Convert JSON arrays to string for CSV
      const csvData = users.map(user => ({
        ...user,
        reading_sessions: user.reading_sessions ? JSON.stringify(user.reading_sessions) : '',
        predictions: user.predictions ? JSON.stringify(user.predictions) : ''
      }));

      const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);

      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=esg_experiment_data.csv');
      res.send(csvString);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Export data in Stata-ready format (simplified)
   * GET /api/export/stata
   */
  async exportStata(req, res, next) {
    try {
      // For Stata, we might want a simpler, flattened structure
      // This is a simplified version - in production, you'd create proper .dta files
      const query = `
        SELECT
          u.id as user_id,
          u.experiment_group,
          u.g4_subgroup,
          u.age,
          u.gender,
          u.education,
          u.investment_years,
          u.risk_preference_score as risk_pref_pre,
          u.esg_preference_pre as esg_pref_pre,

          pe.esg_financial_link_rating,
          pe.positive_affect_score,
          pe.negative_affect_score,
          pe.overall_credibility_rating,
          pe.passed_manipulation_check,
          pe.esg_preference_post as esg_pref_post,
          pe.risk_preference_post as risk_pref_post,

          -- Aggregate reading time
          (
            SELECT AVG(duration_seconds)
            FROM reading_sessions rs
            WHERE rs.user_id = u.id AND rs.duration_seconds IS NOT NULL
          ) as avg_reading_time_seconds,

          -- Total reading time
          (
            SELECT SUM(duration_seconds)
            FROM reading_sessions rs
            WHERE rs.user_id = u.id AND rs.duration_seconds IS NOT NULL
          ) as total_reading_time_seconds,

          -- Average credibility rating
          (
            SELECT AVG(credibility_rating)
            FROM reading_sessions rs
            WHERE rs.user_id = u.id AND rs.credibility_rating IS NOT NULL
          ) as avg_credibility_rating,

          -- Prediction averages
          (
            SELECT AVG(future_stock_price_rating)
            FROM predictions p
            WHERE p.user_id = u.id AND p.future_stock_price_rating IS NOT NULL
          ) as avg_stock_price_rating,

          (
            SELECT AVG(future_profitability_rating)
            FROM predictions p
            WHERE p.user_id = u.id AND p.future_profitability_rating IS NOT NULL
          ) as avg_profitability_rating,

          -- Average capital allocation
          (
            SELECT AVG(capital_allocation_percentage)
            FROM predictions p
            WHERE p.user_id = u.id AND p.capital_allocation_percentage IS NOT NULL
          ) as avg_capital_allocation,

          -- Performance and payment
          pt.prediction_accuracy_score,
          pt.portfolio_performance_score,
          pt.bonus_calculated,
          u.base_pay_awarded,
          u.performance_bonus,
          u.total_payment

        FROM users u
        LEFT JOIN post_experiment_evaluations pe ON u.id = pe.user_id
        LEFT JOIN performance_tracking pt ON u.id = pt.user_id
        WHERE u.completed_all = TRUE
        ORDER BY u.experiment_group, u.id;
      `;

      const result = await db.query(query);
      const data = result.rows;

      if (data.length === 0) {
        return res.status(404).json({ error: 'No completed experiment data available for export' });
      }

      // For now, return as JSON with instructions for Stata conversion
      // In production, you would use a library to generate .dta files
      res.json({
        message: 'Stata export data (use statistical software to convert to .dta)',
        format: 'Each row represents a completed participant',
        variable_count: Object.keys(data[0] || {}).length,
        participant_count: data.length,
        data
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Get data export statistics
   * GET /api/export/stats
   */
  async getExportStats(req, res, next) {
    try {
      const statsQuery = `
        SELECT
          COUNT(*) as total_users,
          SUM(CASE WHEN completed_all = TRUE THEN 1 ELSE 0 END) as completed_users,
          SUM(CASE WHEN completed_all = FALSE AND completed_pretest = TRUE THEN 1 ELSE 0 END) as in_progress_users,
          COUNT(DISTINCT experiment_group) as groups_represented,
          MIN(created_at) as first_participant,
          MAX(last_activity) as last_activity,
          AVG(age) as avg_age,
          COUNT(DISTINCT gender) as gender_categories,
          COUNT(DISTINCT education) as education_categories
        FROM users;
      `;

      const statsResult = await db.query(statsQuery);
      const stats = statsResult.rows[0];

      // Get counts by experiment group
      const groupQuery = `
        SELECT experiment_group, COUNT(*) as count
        FROM users
        GROUP BY experiment_group
        ORDER BY experiment_group;
      `;

      const groupResult = await db.query(groupQuery);
      const groupCounts = groupResult.rows;

      res.json({
        export_statistics: stats,
        group_distribution: groupCounts,
        data_available: stats.total_users > 0
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Export raw table data (admin)
   * GET /api/export/raw/:tableName
   */
  async exportRawTable(req, res, next) {
    try {
      const { tableName } = req.params;
      const validTables = [
        'users', 'news_articles', 'reading_sessions',
        'predictions', 'post_experiment_evaluations', 'performance_tracking'
      ];

      if (!validTables.includes(tableName)) {
        return res.status(400).json({
          error: 'Invalid table name',
          valid_tables: validTables
        });
      }

      // Basic sanitization (in production, use parameterized query for table name)
      const query = `SELECT * FROM ${tableName} ORDER BY created_at DESC`;
      const result = await db.query(query);

      res.json({
        table: tableName,
        row_count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dataExportController;