/**
 * Completed view (final thank you)
 */
import { languageService } from '../../services/language.js';

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
                        <h2 class="card-title">${languageService.t('completed.title')}</h2>
                        <p class="card-subtitle">${languageService.t('completed.subtitle')}</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <i class="fas fa-heart" style="font-size: 64px; color: var(--primary-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">${languageService.t('completed.experiment_successful')}</h3>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 32px;">
                            ${languageService.t('completed.experiment_successful_message')}
                        </p>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 20px; color: var(--text-primary); text-align: center;">${languageService.t('completed.what_happens_next')}</h3>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">
                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px;">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <h4 style="margin-bottom: 8px;">${languageService.t('completed.payment_confirmation')}</h4>
                                <p style="color: var(--text-secondary); font-size: 14px;">
                                    ${languageService.t('completed.payment_confirmation_desc')}
                                </p>
                            </div>

                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: var(--secondary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px;">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <h4 style="margin-bottom: 8px;">${languageService.t('completed.research_analysis')}</h4>
                                <p style="color: var(--text-secondary); font-size: 14px;">
                                    ${languageService.t('completed.research_analysis_desc')}
                                </p>
                            </div>

                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: var(--accent-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px;">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <h4 style="margin-bottom: 8px;">${languageService.t('completed.publication')}</h4>
                                <p style="color: var(--text-secondary); font-size: 14px;">
                                    ${languageService.t('completed.publication_desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-success">
                        <div class="alert-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${languageService.t('completed.data_privacy_title')}</div>
                            <div class="alert-message">
                                ${languageService.t('completed.data_privacy_message')}
                            </div>
                        </div>
                    </div>

                    <div style="margin: 40px 0; padding: 24px; background: var(--background); border-radius: var(--border-radius);">
                        <h4 style="margin-bottom: 16px; text-align: center;">${languageService.t('completed.want_to_learn_more')}</h4>
                        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 20px;">
                            ${languageService.t('completed.learn_more_message')}
                        </p>
                        <div style="text-align: center;">
                            <a href="mailto:researcher@university.edu" style="color: var(--primary-color); text-decoration: none; font-weight: 500;">
                                <i class="fas fa-envelope"></i> researcher@university.edu
                            </a>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary" id="new-session-btn">
                            <i class="fas fa-redo"></i> ${languageService.t('completed.start_new_session')}
                        </button>
                        <button class="btn btn-primary" id="close-btn">
                            <i class="fas fa-times"></i> ${languageService.t('completed.close_experiment')}
                        </button>
                    </div>

                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-secondary); font-size: 12px;">
                        <p>
                            ${languageService.t('completed.footer')}
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
                const confirmed = confirm(languageService.t('completed.close_confirm'));
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