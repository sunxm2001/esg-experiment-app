import { ApiService } from './services/api.js';
import { StateManager } from './services/state.js';
import { Router } from './services/router.js';
import { UI } from './ui/ui.js';

/**
 * Main application class
 */
export class App {
    constructor() {
        this.api = new ApiService();
        this.state = new StateManager();
        this.router = new Router();
        this.ui = new UI(this);

        // Application state
        this.currentUser = null;
        this.currentStage = 'welcome';
        this.isLoading = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('ESG Experiment App initializing...');

        // Initialize services
        await this.state.init();

        // Check for existing session
        const session = this.state.getSession();
        if (session && session.userId) {
            try {
                // Load user data
                const user = await this.api.getUser(session.userId);
                if (user) {
                    this.currentUser = user;
                    this.currentStage = this.determineCurrentStage(user);
                }
            } catch (error) {
                console.warn('Failed to restore session:', error);
                this.state.clearSession();
            }
        }

        // Initialize UI
        this.ui.init();

        // Initialize router
        this.router.init(this);

        console.log('ESG Experiment App initialized');
    }

    /**
     * Determine the current stage based on user completion status
     */
    determineCurrentStage(user) {
        if (!user.completed_pretest) return 'registration';
        if (!user.completed_news) return 'news';
        if (!user.completed_prediction) return 'prediction';
        if (!user.completed_posttest) return 'posttest';
        if (!user.completed_all) return 'completion';
        return 'completed';
    }

    /**
     * Register a new user
     */
    async registerUser(userData) {
        try {
            this.setLoading(true);

            // Submit registration
            const user = await this.api.registerUser(userData);

            // Save session
            this.state.saveSession({
                userId: user.id,
                email: user.email
            });

            // Update app state
            this.currentUser = user;
            this.currentStage = 'news';

            // Navigate to next stage
            this.router.navigate('news');

            return { success: true, user };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.message || 'Registration failed. Please try again.'
            };
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Submit reading session data
     */
    async submitReadingSession(sessionData) {
        try {
            this.setLoading(true);

            const result = await this.api.submitReadingSession(sessionData);

            // Update user completion status if needed
            if (!this.currentUser.completed_news) {
                await this.api.updateCompletion(this.currentUser.id, 'news');
                this.currentUser.completed_news = true;
                this.currentStage = 'prediction';
            }

            return { success: true, data: result };
        } catch (error) {
            console.error('Failed to submit reading session:', error);
            return {
                success: false,
                error: error.message || 'Failed to submit reading session.'
            };
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Submit prediction and trading decision
     */
    async submitPrediction(predictionData) {
        try {
            this.setLoading(true);

            const result = await this.api.submitPrediction(predictionData);

            // Update user completion status if needed
            if (!this.currentUser.completed_prediction) {
                await this.api.updateCompletion(this.currentUser.id, 'prediction');
                this.currentUser.completed_prediction = true;
                this.currentStage = 'posttest';
            }

            return { success: true, data: result };
        } catch (error) {
            console.error('Failed to submit prediction:', error);
            return {
                success: false,
                error: error.message || 'Failed to submit prediction.'
            };
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Submit post-experiment evaluation
     */
    async submitPostEvaluation(evaluationData) {
        try {
            this.setLoading(true);

            const result = await this.api.submitPostEvaluation(evaluationData);

            // Update user completion status
            await this.api.updateCompletion(this.currentUser.id, 'posttest');
            await this.api.updateCompletion(this.currentUser.id, 'all');

            this.currentUser.completed_posttest = true;
            this.currentUser.completed_all = true;
            this.currentStage = 'completion';

            return { success: true, data: result };
        } catch (error) {
            console.error('Failed to submit evaluation:', error);
            return {
                success: false,
                error: error.message || 'Failed to submit evaluation.'
            };
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Get news articles for the current user
     */
    async getNewsArticles() {
        try {
            console.log('App: Getting news articles for user:', this.currentUser);
            if (!this.currentUser) {
                console.error('App: No current user');
                throw new Error('User not logged in');
            }

            console.log('App: Calling API with:', {
                userId: this.currentUser.id,
                group: this.currentUser.experiment_group,
                subgroup: this.currentUser.g4_subgroup
            });
            const articles = await this.api.getUserArticles(
                this.currentUser.id,
                this.currentUser.experiment_group,
                this.currentUser.g4_subgroup
            );
            console.log('App: Received articles:', articles ? articles.length : 0, 'articles');

            return { success: true, articles };
        } catch (error) {
            console.error('Failed to get news articles:', error);
            return {
                success: false,
                error: error.message || 'Failed to load news articles.'
            };
        }
    }

    /**
     * Logout the current user
     */
    logout() {
        this.state.clearSession();
        this.currentUser = null;
        this.currentStage = 'welcome';
        this.router.navigate('welcome');
    }

    /**
     * Set loading state
     */
    setLoading(isLoading) {
        this.isLoading = isLoading;
        this.ui.setLoading(isLoading);
    }

    /**
     * Get current stage
     */
    getCurrentStage() {
        return this.currentStage;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }

    /**
     * Get experiment progress percentage
     */
    getProgressPercentage() {
        if (!this.currentUser) return 0;

        let completed = 0;
        if (this.currentUser.completed_pretest) completed++;
        if (this.currentUser.completed_news) completed++;
        if (this.currentUser.completed_prediction) completed++;
        if (this.currentUser.completed_posttest) completed++;

        return (completed / 4) * 100;
    }
}