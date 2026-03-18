/**
 * API Service for communicating with the backend
 */
export class ApiService {
    constructor() {
        // Determine base URL based on current host
        // When served from Express (same origin), use relative URL
        // When running separately (development), use full URL
        const isLocalDevelopment = window.location.port === '3000' && window.location.hostname === 'localhost';
        this.baseURL = isLocalDevelopment ? 'http://localhost:5001/api' : '/api';

        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Log configuration in development
        if (process.env.NODE_ENV === 'development' || isLocalDevelopment) {
            console.log('API Service configured:', {
                baseURL: this.baseURL,
                currentHost: window.location.host,
                isLocalDevelopment
            });
        }
    }

    /**
     * Make an API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = { ...this.defaultHeaders, ...options.headers };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                let errorMessage;
                if (typeof data === 'object') {
                    if (data.error) {
                        errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
                    } else if (data.message) {
                        errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
                    } else {
                        errorMessage = JSON.stringify(data);
                    }
                } else {
                    errorMessage = `HTTP ${response.status}: ${data}`;
                }
                throw new Error(errorMessage || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    /**
     * Register a new user with pre-experiment data
     */
    async registerUser(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }).then(data => data.user);
    }

    /**
     * Get user by ID
     */
    async getUser(userId) {
        return this.request(`/users/${userId}`).then(data => data.user);
    }

    /**
     * Update user completion status
     */
    async updateCompletion(userId, stage) {
        return this.request(`/users/${userId}/complete`, {
            method: 'POST',
            body: JSON.stringify({ stage })
        });
    }

    /**
     * Update post-experiment preferences
     */
    async updatePostPreferences(userId, preferences) {
        return this.request(`/users/${userId}/post-preferences`, {
            method: 'POST',
            body: JSON.stringify(preferences)
        });
    }

    /**
     * Get news articles for a user
     */
    async getUserArticles(userId, experimentGroup, g4Subgroup = null) {
        let url = `/news/user/${userId}`;
        const params = new URLSearchParams({ experimentGroup });

        if (g4Subgroup) {
            params.append('g4Subgroup', g4Subgroup);
        }

        url += `?${params.toString()}`;
        return this.request(url).then(data => data.articles);
    }

    /**
     * Get a specific article
     */
    async getArticle(articleId, userId = null) {
        let url = `/news/article/${articleId}`;
        if (userId) {
            url += `?userId=${userId}`;
        }
        return this.request(url).then(data => data.article);
    }

    /**
     * Submit reading session data
     */
    async submitReadingSession(sessionData) {
        return this.request('/news/reading-session', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });
    }

    /**
     * Submit prediction and trading decision
     */
    async submitPrediction(predictionData) {
        return this.request('/predictions', {
            method: 'POST',
            body: JSON.stringify(predictionData)
        });
    }

    /**
     * Get user predictions
     */
    async getUserPredictions(userId) {
        return this.request(`/predictions/user/${userId}`);
    }

    /**
     * Submit post-experiment evaluation
     */
    async submitPostEvaluation(evaluationData) {
        return this.request('/post-experiment', {
            method: 'POST',
            body: JSON.stringify(evaluationData)
        });
    }

    /**
     * Get user evaluation
     */
    async getUserEvaluation(userId) {
        return this.request(`/post-experiment/user/${userId}`);
    }

    /**
     * Calculate bonus for user
     */
    async calculateBonus(userId, scores, config = {}) {
        return this.request(`/incentives/calculate/${userId}`, {
            method: 'POST',
            body: JSON.stringify({
                prediction_accuracy_score: scores.predictionAccuracy,
                portfolio_performance_score: scores.portfolioPerformance,
                bonus_config: config
            })
        });
    }

    /**
     * Award bonus to user
     */
    async awardBonus(userId, basePay = 0) {
        return this.request(`/incentives/award/${userId}`, {
            method: 'POST',
            body: JSON.stringify({ base_pay_awarded: basePay })
        });
    }

    /**
     * Get user performance tracking
     */
    async getUserPerformance(userId) {
        return this.request(`/incentives/user/${userId}`);
    }

    /**
     * Export data as CSV
     */
    async exportCSV() {
        return this.request('/export/csv');
    }

    /**
     * Export data for Stata
     */
    async exportStata() {
        return this.request('/export/stata');
    }

    /**
     * Get export statistics
     */
    async getExportStats() {
        return this.request('/export/stats');
    }

    /**
     * Health check
     */
    async healthCheck() {
        return this.request('/health');
    }

    /**
     * Detailed health check
     */
    async detailedHealthCheck() {
        return this.request('/health/detailed');
    }
}