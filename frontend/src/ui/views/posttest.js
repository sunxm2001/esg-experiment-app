/**
 * Post-experiment evaluation view
 */
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
                        <h2 class="card-title">Post-Experiment Evaluation</h2>
                        <p class="card-subtitle">Please complete the following questionnaires and evaluations.</p>
                    </div>

                    <form id="evaluation-form">
                        <!-- Cognitive Spillover (EFCI proxy) -->
                        <div class="form-section">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Cognitive Spillover Assessment</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                To what extent do you agree with the following statement?
                            </p>
                            <blockquote style="margin-bottom: 24px; padding: 16px; background: var(--background); border-left: 4px solid var(--primary-color);">
                                "Good ESG performance will lead to good financial performance."
                            </blockquote>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>Strongly Disagree</span>
                                    <span>Strongly Agree</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="esg-link-${num}" name="esg_financial_link_rating"
                                                   value="${num}" ${this.evaluationData.esg_financial_link_rating == num ? 'checked' : ''}>
                                            <label class="rating-label" for="esg-link-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? 'Completely disagree' :
                                                  num === 4 ? 'Neutral' :
                                                  num === 7 ? 'Completely agree' : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Emotional State (Simplified PANAS) -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Emotional State Assessment</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                How do you feel right now? Please rate your current emotional state.
                            </p>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div>
                                    <h4 style="margin-bottom: 16px;">Positive Emotions</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        How strongly are you experiencing positive emotions (e.g., interested, excited, enthusiastic)?
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>Not at all</span>
                                            <span>Extremely</span>
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
                                    <h4 style="margin-bottom: 16px;">Negative Emotions</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        How strongly are you experiencing negative emotions (e.g., distressed, upset, nervous)?
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>Not at all</span>
                                            <span>Extremely</span>
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
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Overall News Credibility</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                Overall, how credible did you find the news articles you read during this experiment?
                            </p>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>Not at all credible</span>
                                    <span>Extremely credible</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="credibility-${num}" name="overall_credibility_rating"
                                                   value="${num}" ${this.evaluationData.overall_credibility_rating == num ? 'checked' : ''}>
                                            <label class="rating-label" for="credibility-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? 'Completely unreliable' :
                                                  num === 4 ? 'Moderately credible' :
                                                  num === 7 ? 'Highly trustworthy' : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Manipulation Check -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">News Recall Check</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                Please recall the main news articles you read during the experiment.
                            </p>

                            <div class="form-group">
                                <label class="form-label" for="recalled_topic">What was the main topic of the news articles?</label>
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
                                <label class="form-label" for="recalled_tone">What was the overall tone of the news articles?</label>
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
                                <label class="form-label">Based on your recall, did you read articles that matched your expectations?</label>
                                <div style="display: flex; gap: 20px; margin-top: 8px;">
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="radio" name="manipulation_check" value="true"
                                               ${this.evaluationData.passed_manipulation_check === true ? 'checked' : ''}>
                                        Yes, the articles matched what I expected
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="radio" name="manipulation_check" value="false"
                                               ${this.evaluationData.passed_manipulation_check === false ? 'checked' : ''}>
                                        No, the articles were different than expected
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Preference Retest -->
                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Final Preference Assessment</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                Please rate your current preferences after completing the experiment.
                            </p>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div>
                                    <h4 style="margin-bottom: 16px;">Risk Preference</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        How would you describe your willingness to take financial risks now?
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>Very Risk Averse</span>
                                            <span>Very Risk Seeking</span>
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
                                    <h4 style="margin-bottom: 16px;">ESG Preference</h4>
                                    <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                                        How important are ESG factors in your investment decisions now?
                                    </p>
                                    <div class="rating-scale">
                                        <div class="rating-labels">
                                            <span>Not Important</span>
                                            <span>Very Important</span>
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
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Attention Check Questions</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                Please answer these questions carefully to show you are paying attention.
                            </p>

                            <!-- Attention Check 1: Select specific answer -->
                            <div class="form-group">
                                <label class="form-label" style="margin-bottom: 8px;">
                                    Please select <strong>"Strongly Agree"</strong> to show you are paying attention:
                                </label>
                                <div style="display: flex; gap: 20px; margin-top: 8px;">
                                    ${['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Agree', 'Strongly Agree'].map((label, index) => {
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
                                    Please select <strong>"Not at all"</strong> for this question:
                                </label>
                                <div style="display: flex; gap: 20px; margin-top: 8px;">
                                    ${['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'].map((label, index) => {
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
                            <h3 style="margin-bottom: 16px; color: var(--text-primary);">Additional Comments</h3>
                            <div class="form-group">
                                <label class="form-label" for="comments">Any additional comments or feedback about the experiment?</label>
                                <textarea id="comments" class="form-textarea" rows="4"
                                          placeholder="Optional: Share your thoughts about the experiment, suggestions for improvement, or any difficulties you encountered.">${this.evaluationData.comments || ''}</textarea>
                            </div>
                        </div>

                        <div class="alert alert-info" style="margin: 32px 0;">
                            <div class="alert-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">Data Integrity</div>
                                <div class="alert-message">
                                    Your honest responses are crucial for the validity of this research. Please answer all questions thoughtfully.
                                </div>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-check-circle"></i> Complete Evaluation & Finish Experiment
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
                    this.ui.showAlert('error', 'Submission Failed', result.error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Evaluation & Finish Experiment';
                }

            } catch (error) {
                console.error('Evaluation submission error:', error);
                this.ui.showAlert('error', 'Submission Error',
                    'An unexpected error occurred. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Evaluation & Finish Experiment';
            }
        });
    }
}