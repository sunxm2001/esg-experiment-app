/**
 * Post-experiment evaluation view
 */
import { languageService } from '../../services/language.js';

export class PosttestView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
        this.evaluationData = {
            esg_financial_link_rating: null,
            positive_affect_score: null,
            negative_affect_score: null,
            overall_credibility_rating: null,
            recalled_news_topic: '',
            recalled_news_tone: '',
            passed_manipulation_check: null,
            esg_preference_post: null,
            risk_preference_post: null,
            comments: ''
        };
    }

    /**
     * Render posttest view
     */
    async render() {
        const user = this.app.getCurrentUser();

        return `
            <div class="posttest-view">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">${languageService.t('posttest.title')}</h2>
                        <p class="card-subtitle">${languageService.t('posttest.subtitle')}</p>
                    </div>

                    <form id="evaluation-form">
                        <!-- Cognitive Spillover (EFCI proxy) -->
                        <div class="form-section">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('posttest.cognitive_title')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('posttest.cognitive_question')}
                            </p>
                            <blockquote style="margin-bottom: 24px; padding: 16px; background: var(--background); border-left: 4px solid var(--primary-color);">
                                ${languageService.t('posttest.cognitive_statement')}
                            </blockquote>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>${languageService.t('posttest.cognitive_disagree')}</span>
                                    <span>${languageService.t('posttest.cognitive_agree')}</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="esg-link-${num}" name="esg_financial_link_rating"
                                                   value="${num}" ${this.evaluationData.esg_financial_link_rating == num ? 'checked' : ''}>
                                            <label class="rating-label" for="esg-link-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? languageService.t('posttest.cognitive_completely_disagree') :
                                                  num === 4 ? languageService.t('posttest.cognitive_neutral') :
                                                  num === 7 ? languageService.t('posttest.cognitive_completely_agree') : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Emotional State (Simplified PANAS) -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('posttest.emotional_title')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('posttest.emotional_question')}
                            </p>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div>
                                    <h4 style="margin-bottom: 16px;">${languageService.t('posttest.positive_title')}</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        ${languageService.t('posttest.positive_question')}
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>${languageService.t('posttest.emotional_not_at_all')}</span>
                                            <span>${languageService.t('posttest.emotional_extremely')}</span>
                                        </div>
                                        <div class="rating-options">
                                            ${[1, 2, 3, 4, 5].map(num => `
                                                <div class="rating-option">
                                                    <input type="radio" id="positive-${num}" name="positive_affect_score"
                                                           value="${num}" ${this.evaluationData.positive_affect_score == num ? 'checked' : ''}>
                                                    <label class="rating-label" for="positive-${num}">${num}</label>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 style="margin-bottom: 16px;">${languageService.t('posttest.negative_title')}</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        ${languageService.t('posttest.negative_question')}
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>${languageService.t('posttest.emotional_not_at_all')}</span>
                                            <span>${languageService.t('posttest.emotional_extremely')}</span>
                                        </div>
                                        <div class="rating-options">
                                            ${[1, 2, 3, 4, 5].map(num => `
                                                <div class="rating-option">
                                                    <input type="radio" id="negative-${num}" name="negative_affect_score"
                                                           value="${num}" ${this.evaluationData.negative_affect_score == num ? 'checked' : ''}>
                                                    <label class="rating-label" for="negative-${num}">${num}</label>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- News Credibility -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('posttest.credibility_title')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('posttest.credibility_question')}
                            </p>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>${languageService.t('posttest.credibility_not_credible')}</span>
                                    <span>${languageService.t('posttest.credibility_extremely_credible')}</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="credibility-${num}" name="overall_credibility_rating"
                                                   value="${num}" ${this.evaluationData.overall_credibility_rating == num ? 'checked' : ''}>
                                            <label class="rating-label" for="credibility-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? languageService.t('posttest.credibility_completely_unreliable') :
                                                  num === 4 ? languageService.t('posttest.credibility_moderately_credible') :
                                                  num === 7 ? languageService.t('posttest.credibility_highly_trustworthy') : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Manipulation Check -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('posttest.recall_title')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('posttest.recall_question')}
                            </p>

                            <div class="form-group">
                                <label class="form-label" for="recalled_topic">${languageService.t('posttest.recall_topic_label')}</label>
                                <select id="recalled_topic" class="form-select">
                                    <option value="">Select topic</option>
                                    <option value="esg" ${this.evaluationData.recalled_news_topic === 'esg' ? 'selected' : ''}>ESG (Environmental, Social, Governance)</option>
                                    <option value="financial" ${this.evaluationData.recalled_news_topic === 'financial' ? 'selected' : ''}>Financial Performance</option>
                                    <option value="esg_financial" ${this.evaluationData.recalled_news_topic === 'esg_financial' ? 'selected' : ''}>Both ESG and Financial</option>
                                    <option value="neutral" ${this.evaluationData.recalled_news_topic === 'neutral' ? 'selected' : ''}>Neutral/Business News</option>
                                    <option value="corporate_culture" ${this.evaluationData.recalled_news_topic === 'corporate_culture' ? 'selected' : ''}>Corporate Culture/Other</option>
                                    <option value="not_sure" ${this.evaluationData.recalled_news_topic === 'not_sure' ? 'selected' : ''}>Not Sure/Don't Remember</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="recalled_tone">${languageService.t('posttest.recall_tone_label')}</label>
                                <select id="recalled_tone" class="form-select">
                                    <option value="">Select tone</option>
                                    <option value="positive" ${this.evaluationData.recalled_news_tone === 'positive' ? 'selected' : ''}>Positive/Optimistic</option>
                                    <option value="neutral" ${this.evaluationData.recalled_news_tone === 'neutral' ? 'selected' : ''}>Neutral/Balanced</option>
                                    <option value="negative" ${this.evaluationData.recalled_news_tone === 'negative' ? 'selected' : ''}>Negative/Pessimistic</option>
                                    <option value="mixed" ${this.evaluationData.recalled_news_tone === 'mixed' ? 'selected' : ''}>Mixed/Varied</option>
                                    <option value="not_sure" ${this.evaluationData.recalled_news_tone === 'not_sure' ? 'selected' : ''}>Not Sure/Don't Remember</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">${languageService.t('posttest.recall_manipulation_label')}</label>
                                <div style="display: flex; gap: 20px; margin-top: 8px;">
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="radio" name="manipulation_check" value="true"
                                               ${this.evaluationData.passed_manipulation_check === true ? 'checked' : ''}>
                                        ${languageService.t('posttest.recall_yes')}
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="radio" name="manipulation_check" value="false"
                                               ${this.evaluationData.passed_manipulation_check === false ? 'checked' : ''}>
                                        ${languageService.t('posttest.recall_no')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Preference Retest -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('posttest.preference_title')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('posttest.preference_question')}
                            </p>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div>
                                    <h4 style="margin-bottom: 16px;">${languageService.t('posttest.risk_post_title')}</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        ${languageService.t('posttest.risk_post_question')}
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>${languageService.t('posttest.risk_averse')}</span>
                                            <span>${languageService.t('posttest.risk_seeking')}</span>
                                        </div>
                                        <div class="rating-options">
                                            ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                                <div class="rating-option">
                                                    <input type="radio" id="risk-post-${num}" name="risk_preference_post"
                                                           value="${num}" ${this.evaluationData.risk_preference_post == num ? 'checked' : ''}>
                                                    <label class="rating-label" for="risk-post-${num}">${num}</label>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 style="margin-bottom: 16px;">${languageService.t('posttest.esg_post_title')}</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        ${languageService.t('posttest.esg_post_question')}
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>${languageService.t('posttest.esg_not_important')}</span>
                                            <span>${languageService.t('posttest.esg_very_important')}</span>
                                        </div>
                                        <div class="rating-options">
                                            ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                                <div class="rating-option">
                                                    <input type="radio" id="esg-post-${num}" name="esg_preference_post"
                                                           value="${num}" ${this.evaluationData.esg_preference_post == num ? 'checked' : ''}>
                                                    <label class="rating-label" for="esg-post-${num}">${num}</label>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Attention Check Questions -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('posttest.attention_title')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('posttest.attention_question')}
                            </p>

                            <!-- Attention Check 1: Select specific answer -->
                            <div class="form-group">
                                <label class="form-label" style="margin-bottom: 8px;">
                                    ${languageService.t('posttest.attention_check_1_label')}
                                </label>
                                <div style="display: flex; gap: 20px; margin-top: 8px;">
                                    ${languageService.t('posttest.attention_options').map((label, index) => {
                                        const value = index + 1;
                                        return `
                                            <label style="display: flex; align-items: center; gap: 8px;">
                                                <input type="radio" name="attention_check_1" value="${value}">
                                                ${label}
                                            </label>
                                        `;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- Attention Check 2: Select specific answer -->
                            <div class="form-group" style="margin-top: 24px;">
                                <label class="form-label" style="margin-bottom: 8px;">
                                    ${languageService.t('posttest.attention_check_2_label')}
                                </label>
                                <div style="display: flex; gap: 20px; margin-top: 8px;">
                                    ${languageService.t('posttest.attention_options_2').map((label, index) => {
                                        const value = index + 1;
                                        return `
                                            <label style="display: flex; align-items: center; gap: 8px;">
                                                <input type="radio" name="attention_check_2" value="${value}">
                                                ${label}
                                            </label>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Comments -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 16px; color: var(--text-primary);">${languageService.t('posttest.comments_title')}</h3>
                            <div class="form-group">
                                <label class="form-label" for="comments">${languageService.t('posttest.comments_label')}</label>
                                <textarea id="comments" class="form-textarea" rows="4"
                                          placeholder="${languageService.t('posttest.comments_placeholder')}">${this.evaluationData.comments || ''}</textarea>
                            </div>
                        </div>

                        <div class="alert alert-info" style="margin: 32px 0;">
                            <div class="alert-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">${languageService.t('posttest.data_integrity_title')}</div>
                                <div class="alert-message">
                                    ${languageService.t('posttest.data_integrity_message')}
                                </div>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-check-circle"></i> ${languageService.t('posttest.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Initialize posttest view
     */
    async init() {
        this.setupFormValidation();
        this.setupFormSubmit();
    }

    /**
     * Set up form validation
     */
    setupFormValidation() {
        // Validation will be handled on submit
    }

    /**
     * Set up form submission
     */
    setupFormSubmit() {
        const form = document.getElementById('evaluation-form');
        const submitBtn = document.getElementById('submit-btn');

        if (!form || !submitBtn) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Validate required fields
            const requiredFields = [
                'esg_financial_link_rating',
                'positive_affect_score',
                'negative_affect_score',
                'overall_credibility_rating',
                'risk_preference_post',
                'esg_preference_post',
                'attention_check_1',
                'attention_check_2'
            ];

            let isValid = true;
            const missingFields = [];

            requiredFields.forEach(fieldName => {
                const field = form.querySelector(`[name="${fieldName}"]:checked`);
                if (!field) {
                    isValid = false;
                    missingFields.push(fieldName);
                }
            });

            if (!isValid) {
                const fieldNames = {
                    'esg_financial_link_rating': 'ESG-Financial Link rating',
                    'positive_affect_score': 'Positive emotions rating',
                    'negative_affect_score': 'Negative emotions rating',
                    'overall_credibility_rating': 'Overall credibility rating',
                    'risk_preference_post': 'Post-experiment risk preference',
                    'esg_preference_post': 'Post-experiment ESG preference',
                    'attention_check_1': 'Attention check question 1',
                    'attention_check_2': 'Attention check question 2'
                };

                const missingList = missingFields.map(f => fieldNames[f] || f).join(', ');
                this.ui.showAlert('error', 'Validation Error',
                    `Please complete the following required fields: ${missingList}`);
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            try {
                // Collect form data
                const evaluationData = {
                    user_id: this.app.currentUser.id,
                    esg_financial_link_rating: parseInt(form.querySelector('[name="esg_financial_link_rating"]:checked').value),
                    positive_affect_score: parseInt(form.querySelector('[name="positive_affect_score"]:checked').value),
                    negative_affect_score: parseInt(form.querySelector('[name="negative_affect_score"]:checked').value),
                    overall_credibility_rating: parseInt(form.querySelector('[name="overall_credibility_rating"]:checked').value),
                    recalled_news_topic: document.getElementById('recalled_topic').value || null,
                    recalled_news_tone: document.getElementById('recalled_tone').value || null,
                    risk_preference_post: parseInt(form.querySelector('[name="risk_preference_post"]:checked').value),
                    esg_preference_post: parseInt(form.querySelector('[name="esg_preference_post"]:checked').value),
                    attention_check_1: parseInt(form.querySelector('[name="attention_check_1"]:checked').value),
                    attention_check_2: parseInt(form.querySelector('[name="attention_check_2"]:checked').value),
                    comments: document.getElementById('comments').value || null
                };

                // Get manipulation check value
                const manipulationCheck = form.querySelector('[name="manipulation_check"]:checked');
                if (manipulationCheck) {
                    evaluationData.passed_manipulation_check = manipulationCheck.value === 'true';
                }

                // Save to state
                this.app.state.saveEvaluation('posttest', evaluationData);

                // Submit to server
                const result = await this.app.submitPostEvaluation(evaluationData);

                if (result.success) {
                    this.ui.showAlert('success', 'Evaluation Complete',
                        'Thank you for completing the experiment! Processing your results...');

                    // Navigate to completion view after delay
                    setTimeout(() => {
                        this.app.router.navigate('completion');
                    }, 2000);

                } else {
                    this.ui.showAlert('error', languageService.t('posttest.submission_failed'), result.error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${languageService.t('posttest.submit')}`;
                }

            } catch (error) {
                console.error('Evaluation submission error:', error);
                this.ui.showAlert('error', languageService.t('posttest.submission_error'),
                    languageService.t('posttest.submission_error_message'));
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${languageService.t('posttest.submit')}`;
            }
        });
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