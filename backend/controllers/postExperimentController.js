const PostExperiment = require('../models/PostExperiment');

/**
 * Post-Experiment controller for handling evaluation HTTP requests
 */
const postExperimentController = {
  /**
   * Submit post-experiment evaluation
   * POST /api/post-experiment
   */
  async submitEvaluation(req, res, next) {
    try {
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
        attention_check_1,
        attention_check_2
      } = req.body;

      // Validate required fields
      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      // Validate rating ranges
      if (esg_financial_link_rating !== undefined) {
        if (esg_financial_link_rating < 1 || esg_financial_link_rating > 7) {
          return res.status(400).json({
            error: 'esg_financial_link_rating must be between 1 and 7'
          });
        }
      }

      if (positive_affect_score !== undefined) {
        if (positive_affect_score < 1 || positive_affect_score > 5) {
          return res.status(400).json({
            error: 'positive_affect_score must be between 1 and 5'
          });
        }
      }

      if (negative_affect_score !== undefined) {
        if (negative_affect_score < 1 || negative_affect_score > 5) {
          return res.status(400).json({
            error: 'negative_affect_score must be between 1 and 5'
          });
        }
      }

      if (overall_credibility_rating !== undefined) {
        if (overall_credibility_rating < 1 || overall_credibility_rating > 7) {
          return res.status(400).json({
            error: 'overall_credibility_rating must be between 1 and 7'
          });
        }
      }

      // Check if evaluation already exists for this user
      const existingEvaluation = await PostExperiment.hasEvaluation(user_id);
      if (existingEvaluation) {
        return res.status(409).json({
          error: 'Post-experiment evaluation already exists for this user'
        });
      }

      // Calculate data quality metrics
      let attention_check_score = 0;
      if (attention_check_1 !== undefined && attention_check_2 !== undefined) {
        const correct1 = attention_check_1 === 7; // Should select "Strongly Agree" (7)
        const correct2 = attention_check_2 === 1; // Should select "Not at all" (1)
        if (correct1 && correct2) {
          attention_check_score = 1.0;
        } else if (correct1 || correct2) {
          attention_check_score = 0.5;
        } else {
          attention_check_score = 0.0;
        }
      }

      // Detect straightlining (same response across all Likert scale questions)
      let straightlining_detected = false;
      const likertValues = [
        esg_financial_link_rating,
        overall_credibility_rating,
        risk_preference_post,
        esg_preference_post
      ].filter(val => val !== undefined);

      if (likertValues.length >= 2) {
        const firstValue = likertValues[0];
        straightlining_detected = likertValues.every(val => val === firstValue);
      }

      // Detect inconsistent responses (both positive and negative affect scores are high)
      let inconsistent_responses = false;
      if (positive_affect_score !== undefined && negative_affect_score !== undefined) {
        // If both positive and negative scores are high (>=4), flag as potentially inconsistent
        inconsistent_responses = positive_affect_score >= 4 && negative_affect_score >= 4;
      }

      // Prepare quality metrics JSON
      const quality_metrics = {
        attention_check: {
          check1: { value: attention_check_1, expected: 7, correct: attention_check_1 === 7 },
          check2: { value: attention_check_2, expected: 1, correct: attention_check_2 === 1 },
          score: attention_check_score
        },
        straightlining: {
          detected: straightlining_detected,
          values: likertValues
        },
        inconsistency: {
          detected: inconsistent_responses,
          positive_affect: positive_affect_score,
          negative_affect: negative_affect_score
        },
        calculated_at: new Date().toISOString()
      };

      // For now, completion time is not tracked - set to null
      const completion_time_seconds = null;

      const evaluation = await PostExperiment.create({
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
      });

      res.status(201).json({
        message: 'Post-experiment evaluation submitted successfully',
        evaluation: {
          id: evaluation.id,
          user_id: evaluation.user_id,
          esg_financial_link_rating: evaluation.esg_financial_link_rating,
          positive_affect_score: evaluation.positive_affect_score,
          negative_affect_score: evaluation.negative_affect_score,
          overall_credibility_rating: evaluation.overall_credibility_rating,
          recalled_news_topic: evaluation.recalled_news_topic,
          recalled_news_tone: evaluation.recalled_news_tone,
          passed_manipulation_check: evaluation.passed_manipulation_check,
          esg_preference_post: evaluation.esg_preference_post,
          risk_preference_post: evaluation.risk_preference_post,
          created_at: evaluation.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get evaluation for a user
   * GET /api/post-experiment/user/:userId
   */
  async getUserEvaluation(req, res, next) {
    try {
      const { userId } = req.params;
      const evaluation = await PostExperiment.findByUser(userId);

      if (!evaluation) {
        return res.status(404).json({ error: 'Evaluation not found for this user' });
      }

      res.json({
        evaluation: {
          id: evaluation.id,
          user_id: evaluation.user_id,
          user_email: evaluation.email,
          experiment_group: evaluation.experiment_group,
          g4_subgroup: evaluation.g4_subgroup,
          esg_financial_link_rating: evaluation.esg_financial_link_rating,
          positive_affect_score: evaluation.positive_affect_score,
          negative_affect_score: evaluation.negative_affect_score,
          overall_credibility_rating: evaluation.overall_credibility_rating,
          recalled_news_topic: evaluation.recalled_news_topic,
          recalled_news_tone: evaluation.recalled_news_tone,
          passed_manipulation_check: evaluation.passed_manipulation_check,
          esg_preference_post: evaluation.esg_preference_post,
          risk_preference_post: evaluation.risk_preference_post,
          comments: evaluation.comments,
          created_at: evaluation.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all evaluations (admin)
   * GET /api/post-experiment
   */
  async getAllEvaluations(req, res, next) {
    try {
      const evaluations = await PostExperiment.findAll();
      res.json({
        evaluation_count: evaluations.length,
        evaluations: evaluations.map(e => ({
          id: e.id,
          user_id: e.user_id,
          user_email: e.email,
          experiment_group: e.experiment_group,
          g4_subgroup: e.g4_subgroup,
          esg_financial_link_rating: e.esg_financial_link_rating,
          positive_affect_score: e.positive_affect_score,
          negative_affect_score: e.negative_affect_score,
          overall_credibility_rating: e.overall_credibility_rating,
          passed_manipulation_check: e.passed_manipulation_check,
          created_at: e.created_at
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get manipulation check statistics
   * GET /api/post-experiment/stats/manipulation-check
   */
  async getManipulationCheckStats(req, res, next) {
    try {
      const stats = await PostExperiment.getManipulationCheckStats();
      res.json({ stats });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get average ratings by experiment group
   * GET /api/post-experiment/stats/average-ratings
   */
  async getAverageRatingsByGroup(req, res, next) {
    try {
      const averages = await PostExperiment.getAverageRatingsByGroup();
      res.json({ averages });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get preference changes (pre-post)
   * GET /api/post-experiment/stats/preference-changes
   */
  async getPreferenceChanges(req, res, next) {
    try {
      const changes = await PostExperiment.getPreferenceChanges();
      res.json({
        preference_changes: changes,
        count: changes.length
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update evaluation (admin)
   * PUT /api/post-experiment/user/:userId
   */
  async updateEvaluation(req, res, next) {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const evaluation = await PostExperiment.findByUser(userId);
      if (!evaluation) {
        return res.status(404).json({ error: 'Evaluation not found for this user' });
      }

      const updatedEvaluation = await PostExperiment.update(userId, updateData);
      res.json({
        message: 'Evaluation updated successfully',
        evaluation: updatedEvaluation
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete evaluation (admin)
   * DELETE /api/post-experiment/user/:userId
   */
  async deleteEvaluation(req, res, next) {
    try {
      const { userId } = req.params;

      const evaluation = await PostExperiment.findByUser(userId);
      if (!evaluation) {
        return res.status(404).json({ error: 'Evaluation not found for this user' });
      }

      const deleted = await PostExperiment.delete(userId);
      if (deleted) {
        res.json({ message: 'Evaluation deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete evaluation' });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = postExperimentController;