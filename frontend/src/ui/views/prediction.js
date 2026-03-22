/**
 * Prediction and trading view
 */
import { languageService } from '../../services/language.js';

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
                        <h2 class="card-title">${languageService.t('prediction.title')}</h2>
                        <p class="card-subtitle">${languageService.t('prediction.subtitle')}</p>
                    </div>

                    <div id="article-summary" style="margin-bottom: 32px;">
                        <div class="text-center" style="padding: 40px 0;">
                            <div class="loading-spinner"></div>
                            <p>${languageService.t('prediction.loading_article')}</p>
                        </div>
                    </div>

                    <form id="prediction-form">
                        <div class="form-section">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('prediction.financial_title')}</h3>
                            <p style="margin-bottom: 24px; color: var(--text-secondary);">
                                ${languageService.t('prediction.financial_question')}
                            </p>

                            <div class="prediction-question" style="margin-bottom: 40px;">
                                <h4 style="margin-bottom: 16px;">${languageService.t('prediction.stock_title')}</h4>
                                <p style="margin-bottom: 16px; color: var(--text-secondary);">
                                    ${languageService.t('prediction.stock_question')}
                                </p>

                                <div class="rating-scale">
                                    <div class="rating-labels">
                                        <span>${languageService.t('prediction.stock_decline')}</span>
                                        <span>${languageService.t('prediction.stock_increase')}</span>
                                    </div>
                                    <div class="rating-options">
                                        ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                            <div class="rating-option">
                                                <input type="radio" id="stock-${num}" name="future_stock_price_rating"
                                                       value="${num}" ${this.predictionData.future_stock_price_rating == num ? 'checked' : ''}>
                                                <label class="rating-label" for="stock-${num}">${num}</label>
                                                <div class="rating-description">
                                                    ${num === 1 ? languageService.t('prediction.stock_significant_loss') :
                                                      num === 4 ? languageService.t('prediction.stock_stable') :
                                                      num === 7 ? languageService.t('prediction.stock_major_gains') : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <div class="prediction-question" style="margin-bottom: 40px;">
                                <h4 style="margin-bottom: 16px;">${languageService.t('prediction.profit_title')}</h4>
                                <p style="margin-bottom: 16px; color: var(--text-secondary);">
                                    ${languageService.t('prediction.profit_question')}
                                </p>

                                <div class="rating-scale">
                                    <div class="rating-labels">
                                        <span>${languageService.t('prediction.profit_decrease')}</span>
                                        <span>${languageService.t('prediction.profit_increase')}</span>
                                    </div>
                                    <div class="rating-options">
                                        ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                            <div class="rating-option">
                                                <input type="radio" id="profit-${num}" name="future_profitability_rating"
                                                       value="${num}" ${this.predictionData.future_profitability_rating == num ? 'checked' : ''}>
                                                <label class="rating-label" for="profit-${num}">${num}</label>
                                                <div class="rating-description">
                                                    ${num === 1 ? languageService.t('prediction.profit_major_decline') :
                                                      num === 4 ? languageService.t('prediction.profit_steady') :
                                                      num === 7 ? languageService.t('prediction.profit_substantial_growth') : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('prediction.trading_title')}</h3>
                            <p style="margin-bottom: 24px; color: var(--text-secondary);">
                                ${languageService.t('prediction.trading_question', { capital: virtualCapital.toLocaleString() })}
                            </p>

                            <div class="slider-container">
                                <div class="slider-value" id="allocation-value">${this.predictionData.capital_allocation_percentage}%</div>
                                <input type="range" min="0" max="100" value="${this.predictionData.capital_allocation_percentage}"
                                       class="slider" id="allocation-slider">
                                <div class="slider-labels">
                                    <span>${languageService.t('prediction.slider_no_investment')}</span>
                                    <span>${languageService.t('prediction.slider_all_in')}</span>
                                </div>
                            </div>

                            <div style="margin-top: 32px; padding: 20px; background: var(--background); border-radius: var(--border-radius);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <span>${languageService.t('prediction.amount_to_invest')}</span>
                                    <strong id="investment-amount">$${(virtualCapital * this.predictionData.capital_allocation_percentage / 100).toLocaleString()}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>${languageService.t('prediction.remaining_capital')}</span>
                                    <strong id="remaining-amount">$${(virtualCapital * (100 - this.predictionData.capital_allocation_percentage) / 100).toLocaleString()}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-info" style="margin: 32px 0;">
                            <div class="alert-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">${languageService.t('prediction.performance_bonus_title')}</div>
                                <div class="alert-message">
                                    ${languageService.t('prediction.performance_bonus_message')}
                                </div>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="button" class="btn btn-secondary" id="skip-btn" style="display: none;">
                                <i class="fas fa-forward"></i> ${languageService.t('prediction.skip_article')}
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-paper-plane"></i> ${languageService.t('prediction.submit')}
                            </button>
                        </div>
                    </form>

                    <div id="completion-message" style="display: none; text-align: center; padding: 40px 0;">
                        <i class="fas fa-check-circle" style="font-size: 64px; color: var(--success-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">${languageService.t('prediction.complete_title')}</h3>
                        <p style="margin-bottom: 32px; color: var(--text-secondary); max-width: 600px; margin-left: auto; margin-right: auto;">
                            ${languageService.t('prediction.complete_message')}
                        </p>
                        <button class="btn btn-primary" id="proceed-btn" data-route="posttest">
                            <i class="fas fa-clipboard-check"></i> ${languageService.t('prediction.proceed_evaluation')}
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
            this.ui.showAlert('error', languageService.t('app.error'),
                languageService.t('prediction.submission_error_message'));
        }
    }

    /**
     * Show article summary
     */
    showArticleSummary(article, currentNumber, totalNumber) {
        const summaryContainer = document.getElementById('article-summary');
        if (!summaryContainer) return;

        const isFiller = article.is_filler ? `<span class="group-badge" style="background: #F5F5F5; color: #666; margin-left: 12px;">${languageService.t('news.filler_article')}</span>` : '';

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
        if (!content) return languageService.t('news.no_content');
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
                    this.ui.showAlert('error', languageService.t('prediction.validation_error'),
                        languageService.t('prediction.validation_message'));
                    return;
                }

                // Disable submit button
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${languageService.t('prediction.processing')}`;

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
                        this.ui.showAlert('success', languageService.t('prediction.submission_success'),
                            languageService.t('prediction.submission_success_message'));

                        // Load next article after delay
                        setTimeout(async () => {
                            await this.loadCurrentArticle();
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${languageService.t('prediction.submit')}`;
                        }, 1500);

                    } else {
                        this.ui.showAlert('error', languageService.t('prediction.submission_failed'), result.error);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${languageService.t('prediction.submit')}`;
                    }

                } catch (error) {
                    console.error('Prediction submission error:', error);
                    this.ui.showAlert('error', languageService.t('prediction.submission_error'),
                        languageService.t('prediction.submission_error_message'));
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${languageService.t('prediction.submit')}`;
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

    /**
     * Refresh view when language changes
     */
    async refresh() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = await this.render();
            await this.init();
        }
    }
}