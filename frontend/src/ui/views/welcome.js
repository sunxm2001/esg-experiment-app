/**
 * Welcome view
 */
export class WelcomeView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
    }

    /**
     * Render welcome view
     */
    async render() {
        return `
            <div class="welcome-view">
                <div class="card">
                    <div class="card-header text-center">
                        <h1 class="card-title">ESG Experiment</h1>
                        <p class="card-subtitle">Narrative Spillover, Retail Investor Misunderstanding & Trading Behavior</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <i class="fas fa-chart-line" style="font-size: 64px; color: var(--primary-color); margin-bottom: 20px;"></i>
                        <h2 style="margin-bottom: 16px;">Welcome to the Experiment</h2>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
                            This research study examines how Environmental, Social, and Governance (ESG) news narratives influence retail investors' beliefs and trading decisions.
                        </p>
                    </div>

                    <div class="alert alert-info">
                        <div class="alert-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">Important Information</div>
                            <div class="alert-message">
                                Please read the following information carefully before proceeding. This experiment will take approximately 30-45 minutes to complete.
                            </div>
                        </div>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px;">What to Expect:</h3>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-check" style="position: absolute; left: 0; color: var(--success-color);"></i>
                                <strong>Registration & Pre-test:</strong> Demographic information and preference assessments
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-newspaper" style="position: absolute; left: 0; color: var(--primary-color);"></i>
                                <strong>News Reading Task:</strong> Read financial news articles with time limits
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-chart-bar" style="position: absolute; left: 0; color: var(--secondary-color);"></i>
                                <strong>Prediction & Trading:</strong> Make financial predictions and allocate virtual capital
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-clipboard-check" style="position: absolute; left: 0; color: var(--accent-color);"></i>
                                <strong>Post-experiment Evaluation:</strong> Complete questionnaires and feedback
                            </li>
                        </ul>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px;">Incentive Structure:</h3>
                        <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px;">
                            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                <div style="width: 32px; height: 32px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div>
                                    <strong>Base Pay:</strong> Receive a fixed amount for completing all tasks
                                </div>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div style="width: 32px; height: 32px; background: var(--accent-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div>
                                    <strong>Performance Bonus:</strong> Additional payment based on prediction accuracy and portfolio performance
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-warning">
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">Research Participation</div>
                            <div class="alert-message">
                                Your participation is voluntary. You may withdraw at any time without penalty. All data collected will be anonymized and used solely for academic research purposes.
                            </div>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary btn-full" id="continue-experiment">
                            <i class="fas fa-play-circle"></i> Continue Previous Session
                        </button>
                        <button class="btn btn-primary btn-full" id="start-new-experiment">
                            <i class="fas fa-plus-circle"></i> Start New Experiment
                        </button>
                    </div>

                    <div style="margin-top: 32px; text-align: center; color: var(--text-secondary); font-size: 14px;">
                        <p>
                            This study is conducted by the Behavioral Finance Research Group.<br>
                            For questions or concerns, please contact: researcher@university.edu
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize welcome view
     */
    async init() {
        // Check if user has existing session
        const user = this.app.getCurrentUser();
        const continueBtn = document.getElementById('continue-experiment');
        const startBtn = document.getElementById('start-new-experiment');

        if (user) {
            continueBtn.style.display = 'block';
            continueBtn.addEventListener('click', () => {
                this.ui.app.router.navigateToNextStage();
            });
        } else {
            continueBtn.style.display = 'none';
        }

        startBtn.addEventListener('click', () => {
            // Clear any existing session
            this.app.state.clearSession();
            this.app.currentUser = null;
            this.app.currentStage = 'registration';
            this.ui.app.router.navigate('registration');
        });
    }
}