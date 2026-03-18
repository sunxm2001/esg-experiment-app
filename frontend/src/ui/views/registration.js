/**
 * Registration view (pre-experiment data collection)
 */
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
                        <h2 class="card-title">Registration & Pre-Experiment Assessment</h2>
                        <p class="card-subtitle">Please provide your demographic information and complete the initial assessments.</p>
                    </div>

                    <form id="registration-form">
                        <div class="form-section">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Demographic Information</h3>

                            <div class="form-group">
                                <label class="form-label required" for="email">Email Address</label>
                                <input type="email" id="email" class="form-input" required
                                       placeholder="your.email@example.com"
                                       value="${this.formData.email}">
                                <div class="form-help">Used for payment and communication purposes only.</div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                                <div class="form-group">
                                    <label class="form-label required" for="age">Age</label>
                                    <input type="number" id="age" class="form-input" required
                                           min="18" max="100" value="${this.formData.age}">
                                </div>

                                <div class="form-group">
                                    <label class="form-label required" for="gender">Gender</label>
                                    <select id="gender" class="form-select" required>
                                        <option value="">Select gender</option>
                                        <option value="male" ${this.formData.gender === 'male' ? 'selected' : ''}>Male</option>
                                        <option value="female" ${this.formData.gender === 'female' ? 'selected' : ''}>Female</option>
                                        <option value="non-binary" ${this.formData.gender === 'non-binary' ? 'selected' : ''}>Non-binary</option>
                                        <option value="prefer-not-to-say" ${this.formData.gender === 'prefer-not-to-say' ? 'selected' : ''}>Prefer not to say</option>
                                        <option value="other" ${this.formData.gender === 'other' ? 'selected' : ''}>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label required" for="education">Highest Education Level</label>
                                <select id="education" class="form-select" required>
                                    <option value="">Select education level</option>
                                    <option value="high-school" ${this.formData.education === 'high-school' ? 'selected' : ''}>High School</option>
                                    <option value="associate" ${this.formData.education === 'associate' ? 'selected' : ''}>Associate Degree</option>
                                    <option value="bachelor" ${this.formData.education === 'bachelor' ? 'selected' : ''}>Bachelor's Degree</option>
                                    <option value="master" ${this.formData.education === 'master' ? 'selected' : ''}>Master's Degree</option>
                                    <option value="doctorate" ${this.formData.education === 'doctorate' ? 'selected' : ''}>Doctorate</option>
                                    <option value="other" ${this.formData.education === 'other' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label required" for="investment_years">Years of Investment Experience</label>
                                <input type="number" id="investment_years" class="form-input" required
                                       min="0" max="50" step="0.5"
                                       placeholder="e.g., 2.5 for two and a half years"
                                       value="${this.formData.investment_years}">
                                <div class="form-help">Enter 0 if you have no investment experience.</div>
                            </div>
                        </div>

                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Risk Preference Assessment</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                How would you describe your willingness to take financial risks?
                            </p>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>Very Risk Averse</span>
                                    <span>Very Risk Seeking</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="risk-${num}" name="risk_preference"
                                                   value="${num}" ${this.formData.risk_preference_score == num ? 'checked' : ''}>
                                            <label class="rating-label" for="risk-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? 'Extremely cautious' :
                                                  num === 4 ? 'Moderate' :
                                                  num === 7 ? 'Extremely bold' : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="form-section" style="margin-top: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--text-primary);">ESG Preference Assessment</h3>
                            <p style="margin-bottom: 20px; color: var(--text-secondary);">
                                How important are Environmental, Social, and Governance (ESG) factors in your investment decisions?
                            </p>

                            <div class="rating-scale">
                                <div class="rating-labels">
                                    <span>Not Important</span>
                                    <span>Very Important</span>
                                </div>
                                <div class="rating-options">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                        <div class="rating-option">
                                            <input type="radio" id="esg-${num}" name="esg_preference"
                                                   value="${num}" ${this.formData.esg_preference_pre == num ? 'checked' : ''}>
                                            <label class="rating-label" for="esg-${num}">${num}</label>
                                            <div class="rating-description">
                                                ${num === 1 ? 'Never consider ESG' :
                                                  num === 4 ? 'Sometimes consider' :
                                                  num === 7 ? 'Always prioritize ESG' : ''}
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
                                <div class="alert-title">Random Group Assignment</div>
                                <div class="alert-message">
                                    After registration, you will be randomly assigned to one of five experimental groups. This assignment determines the type of news articles you will read during the experiment.
                                </div>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="button" class="btn btn-secondary" id="cancel-btn" data-route="welcome">
                                <i class="fas fa-arrow-left"></i> Back to Welcome
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-check-circle"></i> Complete Registration & Start Experiment
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

                let message = 'This field is required';
                if (input.type === 'email' && input.value) {
                    message = 'Please enter a valid email address';
                } else if (input.type === 'number') {
                    if (input.value < input.min) {
                        message = `Value must be at least ${input.min}`;
                    } else if (input.value > input.max) {
                        message = `Value must be at most ${input.max}`;
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
                this.ui.showAlert('error', 'Validation Error', 'Please select a risk preference rating.');
                isValid = false;
            }

            if (!esgSelected) {
                this.ui.showAlert('error', 'Validation Error', 'Please select an ESG preference rating.');
                isValid = false;
            }

            if (!isValid) {
                this.ui.showAlert('error', 'Validation Error', 'Please fill in all required fields correctly.');
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

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
                    this.ui.showAlert('success', 'Registration Successful',
                        `You have been assigned to Group ${result.user.experiment_group}. Please proceed to the news reading task.`);

                    // Navigate to news view after a short delay
                    setTimeout(() => {
                        this.app.router.navigate('news');
                    }, 2000);
                } else {
                    // Handle error message (could be string or object)
                    let errorMessage = 'Registration failed. Please try again.';
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
                    this.ui.showAlert('error', 'Registration Failed', errorMessage);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Registration & Start Experiment';
                }

            } catch (error) {
                console.error('Registration error:', error);
                this.ui.showAlert('error', 'Registration Error',
                    'An unexpected error occurred. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Registration & Start Experiment';
            }
        });
    }
}