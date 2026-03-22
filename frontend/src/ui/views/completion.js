/**
 * Completion view (incentive calculation and payment)
 */
import { languageService } from '../../services/language.js';

export class CompletionView {
    constructor(ui) {
        this.ui = ui;
        this.app = ui.getApp();
        this.performanceData = null;
        this.paymentCalculated = false;
    }

    /**
     * Render completion view
     */
    async render() {
        const user = this.app.getCurrentUser();
        const experimentGroup = user ? user.experiment_group : languageService.t('completion.unknown_group');

        return `
            <div class="completion-view">
                <div class="card">
                    <div class="card-header text-center">
                        <h2 class="card-title">${languageService.t('completion.title')}</h2>
                        <p class="card-subtitle">${languageService.t('completion.subtitle')}</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <i class="fas fa-trophy" style="font-size: 64px; color: var(--accent-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">${languageService.t('completion.contribution')}</h3>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
                            ${languageService.t('completion.contribution_message')}
                        </p>
                        <div class="group-badge group-${experimentGroup.toLowerCase()}" style="font-size: 14px; padding: 8px 16px;">
                            ${languageService.t('completion.experiment_group')} ${experimentGroup}
                        </div>
                    </div>

                    <div id="performance-section" style="margin: 32px 0;">
                        <h3 style="margin-bottom: 20px; color: var(--text-primary);">${languageService.t('completion.performance_summary')}</h3>

                        <div id="performance-loading" style="text-align: center; padding: 40px 0;">
                            <div class="loading-spinner"></div>
                            <p style="margin-top: 20px;">${languageService.t('completion.calculating_performance')}</p>
                        </div>

                        <div id="performance-results" style="display: none;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                                <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px; text-align: center;">
                                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">${languageService.t('completion.prediction_accuracy')}</div>
                                    <div id="prediction-score" style="font-size: 32px; font-weight: 600; color: var(--primary-color);">--</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">${languageService.t('completion.prediction_score')}</div>
                                </div>
                                <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px; text-align: center;">
                                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">${languageService.t('completion.portfolio_performance')}</div>
                                    <div id="portfolio-score" style="font-size: 32px; font-weight: 600; color: var(--secondary-color);">--</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">${languageService.t('completion.portfolio_score')}</div>
                                </div>
                            </div>

                            <div style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%); color: white; border-radius: var(--border-radius); padding: 24px; margin-bottom: 24px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-size: 14px; opacity: 0.9;">${languageService.t('completion.total_bonus')}</div>
                                        <div id="bonus-amount" style="font-size: 36px; font-weight: 700;">$--</div>
                                    </div>
                                    <div style="font-size: 48px;">
                                        <i class="fas fa-coins"></i>
                                    </div>
                                </div>
                            </div>

                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px;">
                                <h4 style="margin-bottom: 16px;">${languageService.t('completion.payment_summary')}</h4>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <span>${languageService.t('completion.base_pay')}</span>
                                    <strong id="base-pay">$--</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <span>${languageService.t('completion.performance_bonus')}</span>
                                    <strong id="performance-bonus">$--</strong>
                                </div>
                                <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border-color);">
                                <div style="display: flex; justify-content: space-between; font-size: 18px;">
                                    <span>${languageService.t('completion.total_payment')}</span>
                                    <strong id="total-payment" style="color: var(--primary-color);">$--</strong>
                                </div>
                            </div>

                            <div id="payment-status" style="margin-top: 24px; text-align: center;">
                                <div id="payment-pending" class="alert alert-info">
                                    <div class="alert-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="alert-content">
                                        <div class="alert-title">${languageService.t('completion.payment_pending_title')}</div>
                                        <div class="alert-message">
                                            ${languageService.t('completion.payment_pending_message')}
                                        </div>
                                    </div>
                                </div>
                                <div id="payment-awarded" class="alert alert-success" style="display: none;">
                                    <div class="alert-icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="alert-content">
                                        <div class="alert-title">${languageService.t('completion.payment_awarded_title')}</div>
                                        <div class="alert-message">
                                            ${languageService.t('completion.payment_awarded_message')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px; color: var(--text-primary);">${languageService.t('completion.next_steps')}</h3>
                        <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px;">
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                                    <i class="fas fa-envelope" style="position: absolute; left: 0; color: var(--primary-color);"></i>
                                    <strong>${languageService.t('completion.next_steps_email')}</strong> ${languageService.t('completion.next_steps_email_desc')}
                                </li>
                                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                                    <i class="fas fa-download" style="position: absolute; left: 0; color: var(--secondary-color);"></i>
                                    <strong>${languageService.t('completion.next_steps_data')}</strong> ${languageService.t('completion.next_steps_data_desc')}
                                </li>
                                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                                    <i class="fas fa-graduation-cap" style="position: absolute; left: 0; color: var(--accent-color);"></i>
                                    <strong>${languageService.t('completion.next_steps_publication')}</strong> ${languageService.t('completion.next_steps_publication_desc')}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary" id="export-data-btn">
                            <i class="fas fa-download"></i> ${languageService.t('completion.export_data')}
                        </button>
                        <button class="btn btn-primary" id="finish-btn">
                            <i class="fas fa-home"></i> ${languageService.t('completion.return_home')}
                        </button>
                    </div>

                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-secondary); font-size: 14px;">
                        <p>
                            ${languageService.t('completion.contact_message')}<br>
                            <strong>researcher@university.edu</strong>
                        </p>
                        <p style="margin-top: 12px; font-size: 12px;">
                            ${languageService.t('completion.study_id', { study_id: `ESG-${experimentGroup}-${user ? user.id.substring(0, 8) : 'XXXX'}`, date: new Date().toLocaleDateString() })}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize completion view
     */
    async init() {
        await this.calculatePerformance();
        this.setupEventListeners();
    }

    /**
     * Calculate performance and bonus
     */
    async calculatePerformance() {
        const loadingElement = document.getElementById('performance-loading');
        const resultsElement = document.getElementById('performance-results');

        try {
            // Simulate performance calculation (in production, this would call the API)
            // For now, generate simulated scores
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate calculation delay

            // Generate simulated performance data
            this.performanceData = {
                prediction_accuracy_score: Math.floor(Math.random() * 30) + 65, // 65-95
                portfolio_performance_score: Math.floor(Math.random() * 40) + 60, // 60-100
                bonus_calculated: 0,
                base_pay_awarded: 10.00 // $10 base pay
            };

            // Calculate bonus (simple formula)
            const avgScore = (this.performanceData.prediction_accuracy_score + this.performanceData.portfolio_performance_score) / 2;
            this.performanceData.bonus_calculated = (avgScore / 100) * 20; // Up to $20 bonus

            // Calculate total
            const totalPayment = this.performanceData.base_pay_awarded + this.performanceData.bonus_calculated;

            // Update UI
            if (loadingElement) loadingElement.style.display = 'none';
            if (resultsElement) resultsElement.style.display = 'block';

            this.updatePerformanceDisplay();

            // Submit to server (simulated)
            await this.submitPerformanceData();

            this.paymentCalculated = true;

        } catch (error) {
            console.error('Performance calculation error:', error);

            if (loadingElement) {
                loadingElement.innerHTML = `
                    <div class="alert alert-error">
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${languageService.t('completion.calculation_error_title')}</div>
                            <div class="alert-message">
                                ${languageService.t('completion.calculation_error_message')}
                            </div>
                        </div>
                    </div>
                `;
            }

            // Set default values
            this.performanceData = {
                prediction_accuracy_score: 75,
                portfolio_performance_score: 75,
                bonus_calculated: 15,
                base_pay_awarded: 10.00
            };

            if (resultsElement) {
                resultsElement.style.display = 'block';
                this.updatePerformanceDisplay();
            }
        }
    }

    /**
     * Update performance display
     */
    updatePerformanceDisplay() {
        if (!this.performanceData) return;

        // Update scores
        const predictionScore = document.getElementById('prediction-score');
        const portfolioScore = document.getElementById('portfolio-score');
        const bonusAmount = document.getElementById('bonus-amount');
        const basePay = document.getElementById('base-pay');
        const performanceBonus = document.getElementById('performance-bonus');
        const totalPayment = document.getElementById('total-payment');

        if (predictionScore) {
            predictionScore.textContent = this.performanceData.prediction_accuracy_score.toFixed(1);
        }

        if (portfolioScore) {
            portfolioScore.textContent = this.performanceData.portfolio_performance_score.toFixed(1);
        }

        if (bonusAmount) {
            bonusAmount.textContent = `$${this.performanceData.bonus_calculated.toFixed(2)}`;
        }

        if (basePay) {
            basePay.textContent = `$${this.performanceData.base_pay_awarded.toFixed(2)}`;
        }

        if (performanceBonus) {
            performanceBonus.textContent = `$${this.performanceData.bonus_calculated.toFixed(2)}`;
        }

        if (totalPayment) {
            const total = this.performanceData.base_pay_awarded + this.performanceData.bonus_calculated;
            totalPayment.textContent = `$${total.toFixed(2)}`;
        }
    }

    /**
     * Submit performance data to server
     */
    async submitPerformanceData() {
        try {
            // In production, this would call the API
            // For now, just simulate
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Performance data submitted:', this.performanceData);
            return { success: true };

        } catch (error) {
            console.error('Failed to submit performance data:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Award payment (simulated)
     */
    async awardPayment() {
        try {
            // Show processing state
            const finishBtn = document.getElementById('finish-btn');
            if (finishBtn) {
                finishBtn.disabled = true;
                finishBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${languageService.t('completion.processing_payment')}`;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success
            const pendingElement = document.getElementById('payment-pending');
            const awardedElement = document.getElementById('payment-awarded');

            if (pendingElement) pendingElement.style.display = 'none';
            if (awardedElement) awardedElement.style.display = 'block';

            this.ui.showAlert('success', languageService.t('completion.payment_awarded_alert'),
                languageService.t('completion.payment_awarded_alert_message'));

            // Update button
            if (finishBtn) {
                finishBtn.disabled = false;
                finishBtn.innerHTML = `<i class="fas fa-home"></i> ${languageService.t('completion.return_home')}`;
            }

        } catch (error) {
            console.error('Payment award error:', error);
            this.ui.showAlert('error', languageService.t('completion.payment_error'),
                languageService.t('completion.payment_error_message'));
        }
    }

    /**
     * Export user data
     */
    async exportUserData() {
        try {
            // Get all user data from state
            const userData = this.app.state.exportData();

            // Convert to CSV format (simplified)
            const csvContent = this.convertToCSV(userData);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `esg_experiment_data_${this.app.currentUser.id.substring(0, 8)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.ui.showAlert('success', languageService.t('completion.data_exported'),
                languageService.t('completion.data_exported_message'));

        } catch (error) {
            console.error('Data export error:', error);
            this.ui.showAlert('error', languageService.t('completion.export_error'),
                languageService.t('completion.export_error_message'));
        }
    }

    /**
     * Convert data to CSV format
     */
    convertToCSV(data) {
        // Simplified CSV conversion
        const rows = [];
        const headers = Object.keys(data);
        rows.push(headers.join(','));

        const values = headers.map(header => {
            const value = data[header];
            if (typeof value === 'object') {
                return JSON.stringify(value).replace(/"/g, '""');
            }
            return `"${value}"`;
        });

        rows.push(values.join(','));
        return rows.join('\n');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Export data button
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportUserData();
            });
        }

        // Finish button
        const finishBtn = document.getElementById('finish-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                // Award payment first (simulated)
                this.awardPayment();

                // Navigate to completed view after delay
                setTimeout(() => {
                    this.app.router.navigate('completed');
                }, 3000);
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