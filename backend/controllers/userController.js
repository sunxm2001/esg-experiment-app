const User = require('../models/User');

/**
 * User controller for handling HTTP requests
 */
const userController = {
  /**
   * Register a new user with pre-experiment data
   * POST /api/users/register
   */
  async register(req, res, next) {
    try {
      const {
        email,
        age,
        gender,
        education,
        investment_years,
        risk_preference_score,
        esg_preference_pre,
        // Device information fields
        device_type,
        device_platform,
        user_agent,
        screen_width,
        screen_height,
        language_preference
      } = req.body;

      // Validate required fields
      if (!email || !age || !gender || !education || investment_years === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: email, age, gender, education, investment_years'
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'User with this email already exists'
        });
      }

      // Create new user with random group assignment
      const user = await User.create({
        email,
        age: parseInt(age),
        gender,
        education,
        investment_years: parseInt(investment_years),
        risk_preference_score: parseFloat(risk_preference_score),
        esg_preference_pre: parseFloat(esg_preference_pre),
        // Device information (optional)
        device_type,
        device_platform,
        user_agent,
        screen_width: screen_width ? parseInt(screen_width) : null,
        screen_height: screen_height ? parseInt(screen_height) : null,
        language_preference
      });

      // Mark pre-test as completed and get updated user
      const updatedUser = await User.updateCompletion(user.id, 'pretest');

      // Return user data (excluding sensitive fields in future)
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          experiment_group: updatedUser.experiment_group,
          g4_subgroup: updatedUser.g4_subgroup,
          completed_pretest: updatedUser.completed_pretest,
          completed_news: updatedUser.completed_news,
          completed_prediction: updatedUser.completed_prediction,
          completed_posttest: updatedUser.completed_posttest,
          completed_all: updatedUser.completed_all
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user profile
   * GET /api/users/:userId
   */
  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return user data (sanitized)
      const { id, email, experiment_group, g4_subgroup, completed_pretest,
              completed_news, completed_prediction, completed_posttest,
              completed_all, created_at } = user;

      res.json({
        user: {
          id,
          email,
          experiment_group,
          g4_subgroup,
          completed_pretest,
          completed_news,
          completed_prediction,
          completed_posttest,
          completed_all,
          created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update completion status
   * POST /api/users/:userId/complete
   */
  async updateCompletion(req, res, next) {
    try {
      const { userId } = req.params;
      const { stage } = req.body;

      if (!stage) {
        return res.status(400).json({ error: 'Stage is required' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await User.updateCompletion(userId, stage);

      res.json({
        message: `Completion status updated for stage: ${stage}`,
        user: {
          id: updatedUser.id,
          completed_pretest: updatedUser.completed_pretest,
          completed_news: updatedUser.completed_news,
          completed_prediction: updatedUser.completed_prediction,
          completed_posttest: updatedUser.completed_posttest,
          completed_all: updatedUser.completed_all
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update post-experiment preferences
   * POST /api/users/:userId/post-preferences
   */
  async updatePostPreferences(req, res, next) {
    try {
      const { userId } = req.params;
      const { esg_preference_post, risk_preference_post } = req.body;

      if (esg_preference_post === undefined || risk_preference_post === undefined) {
        return res.status(400).json({
          error: 'Both esg_preference_post and risk_preference_post are required'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await User.updatePostPreferences(userId, {
        esg_preference_post: parseFloat(esg_preference_post),
        risk_preference_post: parseFloat(risk_preference_post)
      });

      res.json({
        message: 'Post-experiment preferences updated',
        user: {
          id: updatedUser.id,
          esg_preference_post: updatedUser.esg_preference_post,
          risk_preference_post: updatedUser.risk_preference_post
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Get all users
   * GET /api/users
   */
  async getAllUsers(req, res, next) {
    try {
      // In production, add admin authentication
      const users = await User.findAll();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Get users by experiment group
   * GET /api/users/group/:group
   */
  async getUsersByGroup(req, res, next) {
    try {
      const { group } = req.params;
      const validGroups = ['G1', 'G2', 'G3', 'G4', 'G5'];

      if (!validGroups.includes(group)) {
        return res.status(400).json({ error: 'Invalid experiment group' });
      }

      // In production, add admin authentication
      const users = await User.findByGroup(group);
      res.json({ group, users });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;