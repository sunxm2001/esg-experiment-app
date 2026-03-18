const PerformanceTracking = require('../models/PerformanceTracking');
const User = require('../models/User');
const PerformanceCalculator = require('../services/performanceCalculator');
const db = require('../config/database');

/**
 * Incentive controller for handling bonus calculation and payment
 */
const incentiveController = {
  /**
   * Calculate and update performance bonus for a user
   * POST /api/incentives/calculate/:userId
   */
  async calculateBonus(req, res, next) {
    try {
      const { userId } = req.params;
      const {
        prediction_accuracy_score,
        portfolio_performance_score,
        bonus_config
      } = req.body;

      // Validate scores (0-100)
      if (prediction_accuracy_score === undefined || portfolio_performance_score === undefined) {
        return res.status(400).json({
          error: 'prediction_accuracy_score and portfolio_performance_score are required'
        });
      }

      if (prediction_accuracy_score < 0 || prediction_accuracy_score > 100 ||
          portfolio_performance_score < 0 || portfolio_performance_score > 100) {
        return res.status(400).json({
          error: 'Scores must be between 0 and 100'
        });
      }

      // Calculate bonus
      const bonus_calculated = PerformanceTracking.calculateBonus(
        prediction_accuracy_score,
        portfolio_performance_score,
        bonus_config
      );

      // Update performance tracking
      const tracking = await PerformanceTracking.upsert({
        user_id: userId,
        prediction_accuracy_score,
        portfolio_performance_score,
        bonus_calculated,
        bonus_awarded: false
      });

      res.json({
        message: 'Bonus calculated successfully',
        tracking: {
          user_id: tracking.user_id,
          prediction_accuracy_score: tracking.prediction_accuracy_score,
          portfolio_performance_score: tracking.portfolio_performance_score,
          bonus_calculated: tracking.bonus_calculated,
          bonus_awarded: tracking.bonus_awarded,
          updated_at: tracking.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Award bonus to user (mark as paid)
   * POST /api/incentives/award/:userId
   */
  async awardBonus(req, res, next) {
    try {
      const { userId } = req.params;
      const { base_pay_awarded } = req.body;

      // Get performance tracking record
      const tracking = await PerformanceTracking.findByUser(userId);
      if (!tracking) {
        return res.status(404).json({
          error: 'Performance tracking record not found for this user'
        });
      }

      if (tracking.bonus_awarded) {
        return res.status(409).json({
          error: 'Bonus already awarded to this user'
        });
      }

      // Calculate total payment
      const basePay = base_pay_awarded || 0;
      const total_payment = basePay + (tracking.bonus_calculated || 0);

      // Update user payment information
      const user = await User.updatePayment(userId, {
        base_pay_awarded: basePay,
        performance_bonus: tracking.bonus_calculated,
        total_payment
      });

      // Mark bonus as awarded
      await PerformanceTracking.updateBonusAwarded(userId, true);

      res.json({
        message: 'Bonus awarded successfully',
        payment: {
          user_id: user.id,
          email: user.email,
          base_pay_awarded: user.base_pay_awarded,
          performance_bonus: user.performance_bonus,
          total_payment: user.total_payment,
          awarded_at: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get performance tracking for a user
   * GET /api/incentives/user/:userId
   */
  async getUserPerformance(req, res, next) {
    try {
      const { userId } = req.params;
      const tracking = await PerformanceTracking.findByUser(userId);

      if (!tracking) {
        return res.status(404).json({
          error: 'Performance tracking record not found for this user'
        });
      }

      res.json({
        tracking: {
          user_id: tracking.user_id,
          user_email: tracking.email,
          experiment_group: tracking.experiment_group,
          prediction_accuracy_score: tracking.prediction_accuracy_score,
          portfolio_performance_score: tracking.portfolio_performance_score,
          bonus_calculated: tracking.bonus_calculated,
          bonus_awarded: tracking.bonus_awarded,
          created_at: tracking.created_at,
          updated_at: tracking.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all performance tracking records (admin)
   * GET /api/incentives
   */
  async getAllPerformance(req, res, next) {
    try {
      const tracking = await PerformanceTracking.findAll();
      res.json({
        tracking_count: tracking.length,
        tracking: tracking.map(t => ({
          user_id: t.user_id,
          user_email: t.email,
          experiment_group: t.experiment_group,
          prediction_accuracy_score: t.prediction_accuracy_score,
          portfolio_performance_score: t.portfolio_performance_score,
          bonus_calculated: t.bonus_calculated,
          bonus_awarded: t.bonus_awarded,
          updated_at: t.updated_at
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get performance statistics
   * GET /api/incentives/stats
   */
  async getPerformanceStats(req, res, next) {
    try {
      const stats = await PerformanceTracking.getStatistics();
      res.json({ stats });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get users eligible for bonus
   * GET /api/incentives/eligible
   */
  async getEligibleUsers(req, res, next) {
    try {
      const { threshold } = req.query;
      const eligible = await PerformanceTracking.getEligibleForBonus(threshold ? parseFloat(threshold) : 60);

      res.json({
        eligible_count: eligible.length,
        threshold: threshold || 60,
        eligible: eligible.map(e => ({
          user_id: e.user_id,
          user_email: e.email,
          experiment_group: e.experiment_group,
          prediction_accuracy_score: e.prediction_accuracy_score,
          portfolio_performance_score: e.portfolio_performance_score,
          bonus_calculated: e.bonus_calculated,
          bonus_awarded: e.bonus_awarded
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Automatically calculate bonus for a user based on their predictions
   * POST /api/incentives/calculate-auto/:userId
   */
  async calculateBonusAuto(req, res, next) {
    try {
      const { userId } = req.params;
      const { bonus_config } = req.body;

      // Validate user exists
      const userCheckQuery = 'SELECT id FROM users WHERE id = $1';
      const userResult = await db.query(userCheckQuery, [userId]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate performance scores
      const performance = await PerformanceCalculator.calculateAndUpdateUserPerformance(userId);

      res.json({
        message: 'Bonus calculated automatically based on predictions',
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
   * Update bonus calculation configuration and recalculate for all users
   * POST /api/incentives/recalculate
   */
  async recalculateAllBonuses(req, res, next) {
    try {
      // This would be a complex operation in production
      // For now, return a placeholder response
      res.json({
        message: 'Recalculation endpoint. In production, this would recalculate bonuses for all users based on new configuration.',
        note: 'Implementation would require fetching all users, recalculating scores, and updating performance tracking records.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = incentiveController;