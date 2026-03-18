/**
 * State management service for handling localStorage and application state
 */
export class StateManager {
    constructor() {
        this.storageKey = 'esg_experiment';
        this.currentState = null;
    }

    /**
     * Initialize state manager
     */
    async init() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                this.currentState = JSON.parse(savedState);
                console.log('State restored from localStorage');
            } else {
                this.currentState = this.getDefaultState();
                this.saveState();
            }
        } catch (error) {
            console.error('Failed to initialize state:', error);
            this.currentState = this.getDefaultState();
        }
    }

    /**
     * Get default application state
     */
    getDefaultState() {
        return {
            version: '1.0.0',
            session: null,
            preferences: {
                theme: 'light',
                language: 'en'
            },
            experimentData: {
                currentArticleIndex: 0,
                readingTimes: {},
                predictions: {},
                evaluations: {}
            }
        };
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.currentState));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    /**
     * Get current session
     */
    getSession() {
        return this.currentState.session;
    }

    /**
     * Save session data
     */
    saveSession(sessionData) {
        this.currentState.session = {
            ...sessionData,
            lastActivity: new Date().toISOString()
        };
        this.saveState();
    }

    /**
     * Clear session data
     */
    clearSession() {
        this.currentState.session = null;

        // Clear experiment data but keep preferences
        this.currentState.experimentData = {
            currentArticleIndex: 0,
            readingTimes: {},
            predictions: {},
            evaluations: {}
        };

        this.saveState();
    }

    /**
     * Get user preferences
     */
    getPreferences() {
        return this.currentState.preferences;
    }

    /**
     * Update user preferences
     */
    updatePreferences(preferences) {
        this.currentState.preferences = {
            ...this.currentState.preferences,
            ...preferences
        };
        this.saveState();
    }

    /**
     * Get experiment data
     */
    getExperimentData() {
        return this.currentState.experimentData;
    }

    /**
     * Update experiment data
     */
    updateExperimentData(data) {
        this.currentState.experimentData = {
            ...this.currentState.experimentData,
            ...data
        };
        this.saveState();
    }

    /**
     * Save reading time for an article
     */
    saveReadingTime(articleId, durationSeconds) {
        if (!this.currentState.experimentData.readingTimes) {
            this.currentState.experimentData.readingTimes = {};
        }
        this.currentState.experimentData.readingTimes[articleId] = durationSeconds;
        this.saveState();
    }

    /**
     * Get reading time for an article
     */
    getReadingTime(articleId) {
        return this.currentState.experimentData.readingTimes?.[articleId] || null;
    }

    /**
     * Save prediction for an article
     */
    savePrediction(articleId, prediction) {
        if (!this.currentState.experimentData.predictions) {
            this.currentState.experimentData.predictions = {};
        }
        this.currentState.experimentData.predictions[articleId] = prediction;
        this.saveState();
    }

    /**
     * Get prediction for an article
     */
    getPrediction(articleId) {
        return this.currentState.experimentData.predictions?.[articleId] || null;
    }

    /**
     * Save evaluation data
     */
    saveEvaluation(evaluationType, data) {
        if (!this.currentState.experimentData.evaluations) {
            this.currentState.experimentData.evaluations = {};
        }
        this.currentState.experimentData.evaluations[evaluationType] = data;
        this.saveState();
    }

    /**
     * Get evaluation data
     */
    getEvaluation(evaluationType) {
        return this.currentState.experimentData.evaluations?.[evaluationType] || null;
    }

    /**
     * Set current article index
     */
    setCurrentArticleIndex(index) {
        this.currentState.experimentData.currentArticleIndex = index;
        this.saveState();
    }

    /**
     * Get current article index
     */
    getCurrentArticleIndex() {
        return this.currentState.experimentData.currentArticleIndex || 0;
    }

    /**
     * Increment article index
     */
    incrementArticleIndex() {
        const currentIndex = this.getCurrentArticleIndex();
        this.setCurrentArticleIndex(currentIndex + 1);
        return currentIndex + 1;
    }

    /**
     * Check if article has been viewed
     */
    isArticleViewed(articleId) {
        return !!this.getReadingTime(articleId);
    }

    /**
     * Check if prediction has been made for article
     */
    hasPrediction(articleId) {
        return !!this.getPrediction(articleId);
    }

    /**
     * Get all viewed articles
     */
    getViewedArticles() {
        return Object.keys(this.currentState.experimentData.readingTimes || {});
    }

    /**
     * Get all predictions
     */
    getAllPredictions() {
        return this.currentState.experimentData.predictions || {};
    }

    /**
     * Get all evaluations
     */
    getAllEvaluations() {
        return this.currentState.experimentData.evaluations || {};
    }

    /**
     * Clear all experiment data
     */
    clearExperimentData() {
        this.currentState.experimentData = this.getDefaultState().experimentData;
        this.saveState();
    }

    /**
     * Export all data
     */
    exportData() {
        return {
            state: this.currentState,
            exportTime: new Date().toISOString()
        };
    }

    /**
     * Import data
     */
    importData(data) {
        if (data && data.state) {
            this.currentState = data.state;
            this.saveState();
            return true;
        }
        return false;
    }
}