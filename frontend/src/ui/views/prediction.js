/**
 * Prediction and trading view
 */
export class PredictionView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
        this.currentArticle = null;
        this.predictionData = {
            future_stock_price_rating: null,
            future_profitability_rating: null,
            capital_allocation_percentage: 50 // Default 50%
        };
    }

    /**
     * Render prediction view
     */
    async render() {
        const user = this.app.getCurrentUser();
        const virtualCapital = 10000; // $10,000 virtual capital

        return `
            <div class="prediction-view">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Prediction & Trading Decision</h2>
                        <p class="card-subtitle">Based on the article you just read, make predictions and allocate your virtual capital.</p>
                    </div>

                    <div id="article-summary" style="margin-bottom: 32px;">
                        <div class="text-center" style="padding: 40px 0;">
                            <div class="loading-spinner"></div>
                            <p>Loading article information...</p>
                        </div>
                    </div>

                    <form id="prediction-form">
                        <div class="form-section">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Financial Predictions</h3>
                            <p style="margin-bottom: 24px; color: var(--text-secondary);">
                                Based on the news article, how do you expect the company to perform in the future?
                            </p>

                            <div class="prediction-question" style="margin-bottom: 40px;">
                                <h4 style="margin-bottom: 16px;">Future Stock Price</h4>
                                <p style="margin-bottom: 16px; color: var(--text-secondary);">
                                    How do you expect the company's stock price to perform over the next year?
                                </p>

                                <div class="rating-scale">
                                    <div class="rating-labels">
                                        <span>Strongly Decline</span>
                                        <span>Strongly Increase</span>
                                    </div>
                                    <div class="rating-options">
                                        ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                            <div class="rating-option">
                                                <input type="radio" id="stock-${num}" name="future_stock_price_rating"
                                                       value="${num}" ${this.predictionData.future_stock_price_rating == num ? 'checked' : ''}>
                                                <label class="rating-label" for="stock-${num}">${num}</label>
                                                <div class="rating-description">
                                                    ${num === 1 ? 'Significant loss expected' :
                                                      num === 4 ? 'Stable performance' :
                                                      num === 7 ? 'Major gains expected' : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <div class="prediction-question" style="margin-bottom: 40px;">
                                <h4 style="margin-bottom: 16px;">Future Profitability</h4>
                                <p style="margin-bottom: 16px; color: var(--text-secondary);">
                                    How do you expect the company's profitability to change over the next year?
                                </p>

                                <div class="rating-scale">
                                    <div class="rating-labels">
                                        <span>Strongly Decrease</span>
                                        <span>Strongly Increase</span>
                                    </div>
                                    <div class="rating-options">
                                        ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                            <div class="rating-option">
                                                <input type="radio" id="profit-${num}" name="future_profitability_rating"
                                                       value="${num}" ${this.predictionData.future_profitability_rating == num ? 'checked' : ''}>
                                                <label class="rating-label" for="profit-${num}">${num}</label>
                                                <div class="rating-description">
                                                    ${num === 1 ? 'Major decline in profits' :
                                                      num === 4 ? 'Steady profitability' :
                                                      num === 7 ? 'Substantial profit growth' : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Trading Decision</h3>
                            <p style="margin-bottom: 24px; color: var(--text-secondary);">
                                You have <strong>$${virtualCapital.toLocaleString()}</strong> in virtual capital. What percentage would you invest in this company's stock?
                            </p>

                            <div class="slider-container">
                                <div class="slider-value" id="allocation-value">${this.predictionData.capital_allocation_percentage}%</div>
                                <input type="range" min="0" max="100" value="${this.predictionData.capital_allocation_percentage}"
                                       class="slider" id="allocation-slider">
                                <div class="slider-labels">
                                    <span>0% (No investment)</span>
                                    <span>100% (All-in)</span>
                                </div>
                            </div>

                            <div style="margin-top: 32px; padding: 20px; background: var(--background); border-radius: var(--border-radius);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <span>Amount to invest:</span>
                                    <strong id="investment-amount">$${(virtualCapital * this.predictionData.capital_allocation_percentage / 100).toLocaleString()}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Remaining capital:</span>
                                    <strong id="remaining-amount">$${(virtualCapital * (100 - this.predictionData.capital_allocation_percentage) / 100).toLocaleString()}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-info" style="margin: 32px 0;">
                            <div class="alert-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">Performance Bonus</div>
                                <div class="alert-message">
                                    Your prediction accuracy and portfolio performance will determine your bonus payment at the end of the experiment.
                                </div>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="button" class="btn btn-secondary" id="skip-btn" style="display: none;">
                                <i class="fas fa-forward"></i> Skip This Article
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-paper-plane"></i> Submit Prediction & Continue
                            </button>
                        </div>
                    </form>

                    <div id="completion-message" style="display: none; text-align: center; padding: 40px 0;">
                        <i class="fas fa-check-circle" style="font-size: 64px; color: var(--success-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">Predictions Complete!</h3>
                        <p style="margin-bottom: 32px; color: var(--text-secondary); max-width: 600px; margin-left: auto; margin-right: auto;">
                            You have completed all prediction tasks. Please proceed to the post-experiment evaluation.
                        </p>
                        <button class="btn btn-primary" id="proceed-btn" data-route="posttest">
                            <i class="fas fa-clipboard-check"></i> Proceed to Evaluation
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize prediction view
     */
    async init() {
        await this.loadCurrentArticle();
        this.setupEventListeners();
    }

    /**
     * Load the current article for prediction
     */
    async loadCurrentArticle() {
        try {
            // Get articles that have been read but not predicted
            const articles = await this.app.getNewsArticles();
            const viewedArticles = this.app.state.getViewedArticles();
            const predictions = this.app.state.getAllPredictions();

            // Find first article that has been viewed but not predicted
            let targetArticle = null;
            let targetArticleIndex = -1;

            if (articles.success && articles.articles.length > 0) {
                for (let i = 0; i < articles.articles.length; i++) {
                    const article = articles.articles[i];
                    if (viewedArticles.includes(article.id) && !predictions[article.id]) {
                        targetArticle = article;
                        targetArticleIndex = i;
                        break;
                    }
                }
            }

            if (targetArticle) {
                this.currentArticle = targetArticle;
                this.showArticleSummary(targetArticle, targetArticleIndex + 1, articles.articles.length);

                // Check if prediction already exists in state
                const existingPrediction = this.app.state.getPrediction(targetArticle.id);
                if (existingPrediction) {
                    this.predictionData = existingPrediction;
                    this.updateFormFromData();
                }
            } else {
                // No more articles to predict
                this.showCompletionMessage();
            }

        } catch (error) {
            console.error('Failed to load article:', error);
            this.ui.showAlert('error', 'Loading Error',
                'Failed to load article information. Please try again.');
        }
    }

    /**
     * Show article summary
     */
    showArticleSummary(article, currentNumber, totalNumber) {
        const summaryContainer = document.getElementById('article-summary');
        if (!summaryContainer) return;

        const isFiller = article.is_filler ? '<span class="group-badge" style="background: #F5F5F5; color: #666; margin-left: 12px;">Filler Article</span>' : '';

        summaryContainer.innerHTML = `
            <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div>
                        <h3 style="margin-bottom: 8px;">${article.title} ${isFiller}</h3>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            Article ${currentNumber} of ${totalNumber} • Please make predictions based on this article
                        </p>
                    </div>
                </div>
                <div style="color: var(--text-secondary); line-height: 1.6;">
                    ${this.truncateContent(article.content, 300)}
                </div>
            </div>
        `;
    }

    /**
     * Truncate content for summary
     */
    truncateContent(content, maxLength) {
        if (!content) return 'No content available.';
        if (content.length <= maxLength) return content;

        return content.substring(0, maxLength) + '...';
    }

    /**
     * Update form with existing data
     */
    updateFormFromData() {
        // Update stock price rating
        if (this.predictionData.future_stock_price_rating) {
            const stockInput = document.getElementById(`stock-${this.predictionData.future_stock_price_rating}`);
            if (stockInput) stockInput.checked = true;
        }

        // Update profitability rating
        if (this.predictionData.future_profitability_rating) {
            const profitInput = document.getElementById(`profit-${this.predictionData.future_profitability_rating}`);
            if (profitInput) profitInput.checked = true;
        }

        // Update slider
        const slider = document.getElementById('allocation-slider');
        const valueDisplay = document.getElementById('allocation-value');
        if (slider && valueDisplay) {
            slider.value = this.predictionData.capital_allocation_percentage;
            valueDisplay.textContent = `${this.predictionData.capital_allocation_percentage}%`;
            this.updateInvestmentAmounts();
        }
    }

    /**
     * Update investment amount displays
     */
    updateInvestmentAmounts() {
        const slider = document.getElementById('allocation-slider');
        if (!slider) return;

        const percentage = parseInt(slider.value);
        const virtualCapital = 10000;

        const investmentAmount = document.getElementById('investment-amount');
        const remainingAmount = document.getElementById('remaining-amount');

        if (investmentAmount) {
            investmentAmount.textContent = `$${(virtualCapital * percentage / 100).toLocaleString()}`;
        }

        if (remainingAmount) {
            remainingAmount.textContent = `$${(virtualCapital * (100 - percentage) / 100).toLocaleString()}`;
        }
    }

    /**
     * Show completion message
     */
    showCompletionMessage() {
        const form = document.getElementById('prediction-form');
        const completionMessage = document.getElementById('completion-message');
        const articleSummary = document.getElementById('article-summary');

        if (form) form.style.display = 'none';
        if (articleSummary) articleSummary.style.display = 'none';
        if (completionMessage) completionMessage.style.display = 'block';
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Slider event
        const slider = document.getElementById('allocation-slider');
        const valueDisplay = document.getElementById('allocation-value');

        if (slider && valueDisplay) {
            slider.addEventListener('input', () => {
                const value = slider.value;
                valueDisplay.textContent = `${value}%`;
                this.updateInvestmentAmounts();
            });
        }

        // Form submission
        const form = document.getElementById('prediction-form');
        const submitBtn = document.getElementById('submit-btn');

        if (form && submitBtn) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                // Validate form
                const stockRating = form.querySelector('input[name="future_stock_price_rating"]:checked');
                const profitRating = form.querySelector('input[name="future_profitability_rating"]:checked');

                if (!stockRating || !profitRating) {
                    this.ui.showAlert('error', 'Validation Error',
                        'Please complete both prediction ratings before submitting.');
                    return;
                }

                // Disable submit button
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                try {
                    // Collect prediction data
                    const predictionData = {
                        user_id: this.app.currentUser.id,
                        article_id: this.currentArticle.id,
                        future_stock_price_rating: parseInt(stockRating.value),
                        future_profitability_rating: parseInt(profitRating.value),
                        capital_allocation_percentage: parseInt(slider.value)
                    };

                    // Save to state
                    this.app.state.savePrediction(this.currentArticle.id, predictionData);

                    // Submit to server
                    const result = await this.app.submitPrediction(predictionData);

                    if (result.success) {
                        this.ui.showAlert('success', 'Prediction Submitted',
                            'Your prediction has been recorded. Loading next article...');

                        // Load next article after delay
                        setTimeout(async () => {
                            await this.loadCurrentArticle();
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Prediction & Continue';
                        }, 1500);

                    } else {
                        this.ui.showAlert('error', 'Submission Failed', result.error);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Prediction & Continue';
                    }

                } catch (error) {
                    console.error('Prediction submission error:', error);
                    this.ui.showAlert('error', 'Submission Error',
                        'An unexpected error occurred. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Prediction & Continue';
                }
            });
        }

        // Skip button (for filler articles)
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn && this.currentArticle && this.currentArticle.is_filler) {
            skipBtn.style.display = 'inline-block';
            skipBtn.addEventListener('click', async () => {
                const confirmed = await this.ui.showConfirm(
                    'Skip Article',
                    'Are you sure you want to skip this filler article? You will not make predictions for it.',
                    'Skip Article',
                    'Cancel'
                );

                if (confirmed) {
                    // Mark as skipped and load next article
                    this.app.state.savePrediction(this.currentArticle.id, {
                        skipped: true,
                        timestamp: new Date().toISOString()
                    });

                    await this.loadCurrentArticle();
                }
            });
        }

        // Proceed button
        const proceedBtn = document.getElementById('proceed-btn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.app.router.navigate('posttest');
            });
        }
    }
}