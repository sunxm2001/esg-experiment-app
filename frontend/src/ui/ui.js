import { WelcomeView } from './views/welcome.js';
import { RegistrationView } from './views/registration.js';
import { NewsView } from './views/news.js';
import { PredictionView } from './views/prediction.js';
import { PosttestView } from './views/posttest.js';
import { CompletionView } from './views/completion.js';
import { CompletedView } from './views/completed.js';
import { ErrorView } from './views/error.js';

/**
 * Main UI manager
 */
export class UI {
    constructor(app) {
        this.app = app;
        this.root = document.getElementById('root');
        this.currentView = null;
        this.views = {};

        // Initialize views
        this.initViews();
    }

    /**
     * Initialize all views
     */
    initViews() {
        this.views = {
            'welcome': new WelcomeView(this),
            'registration': new RegistrationView(this),
            'news': new NewsView(this),
            'prediction': new PredictionView(this),
            'posttest': new PosttestView(this),
            'completion': new CompletionView(this),
            'completed': new CompletedView(this),
            'error': new ErrorView(this)
        };
    }

    /**
     * Initialize UI
     */
    init() {
        this.renderLayout();
        this.setupEventListeners();
    }

    /**
     * Render main layout
     */
    renderLayout() {
        this.root.innerHTML = `
            <div class="app-container">
                <header class="app-header" id="app-header"></header>
                <main class="main-content" id="main-content">
                    <div class="loading-container" id="loading-screen">
                        <div class="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                </main>
            </div>
        `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Handle route changes
        document.addEventListener('routechange', (event) => {
            this.updateLayout(event.detail.config);
        });
    }

    /**
     * Update layout based on route configuration
     */
    updateLayout(routeConfig) {
        const header = document.getElementById('app-header');
        if (header) {
            if (routeConfig.showHeader) {
                header.style.display = 'block';
                this.renderHeader();
            } else {
                header.style.display = 'none';
            }
        }
    }

    /**
     * Render application header
     */
    renderHeader() {
        const header = document.getElementById('app-header');
        if (!header) return;

        const user = this.app.getCurrentUser();
        const progress = this.app.getProgressPercentage();

        header.innerHTML = `
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="logo-text">
                        <h1>ESG Experiment</h1>
                        <p>Narrative Spillover & Investor Behavior</p>
                    </div>
                </div>
                <div class="user-info">
                    ${user ? `
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-labels">
                                <span class="progress-current">${Math.round(progress)}% Complete</span>
                                <span>Experiment Progress</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render a view
     */
    async renderView(viewName) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // Show loading screen
        this.showLoading();

        try {
            // Get the view instance
            const view = this.views[viewName];
            if (!view) {
                throw new Error(`View not found: ${viewName}`);
            }

            // Render the view
            const html = await view.render();
            mainContent.innerHTML = html;

            // Initialize the view
            if (view.init) {
                await view.init();
            }

            // Hide loading screen
            this.hideLoading();

            // Update current view
            this.currentView = view;

        } catch (error) {
            console.error(`Failed to render view ${viewName}:`, error);
            this.renderError('Failed to load page. Please try again.');
        }
    }

    /**
     * Show loading screen
     */
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    /**
     * Set loading state
     */
    setLoading(isLoading) {
        if (isLoading) {
            this.showLoading();
        } else {
            this.hideLoading();
        }
    }

    /**
     * Show alert message
     */
    showAlert(type, title, message) {
        const alertTypes = {
            'info': { icon: 'info-circle', class: 'alert-info' },
            'success': { icon: 'check-circle', class: 'alert-success' },
            'warning': { icon: 'exclamation-triangle', class: 'alert-warning' },
            'error': { icon: 'times-circle', class: 'alert-error' }
        };

        const alertConfig = alertTypes[type] || alertTypes.info;
        const alertId = `alert-${Date.now()}`;

        const alertHTML = `
            <div id="${alertId}" class="alert ${alertConfig.class}">
                <div class="alert-icon">
                    <i class="fas fa-${alertConfig.icon}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${title}</div>
                    <div class="alert-message">${message}</div>
                </div>
                <button class="btn btn-secondary" onclick="document.getElementById('${alertId}').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Insert at the beginning of main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.insertAdjacentHTML('afterbegin', alertHTML);
        }

        // Auto-remove after 5 seconds for success/info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                const alertElement = document.getElementById(alertId);
                if (alertElement) {
                    alertElement.remove();
                }
            }, 5000);
        }
    }

    /**
     * Show confirmation dialog
     */
    async showConfirm(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const dialogId = `confirm-${Date.now()}`;

            const dialogHTML = `
                <div id="${dialogId}" class="modal-overlay" style="
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5); display: flex;
                    align-items: center; justify-content: center; z-index: 2000;
                ">
                    <div class="modal" style="
                        background: white; border-radius: 8px; padding: 24px;
                        max-width: 400px; width: 90%; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    ">
                        <h3 style="margin-bottom: 8px;">${title}</h3>
                        <p style="margin-bottom: 24px; color: #666;">${message}</p>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button class="btn btn-secondary" id="${dialogId}-cancel">
                                ${cancelText}
                            </button>
                            <button class="btn btn-primary" id="${dialogId}-confirm">
                                ${confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', dialogHTML);

            const dialog = document.getElementById(dialogId);
            const confirmBtn = document.getElementById(`${dialogId}-confirm`);
            const cancelBtn = document.getElementById(`${dialogId}-cancel`);

            const cleanup = () => {
                confirmBtn.removeEventListener('click', onConfirm);
                cancelBtn.removeEventListener('click', onCancel);
                dialog.remove();
            };

            const onConfirm = () => {
                cleanup();
                resolve(true);
            };

            const onCancel = () => {
                cleanup();
                resolve(false);
            };

            confirmBtn.addEventListener('click', onConfirm);
            cancelBtn.addEventListener('click', onCancel);
        });
    }

    /**
     * Render error page
     */
    renderError(message = 'An unexpected error occurred.') {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Error</h2>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f44336; margin-bottom: 16px;"></i>
                        <p style="margin-bottom: 24px;">${message}</p>
                        <button class="btn btn-primary" data-route="welcome">
                            Return to Home
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        this.renderHeader();
    }

    /**
     * Get app instance
     */
    getApp() {
        return this.app;
    }
}