/**
 * Registration view (pre-experiment data collection)
 */
import { languageService } from '../../services/language.js';

export class RegistrationView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
        this.formData = {
            email: '',
            age: '',
            gender: '',
            education: '',
            investment_years: '',
            risk_preference_score: 5, // Default middle value
            esg_preference_pre: 5     // Default middle value
        };
    }

    /**
     * Render registration view
     */
    async render() {
        return `
            <div class="registration-view">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">${languageService.t('registration.title')}</h2>
                        <p class="card-subtitle">${languageService.t('registration.subtitle')}</p>
                    </div>

                    <form id="registration-form">
                        <div class="form-section">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('registration.demographic_info')}</h3>

                            <div class="form-group">
                                <label class="form-label required" for="email">${languageService.t('registration.email')}</label>
                                <input type="email" id="email" class="form-input" required
                                       placeholder="your.email@example.com"
                                       value="${this.formData.email}">
                                <div class="form-help">${languageService.t('registration.email_help')}</div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                                <div class="form-group">
                                    <label class="form-label required" for="age">${languageService.t('registration.age')}</label>
                                    <input type="number" id="age" class="form-input" required
                                           min="18" max="100" value="${this.formData.age}">
                                </div>

                                <div class="form-group">
                                    <label class="form-label required" for="gender">${languageService.t('registration.gender')}</label>
                                    <select id="gender" class="form-select" required>
                                        <option value="">${languageService.t('registration.gender_select')}</option>
                                        <option value="male" ${this.formData.gender === 'male' ? 'selected' : ''}>${languageService.t('registration.gender_male')}</option>
                                        <option value="female" ${this.formData.gender === 'female' ? 'selected' : ''}>${languageService.t('registration.gender_female')}</option>
                                        <option value="non-binary" ${this.formData.gender === 'non-binary' ? 'selected' : ''}>${languageService.t('registration.gender_nonbinary')}</option>
                                        <option value="prefer-not-to-say" ${this.formData.gender === 'prefer-not-to-say' ? 'selected' : ''}>${languageService.t('registration.gender_prefernottosay')}</option>
                                        <option value="other" ${this.formData.gender === 'other' ? 'selected' : ''}>${languageService.t('registration.gender_other')}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label required" for="education">${languageService.t('registration.education')}</label>
                                <select id="education" class="form-select" required>
                                    <option value="">${languageService.t('registration.education_select')}</option>
                                    <option value="high-school" ${this.formData.education === 'high-school' ? 'selected' : ''}>${languageService.t('registration.education_highschool')}</option>
                                    <option value="associate" ${this.formData.education === 'associate' ? 'selected' : ''}>${languageService.t('registration.education_associate')}</option>
                                    <option value="bachelor" ${this.formData.education === 'bachelor' ? 'selected' : ''}>${languageService.t('registration.education_bachelor')}</option>
                                    <option value="master" ${this.formData.education === 'master' ? 'selected' : ''}>${languageService.t('registration.education_master')}</option>
                                    <option value="doctorate" ${this.formData.education === 'doctorate' ? 'selected' : ''}>${languageService.t('registration.education_doctorate')}</option>
                                    <option value="other" ${this.formData.education === 'other' ? 'selected' : ''}>${languageService.t('registration.education_other')}</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label required" for="investment_years">${languageService.t('registration.investment_years')}</label>
                                <input type="number" id="investment_years" class="form-input" required
                                       min="0" max="50" step="0.5"
                                       placeholder="e.g., 2.5 for two and a half years"
                                       value="${this.formData.investment_years}">
                                <div class="form-help">${languageService.t('registration.investment_help')}</div>
                            </div>
                        </div>

                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('registration.risk_assessment')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('registration.risk_question')}
                            </p>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>${languageService.t('registration.risk_averse')}</span>
                                    <span>${languageService.t('registration.risk_seeking')}</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="risk-${num}" name="risk_preference"
                                                   value="${num}" ${this.formData.risk_preference_score == num ? 'checked' : ''}>
                                            <label class="rating-label" for="risk-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? languageService.t('registration.risk_cautious') :
                                                  num === 4 ? languageService.t('registration.risk_moderate') :
                                                  num === 7 ? languageService.t('registration.risk_bold') : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('registration.esg_assessment')}</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                ${languageService.t('registration.esg_question')}
                            </p>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>${languageService.t('registration.esg_notimportant')}</span>
                                    <span>${languageService.t('registration.esg_veryimportant')}</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="esg-${num}" name="esg_preference"
                                                   value="${num}" ${this.formData.esg_preference_pre == num ? 'checked' : ''}>
                                            <label class="rating-label" for="esg-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? languageService.t('registration.esg_never') :
                                                  num === 4 ? languageService.t('registration.esg_sometimes') :
                                                  num === 7 ? languageService.t('registration.esg_always') : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-info" style="margin: 32px 0;">
                            <div class="alert-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">${languageService.t('registration.group_assignment')}</div>
                                <div class="alert-message">
                                    ${languageService.t('registration.group_message')}
                                </div>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="button" class="btn btn-secondary" id="cancel-btn" data-route="welcome">
                                <i class="fas fa-arrow-left"></i> ${languageService.t('registration.back_welcome')}
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-check-circle"></i> ${languageService.t('registration.complete')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Initialize registration view
     */
    async init() {
        this.setupFormValidation();
        this.setupFormSubmit();
    }

    /**
     * Set up form validation
     */
    setupFormValidation() {
        const form = document.getElementById('registration-form');
        const inputs = form.querySelectorAll('input[required], select[required]');

        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.validateInput(input);
            });

            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    /**
     * Validate a single input
     */
    validateInput(input) {
        const errorElement = input.parentElement.querySelector('.form-error');

        if (input.checkValidity()) {
            if (errorElement) {
                errorElement.remove();
            }
            input.style.borderColor = '';
            return true;
        } else {
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'form-error';

                let message = languageService.t('registration.validation_required');
                if (input.type === 'email' && input.value) {
                    message = languageService.t('registration.validation_email');
                } else if (input.type === 'number') {
                    if (input.value < input.min) {
                        message = languageService.t('registration.validation_min', { min: input.min });
                    } else if (input.value > input.max) {
                        message = languageService.t('registration.validation_max', { max: input.max });
                    }
                }

                error.textContent = message;
                input.parentElement.appendChild(error);
            }
            input.style.borderColor = 'var(--error-color)';
            return false;
        }
    }

    /**
     * Set up form submission
     */
    setupFormSubmit() {
        const form = document.getElementById('registration-form');
        const submitBtn = document.getElementById('submit-btn');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Validate all inputs
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateInput(input)) {
                    isValid = false;
                }
            });

            // Validate radio buttons
            const riskSelected = form.querySelector('input[name="risk_preference"]:checked');
            const esgSelected = form.querySelector('input[name="esg_preference"]:checked');

            if (!riskSelected) {
                this.ui.showAlert('error', languageService.t('app.error'), languageService.t('registration.validation_risk'));
                isValid = false;
            }

            if (!esgSelected) {
                this.ui.showAlert('error', languageService.t('app.error'), languageService.t('registration.validation_esg'));
                isValid = false;
            }

            if (!isValid) {
                this.ui.showAlert('error', languageService.t('app.error'), languageService.t('registration.validation_all'));
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${languageService.t('registration.processing')}`;

            try {
                // Collect form data
                const formData = {
                    email: document.getElementById('email').value,
                    age: parseInt(document.getElementById('age').value),
                    gender: document.getElementById('gender').value,
                    education: document.getElementById('education').value,
                    investment_years: parseFloat(document.getElementById('investment_years').value),
                    risk_preference_score: parseFloat(riskSelected.value),
                    esg_preference_pre: parseFloat(esgSelected.value)
                };

                // Submit registration
                const result = await this.app.registerUser(formData);

                if (result.success) {
                    this.ui.showAlert('success', languageService.t('registration.success'),
                        languageService.t('registration.success_message', { group: result.user.experiment_group }));

                    // Navigate to news view after a short delay
                    setTimeout(() => {
                        this.app.router.navigate('news');
                    }, 2000);
                } else {
                    // Handle error message (could be string or object)
                    let errorMessage = languageService.t('registration.error_message');
                    if (result.error) {
                        if (typeof result.error === 'string') {
                            errorMessage = result.error;
                        } else if (result.error.message) {
                            errorMessage = result.error.message;
                        } else {
                            errorMessage = JSON.stringify(result.error);
                        }
                    }
                    console.error('Registration failed:', result.error);
                    this.ui.showAlert('error', languageService.t('registration.error'), errorMessage);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Registration & Start Experiment';
                }

            } catch (error) {
                console.error('Registration error:', error);
                this.ui.showAlert('error', languageService.t('app.error'),
                    languageService.t('registration.error_unexpected'));
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${languageService.t('registration.complete')}`;
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