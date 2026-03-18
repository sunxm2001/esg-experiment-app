/**
 * Completed view (final thank you)
 */
export class CompletedView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
    }

    /**
     * Render completed view
     */
    async render() {
        return `
            <div class="completed-view">
                <div class="card">
                    <div class="card-header text-center">
                        <h2 class="card-title">Thank You for Your Participation!</h2>
                        <p class="card-subtitle">Your contribution to our research is greatly appreciated.</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <i class="fas fa-heart" style="font-size: 64px; color: var(--primary-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">Experiment Successfully Completed</h3>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 32px;">
                            You have successfully completed the ESG Narrative Spillover experiment. Your responses will help advance our understanding of how media narratives influence investor behavior.
                        </p>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 20px; color: var(--text-primary); text-align: center;">What Happens Next?</h3>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">
                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px;">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <h4 style="margin-bottom: 8px;">Payment Confirmation</h4>
                                <p style="color: var(--text-secondary); font-size: 14px;">
                                    You will receive an email within 3-5 business days confirming your payment details.
                                </p>
                            </div>

                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: var(--secondary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px;">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <h4 style="margin-bottom: 8px;">Research Analysis</h4>
                                <p style="color: var(--text-secondary); font-size: 14px;">
                                    Your anonymized data will be analyzed as part of our academic research study.
                                </p>
                            </div>

                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: var(--accent-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px;">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <h4 style="margin-bottom: 8px;">Publication</h4>
                                <p style="color: var(--text-secondary); font-size: 14px;">
                                    Results will be published in academic journals. All data remains completely anonymous.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-success">
                        <div class="alert-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">Data Privacy Assured</div>
                            <div class="alert-message">
                                Your personal information is protected and will never be shared. All research data is anonymized and used solely for academic purposes.
                            </div>
                        </div>
                    </div>

                    <div style="margin: 40px 0; padding: 24px; background: var(--background); border-radius: var(--border-radius);">
                        <h4 style="margin-bottom: 16px; text-align: center;">Want to Learn More?</h4>
                        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 20px;">
                            If you're interested in the findings of this study or would like to participate in future research:
                        </p>
                        <div style="text-align: center;">
                            <a href="mailto:researcher@university.edu" style="color: var(--primary-color); text-decoration: none; font-weight: 500;">
                                <i class="fas fa-envelope"></i> researcher@university.edu
                            </a>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary" id="new-session-btn">
                            <i class="fas fa-redo"></i> Start New Session (Different Participant)
                        </button>
                        <button class="btn btn-primary" id="close-btn">
                            <i class="fas fa-times"></i> Close Experiment
                        </button>
                    </div>

                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-secondary); font-size: 12px;">
                        <p>
                            Behavioral Finance Research Group • Department of Finance • University<br>
                            Study ID: ESG-EXP-2024 • IRB Approval: #2024-12345
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize completed view
     */
    async init() {
        this.setupEventListeners();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // New session button
        const newSessionBtn = document.getElementById('new-session-btn');
        if (newSessionBtn) {
            newSessionBtn.addEventListener('click', () => {
                // Clear current session
                this.app.state.clearSession();
                this.app.currentUser = null;
                this.app.currentStage = 'welcome';

                // Navigate to welcome
                this.app.router.navigate('welcome');
            });
        }

        // Close button
        const closeBtn = document.getElementById('close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Show confirmation
                const confirmed = confirm('Are you sure you want to close the experiment?');
                if (confirmed) {
                    // In a real app, this might close the window or tab
                    // For now, just go back to welcome
                    this.app.state.clearSession();
                    this.app.currentUser = null;
                    this.app.currentStage = 'welcome';
                    this.app.router.navigate('welcome');
                }
            });
        }
    }
}