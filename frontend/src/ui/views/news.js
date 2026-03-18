/**
 * News reading view
 */
export class NewsView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
        this.articles = [];
        this.currentArticleIndex = 0;
        this.currentArticle = null;
        this.timer = null;
        this.startTime = null;
        this.timeLimit = 60; // Default 60 seconds
        this.isCompleted = false;
    }

    /**
     * Render news view
     */
    async render() {
        const user = this.app.getCurrentUser();
        const groupBadge = user ? `<span class="group-badge group-${user.experiment_group.toLowerCase()}">Group ${user.experiment_group}</span>` : '';

        return `
            <div class="news-view">
                <div class="timer-container" id="timer-container">
                    <div class="timer" id="timer">60</div>
                    <div class="timer-label">Seconds Remaining</div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h2 class="card-title">News Reading Task</h2>
                                <p class="card-subtitle">Read the following article carefully. You have a limited time to read and answer questions.</p>
                            </div>
                            ${groupBadge}
                        </div>
                    </div>

                    <div id="article-container" style="min-height: 400px;">
                        <div class="text-center" style="padding: 60px 0;">
                            <div class="loading-spinner"></div>
                            <p style="margin-top: 20px;">Loading news articles...</p>
                        </div>
                    </div>

                    <div id="credibility-rating" style="display: none; margin-top: 32px;">
                        <h3 style="margin-bottom: 16px;">Article Credibility Rating</h3>
                        <p style="margin-bottom: 20px; color: var(--text-secondary);">
                            How credible do you find this article?
                        </p>

                        <div class="rating-scale">
                            <div class="rating-labels">
                                <span>Not at all credible</span>
                                <span>Extremely credible</span>
                            </div>
                            <div class="rating-options">
                                ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                    <div class="rating-option">
                                        <input type="radio" id="cred-${num}" name="credibility_rating" value="${num}">
                                        <label class="rating-label" for="cred-${num}">${num}</label>
                                        <div class="rating-description">
                                            ${num === 1 ? 'Completely unreliable' :
                                              num === 4 ? 'Moderately credible' :
                                              num === 7 ? 'Highly trustworthy' : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="btn-group">
                            <button class="btn btn-primary btn-full" id="next-article-btn" disabled>
                                <i class="fas fa-arrow-right"></i> Next Article
                            </button>
                        </div>
                    </div>

                    <div id="completion-message" style="display: none; text-align: center; padding: 40px 0;">
                        <i class="fas fa-check-circle" style="font-size: 64px; color: var(--success-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">News Reading Task Complete!</h3>
                        <p style="margin-bottom: 32px; color: var(--text-secondary); max-width: 600px; margin-left: auto; margin-right: auto;">
                            You have completed all news articles. Please proceed to the prediction and trading task.
                        </p>
                        <button class="btn btn-primary" id="proceed-btn" data-route="prediction">
                            <i class="fas fa-chart-bar"></i> Proceed to Prediction Task
                        </button>
                    </div>

                    <div class="alert alert-info" style="margin-top: 32px;">
                        <div class="alert-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">Attention Tracking</div>
                            <div class="alert-message">
                                Your reading time is being tracked as a measure of attention. Please read each article carefully within the time limit.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize news view
     */
    async init() {
        await this.loadArticles();
        this.setupEventListeners();
    }

    /**
     * Load articles for the current user
     */
    async loadArticles() {
        try {
            console.log('NewsView: Loading articles...');
            console.log('NewsView: Current user:', this.app.currentUser);

            if (!this.app.currentUser) {
                console.error('NewsView: No current user found!');
                this.ui.showAlert('error', 'Session Error', 'User session not found. Please restart the experiment.');
                return;
            }

            const result = await this.app.getNewsArticles();
            console.log('NewsView: Result received:', result);

            if (result.success && result.articles && result.articles.length > 0) {
                console.log(`NewsView: Loaded ${result.articles.length} articles`);
                console.log('NewsView: First article sample:', {
                    id: result.articles[0].id,
                    title: result.articles[0].title,
                    hasContent: !!result.articles[0].content,
                    contentLength: result.articles[0].content?.length
                });
                this.articles = result.articles;

                // Get current article index from state
                this.currentArticleIndex = this.app.state.getCurrentArticleIndex();

                // Check if we've already completed this article
                if (this.currentArticleIndex >= this.articles.length) {
                    this.showCompletionMessage();
                } else {
                    await this.loadCurrentArticle();
                }
            } else {
                console.error('NewsView: Failed to load articles:', result);
                let errorMessage = 'Failed to load news articles. Please try again.';

                if (result.error) {
                    errorMessage = result.error;
                    if (typeof errorMessage !== 'string') {
                        errorMessage = JSON.stringify(errorMessage);
                    }
                } else if (!result.articles || result.articles.length === 0) {
                    errorMessage = 'No articles available for your experiment group.';
                }

                this.ui.showAlert('error', 'Loading Error', errorMessage);
            }
        } catch (error) {
            console.error('Failed to load articles:', error);
            console.error('Error details:', error.message, error.stack);
            this.ui.showAlert('error', 'Loading Error',
                'An unexpected error occurred while loading articles.');
        }
    }

    /**
     * Load the current article
     */
    async loadCurrentArticle() {
        if (this.currentArticleIndex >= this.articles.length) {
            this.showCompletionMessage();
            return;
        }

        this.currentArticle = this.articles[this.currentArticleIndex];
        this.timeLimit = this.currentArticle.time_limit_seconds || 60;
        this.isCompleted = false;

        // Check if article has already been viewed
        const existingReadingTime = this.app.state.getReadingTime(this.currentArticle.id);
        if (existingReadingTime) {
            // Article already viewed, show credibility rating
            this.showArticleContent();
            this.showCredibilityRating();
        } else {
            // New article, start timer
            this.showArticleContent();
            this.startTimer();
        }
    }

    /**
     * Show article content
     */
    showArticleContent() {
        console.log('NewsView: Showing article content');
        console.log('NewsView: Current article:', this.currentArticle);

        const container = document.getElementById('article-container');
        if (!container) {
            console.error('NewsView: Article container not found!');
            return;
        }

        if (!this.currentArticle) {
            console.error('NewsView: No current article to display!');
            container.innerHTML = `
                <div class="alert alert-error">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">Article Error</div>
                        <div class="alert-message">
                            Failed to load article content. Please refresh the page or contact the researcher.
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        const isFiller = this.currentArticle.is_filler ? '<span class="group-badge" style="background: #F5F5F5; color: #666; margin-left: 12px;">Filler Article</span>' : '';

        const progressPercent = ((this.currentArticleIndex + 1) / this.articles.length) * 100;

        container.innerHTML = `
            <div class="news-article">
                <!-- Progress and incentive banner -->
                <div class="progress-banner" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">
                                <i class="fas fa-trophy"></i> Reading Progress
                            </h3>
                            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">
                                Complete all articles to earn your base payment.
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 24px; font-weight: bold;">
                                ${this.currentArticleIndex + 1}/${this.articles.length}
                            </div>
                            <div style="font-size: 14px; opacity: 0.9;">Articles</div>
                        </div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.2); height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="width: ${progressPercent}%; height: 100%; background: white; transition: width 0.3s ease;"></div>
                    </div>
                </div>

                <div class="article-header">
                    <h1 class="article-title">${this.currentArticle.title} ${isFiller}</h1>
                    <div class="article-meta">
                        <span><i class="far fa-clock"></i> Time limit: ${this.timeLimit} seconds</span>
                        <span><i class="far fa-newspaper"></i> Article ${this.currentArticleIndex + 1} of ${this.articles.length}</span>
                    </div>
                </div>
                <div class="article-content">
                    ${this.formatArticleContent(this.currentArticle.content)}
                </div>
            </div>
        `;

        // Show/hide timer based on whether article is new
        const timerContainer = document.getElementById('timer-container');
        const existingReadingTime = this.app.state.getReadingTime(this.currentArticle.id);

        if (timerContainer) {
            if (existingReadingTime) {
                timerContainer.style.display = 'none';
            } else {
                timerContainer.style.display = 'block';
                this.updateTimerDisplay(this.timeLimit);
            }
        }
    }

    /**
     * Format article content with paragraphs
     */
    formatArticleContent(content) {
        console.log('NewsView: Formatting article content, length:', content?.length);

        if (!content) {
            console.warn('NewsView: Article content is empty or undefined');
            return '<p class="content-warning">No content available for this article.</p>';
        }

        try {
            // Split by double newlines and wrap in paragraphs
            const paragraphs = content.split('\n\n').filter(p => p && p.trim());

            if (paragraphs.length === 0) {
                // If no double newlines, try single newlines
                const lines = content.split('\n').filter(line => line && line.trim());
                if (lines.length > 0) {
                    return lines.map(line => `<p>${line.trim()}</p>`).join('');
                }
                return `<p>${content.trim()}</p>`;
            }

            return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
        } catch (error) {
            console.error('NewsView: Error formatting article content:', error);
            return `<p>${String(content).substring(0, 500)}...</p>`;
        }
    }

    /**
     * Start the timer for the current article
     */
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.startTime = Date.now();
        let timeLeft = this.timeLimit;

        this.timer = setInterval(() => {
            timeLeft--;

            if (timeLeft <= 0) {
                this.onTimerExpired();
            } else {
                this.updateTimerDisplay(timeLeft);
            }
        }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimerDisplay(timeLeft) {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = timeLeft;

            // Add warning styles
            timerElement.className = 'timer';
            if (timeLeft <= 10) {
                timerElement.classList.add('timer-critical');
            } else if (timeLeft <= 30) {
                timerElement.classList.add('timer-warning');
            }
        }
    }

    /**
     * Handle timer expiration
     */
    onTimerExpired() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Record reading session
        const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        this.completeReadingSession(durationSeconds, false);

        // Show credibility rating
        this.showCredibilityRating();

        this.ui.showAlert('warning', 'Time Expired',
            'Time limit reached. Please rate the article credibility and proceed.');
    }

    /**
     * Show credibility rating form
     */
    showCredibilityRating() {
        const ratingContainer = document.getElementById('credibility-rating');
        const nextBtn = document.getElementById('next-article-btn');

        if (ratingContainer) {
            ratingContainer.style.display = 'block';

            // Enable next button when rating is selected
            const ratingInputs = ratingContainer.querySelectorAll('input[name="credibility_rating"]');
            ratingInputs.forEach(input => {
                input.addEventListener('change', () => {
                    nextBtn.disabled = false;
                });
            });
        }
    }

    /**
     * Complete reading session and save data
     */
    async completeReadingSession(durationSeconds, completedWithinLimit = true) {
        if (!this.currentArticle || this.isCompleted) {
            return;
        }

        this.isCompleted = true;

        // Save reading time to state
        this.app.state.saveReadingTime(this.currentArticle.id, durationSeconds);

        // Get credibility rating
        const ratingInput = document.querySelector('input[name="credibility_rating"]:checked');
        const credibilityRating = ratingInput ? parseInt(ratingInput.value) : null;

        // Submit to server
        try {
            await this.app.submitReadingSession({
                userId: this.app.currentUser.id,
                articleId: this.currentArticle.id,
                durationSeconds,
                completedWithinLimit,
                credibilityRating
            });

            console.log('Reading session saved successfully');
        } catch (error) {
            console.error('Failed to save reading session:', error);
            // Continue anyway - data is saved in local state
        }
    }

    /**
     * Move to next article
     */
    async nextArticle() {
        // Get credibility rating before proceeding
        const ratingInput = document.querySelector('input[name="credibility_rating"]:checked');
        if (!ratingInput) {
            this.ui.showAlert('error', 'Rating Required',
                'Please rate the article credibility before proceeding.');
            return;
        }

        // Complete current session if not already done
        if (!this.isCompleted) {
            const durationSeconds = this.startTime ?
                Math.floor((Date.now() - this.startTime) / 1000) :
                this.timeLimit;

            await this.completeReadingSession(durationSeconds, true);
        }

        // Increment article index
        this.currentArticleIndex++;
        this.app.state.setCurrentArticleIndex(this.currentArticleIndex);

        // Load next article or show completion
        if (this.currentArticleIndex >= this.articles.length) {
            this.showCompletionMessage();
        } else {
            await this.loadCurrentArticle();
            this.hideCredibilityRating();
        }
    }

    /**
     * Hide credibility rating form
     */
    hideCredibilityRating() {
        const ratingContainer = document.getElementById('credibility-rating');
        if (ratingContainer) {
            ratingContainer.style.display = 'none';

            // Reset form
            const ratingInputs = ratingContainer.querySelectorAll('input[name="credibility_rating"]');
            ratingInputs.forEach(input => {
                input.checked = false;
            });

            const nextBtn = document.getElementById('next-article-btn');
            if (nextBtn) {
                nextBtn.disabled = true;
            }
        }
    }

    /**
     * Show completion message
     */
    showCompletionMessage() {
        const articleContainer = document.getElementById('article-container');
        const ratingContainer = document.getElementById('credibility-rating');
        const completionMessage = document.getElementById('completion-message');
        const timerContainer = document.getElementById('timer-container');

        if (articleContainer) articleContainer.style.display = 'none';
        if (ratingContainer) ratingContainer.style.display = 'none';
        if (timerContainer) timerContainer.style.display = 'none';
        if (completionMessage) completionMessage.style.display = 'block';
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Next article button
        const nextBtn = document.getElementById('next-article-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextArticle();
            });
        }

        // Proceed button (on completion)
        const proceedBtn = document.getElementById('proceed-btn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.app.router.navigate('prediction');
            });
        }

        // Manual completion button (for testing)
        const manualCompleteBtn = document.getElementById('manual-complete-btn');
        if (manualCompleteBtn) {
            manualCompleteBtn.addEventListener('click', () => {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }

                const durationSeconds = this.startTime ?
                    Math.floor((Date.now() - this.startTime) / 1000) :
                    30;

                this.completeReadingSession(durationSeconds, true);
                this.showCredibilityRating();
            });
        }
    }
}