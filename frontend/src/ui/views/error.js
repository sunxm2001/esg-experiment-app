/**
 * Error view
 */
import { languageService } from '../../services/language.js';

export class ErrorView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
    }

    /**
     * Render error view
     */
    async render() {
        return `
            <div class="error-view">
                <div class="card">
                    <div class="card-header text-center">
                        <h2 class="card-title">${languageService.t('error.oops_title')}</h2>
                        <p class="card-subtitle">${languageService.t('error.oops_subtitle')}</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: var(--error-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">${languageService.t('error.technical_error')}</h3>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
                            ${languageService.t('error.technical_error_message')}
                        </p>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px; color: var(--text-primary);">${languageService.t('error.troubleshooting_steps')}</h3>
                        <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px;">
                            <ol style="margin-left: 20px; padding-left: 0;">
                                <li style="margin-bottom: 12px;">
                                    <strong>${languageService.t('error.step1_title')}</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">${languageService.t('error.step1_desc')}</span>
                                </li>
                                <li style="margin-bottom: 12px;">
                                    <strong>${languageService.t('error.step2_title')}</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">${languageService.t('error.step2_desc')}</span>
                                </li>
                                <li style="margin-bottom: 12px;">
                                    <strong>${languageService.t('error.step3_title')}</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">${languageService.t('error.step3_desc')}</span>
                                </li>
                                <li style="margin-bottom: 12px;">
                                    <strong>${languageService.t('error.step4_title')}</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">${languageService.t('error.step4_desc')}</span>
                                </li>
                                <li>
                                    <strong>${languageService.t('error.step5_title')}</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">${languageService.t('error.step5_desc')}</span>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div class="alert alert-warning">
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${languageService.t('error.data_preservation_title')}</div>
                            <div class="alert-message">
                                ${languageService.t('error.data_preservation_message')}
                            </div>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary" id="refresh-btn">
                            <i class="fas fa-redo"></i> ${languageService.t('error.refresh_page')}
                        </button>
                        <button class="btn btn-primary" id="home-btn" data-route="welcome">
                            <i class="fas fa-home"></i> ${languageService.t('error.return_home')}
                        </button>
                    </div>

                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-secondary); font-size: 12px;">
                        <p>
                            Error Code: <code style="background: var(--background); padding: 2px 6px; border-radius: 4px;">ERR_${Date.now().toString(36).toUpperCase()}</code><br>
                            ${languageService.t('error.error_code_message')}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize error view
     */
    async init() {
        this.setupEventListeners();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                location.reload();
            });
        }

        // Home button is handled by router via data-route attribute
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