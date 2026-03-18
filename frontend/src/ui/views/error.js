/**
 * Error view
 */
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
                        <h2 class="card-title">Oops! Something Went Wrong</h2>
                        <p class="card-subtitle">We encountered an error while processing your request.</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: var(--error-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">Technical Error</h3>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
                            There seems to be a problem with the experiment application. This could be due to a network issue, server problem, or browser compatibility.
                        </p>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px; color: var(--text-primary);">Troubleshooting Steps</h3>
                        <div style="background: var(--background); border-radius: var(--border-radius); padding: 24px;">
                            <ol style="margin-left: 20px; padding-left: 0;">
                                <li style="margin-bottom: 12px;">
                                    <strong>Check your internet connection</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">Make sure you have a stable internet connection.</span>
                                </li>
                                <li style="margin-bottom: 12px;">
                                    <strong>Refresh the page</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">Try refreshing the browser page (F5 or Ctrl+R).</span>
                                </li>
                                <li style="margin-bottom: 12px;">
                                    <strong>Clear browser cache</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">Clear your browser's cache and cookies, then try again.</span>
                                </li>
                                <li style="margin-bottom: 12px;">
                                    <strong>Try a different browser</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">Switch to Chrome, Firefox, or Edge if you're using a different browser.</span>
                                </li>
                                <li>
                                    <strong>Contact support</strong><br>
                                    <span style="color: var(--text-secondary); font-size: 14px;">If the problem persists, please contact the research team.</span>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div class="alert alert-warning">
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">Data Preservation</div>
                            <div class="alert-message">
                                Your progress has been saved locally. You can safely refresh or close the page and return later to continue where you left off.
                            </div>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary" id="refresh-btn">
                            <i class="fas fa-redo"></i> Refresh Page
                        </button>
                        <button class="btn btn-primary" id="home-btn" data-route="welcome">
                            <i class="fas fa-home"></i> Return to Home
                        </button>
                    </div>

                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-secondary); font-size: 12px;">
                        <p>
                            Error Code: <code style="background: var(--background); padding: 2px 6px; border-radius: 4px;">ERR_${Date.now().toString(36).toUpperCase()}</code><br>
                            If contacting support, please provide this error code.
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
}