import { languageService } from '../../services/language.js';

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
                        <h1 class="card-title">${languageService.t('app.name')}</h1>
                        <p class="card-subtitle">${languageService.t('welcome.subtitle')}</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <!-- Language Selector for Welcome Page -->
                        <div class="welcome-language-selector" style="margin-bottom: 30px;">
                            <div style="font-size: 16px; color: var(--text-secondary); margin-bottom: 10px;">
                                ${languageService.t('language.select')}:
                            </div>
                            <div style="display: inline-block;">
                                ${languageService.getLanguageSelectorHTML('welcome-')}
                            </div>
                        </div>

                        <i class="fas fa-chart-line" style="font-size: 64px; color: var(--primary-color); margin-bottom: 20px;"></i>
                        <h2 style="margin-bottom: 16px;">${languageService.t('welcome.title')}</h2>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
                            ${languageService.t('welcome.description')}
                        </p>
                    </div>

                    <div class="alert alert-info">
                        <div class="alert-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${languageService.t('welcome.important_info')}</div>
                            <div class="alert-message">
                                ${languageService.t('welcome.important_message')}
                            </div>
                        </div>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px;">${languageService.t('welcome.expectations')}</h3>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-check" style="position: absolute; left: 0; color: var(--success-color);"></i>
                                <strong>${languageService.t('welcome.registration')}</strong> ${languageService.t('welcome.registration_desc')}
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-newspaper" style="position: absolute; left: 0; color: var(--primary-color);"></i>
                                <strong>${languageService.t('welcome.news')}</strong> ${languageService.t('welcome.news_desc')}
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-chart-bar" style="position: absolute; left: 0; color: var(--secondary-color);"></i>
                                <strong>${languageService.t('welcome.prediction')}</strong> ${languageService.t('welcome.prediction_desc')}
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
                                <i class="fas fa-clipboard-check" style="position: absolute; left: 0; color: var(--accent-color);"></i>
                                <strong>${languageService.t('welcome.evaluation')}</strong> ${languageService.t('welcome.evaluation_desc')}
                            </li>
                        </ul>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px;">${languageService.t('welcome.incentive')}</h3>
                        <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px;">
                            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                <div style="width: 32px; height: 32px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div>
                                    <strong>${languageService.t('welcome.base_pay')}</strong> ${languageService.t('welcome.base_pay_desc')}
                                </div>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div style="width: 32px; height: 32px; background: var(--accent-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div>
                                    <strong>${languageService.t('welcome.performance_bonus')}</strong> ${languageService.t('welcome.performance_bonus_desc')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-warning">
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${languageService.t('welcome.research')}</div>
                            <div class="alert-message">
                                ${languageService.t('welcome.research_message')}
                            </div>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary btn-full" id="continue-experiment">
                            <i class="fas fa-play-circle"></i> ${languageService.t('welcome.continue_session')}
                        </button>
                        <button class="btn btn-primary btn-full" id="start-new-experiment">
                            <i class="fas fa-plus-circle"></i> ${languageService.t('welcome.start_new')}
                        </button>
                    </div>

                    <div style="margin-top: 32px; text-align: center; color: var(--text-secondary); font-size: 14px;">
                        <p>
                            ${languageService.t('welcome.footer')}
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

        // Initialize welcome page language selector
        setTimeout(() => {
            languageService.initLanguageSelector('welcome-');
        }, 0);
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