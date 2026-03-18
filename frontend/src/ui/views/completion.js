/**
 * Completion view (incentive calculation and payment)
 */
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
        const experimentGroup = user ? user.experiment_group : 'Unknown';

        return `
            <div class="completion-view">
                <div class="card">
                    <div class="card-header text-center">
                        <h2 class="card-title">Experiment Complete!</h2>
                        <p class="card-subtitle">Thank you for participating in our research study.</p>
                    </div>

                    <div class="text-center" style="margin: 40px 0;">
                        <i class="fas fa-trophy" style="font-size: 64px; color: var(--accent-color); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 16px;">Your Contribution</h3>
                        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
                            You have successfully completed all stages of the experiment. Your data will contribute to important research on ESG narratives and investor behavior.
                        </p>
                        <div class="group-badge group-${experimentGroup.toLowerCase()}" style="font-size: 14px; padding: 8px 16px;">
                            Experiment Group: ${experimentGroup}
                        </div>
                    </div>

                    <div id="performance-section" style="margin: 32px 0;">
                        <h3 style="margin-bottom: 20px; color: var(--text-primary);">Performance Summary</h3>

                        <div id="performance-loading" style="text-align: center; padding: 40px 0;">
                            <div class="loading-spinner"></div>
                            <p style="margin-top: 20px;">Calculating your performance and bonus...</p>
                        </div>

                        <div id="performance-results" style="display: none;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                                <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px; text-align: center;">
                                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">Prediction Accuracy</div>
                                    <div id="prediction-score" style="font-size: 32px; font-weight: 600; color: var(--primary-color);">--</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Score (0-100)</div>
                                </div>
                                <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px; text-align: center;">
                                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">Portfolio Performance</div>
                                    <div id="portfolio-score" style="font-size: 32px; font-weight: 600; color: var(--secondary-color);">--</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Score (0-100)</div>
                                </div>
                            </div>

                            <div style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%); color: white; border-radius: var(--border-radius); padding: 24px; margin-bottom: 24px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-size: 14px; opacity: 0.9;">Total Bonus Calculated</div>
                                        <div id="bonus-amount" style="font-size: 36px; font-weight: 700;">$--</div>
                                    </div>
                                    <div style="font-size: 48px;">
                                        <i class="fas fa-coins"></i>
                                    </div>
                                </div>
                            </div>

                            <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px;">
                                <h4 style="margin-bottom: 16px;">Payment Summary</h4>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <span>Base Pay:</span>
                                    <strong id="base-pay">$--</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <span>Performance Bonus:</span>
                                    <strong id="performance-bonus">$--</strong>
                                </div>
                                <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border-color);">
                                <div style="display: flex; justify-content: space-between; font-size: 18px;">
                                    <span>Total Payment:</span>
                                    <strong id="total-payment" style="color: var(--primary-color);">$--</strong>
                                </div>
                            </div>

                            <div id="payment-status" style="margin-top: 24px; text-align: center;">
                                <div id="payment-pending" class="alert alert-info">
                                    <div class="alert-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="alert-content">
                                        <div class="alert-title">Payment Pending</div>
                                        <div class="alert-message">
                                            Your payment will be processed within 3-5 business days. You will receive an email confirmation.
                                        </div>
                                    </div>
                                </div>
                                <div id="payment-awarded" class="alert alert-success" style="display: none;">
                                    <div class="alert-icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="alert-content">
                                        <div class="alert-title">Payment Awarded</div>
                                        <div class="alert-message">
                                            Your payment has been successfully awarded. You will receive it via your preferred payment method.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin: 32px 0;">
                        <h3 style="margin-bottom: 16px; color: var(--text-primary);">Next Steps</h3>
                        <div style="background: var(--background); border-radius: var(--border-radius); padding: 20px;">
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                                    <i class="fas fa-envelope" style="position: absolute; left: 0; color: var(--primary-color);"></i>
                                    <strong>Email Confirmation:</strong> You will receive a confirmation email with your payment details
                                </li>
                                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                                    <i class="fas fa-download" style="position: absolute; left: 0; color: var(--secondary-color);"></i>
                                    <strong>Data Download:</strong> Researchers can download anonymized data for analysis
                                </li>
                                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                                    <i class="fas fa-graduation-cap" style="position: absolute; left: 0; color: var(--accent-color);"></i>
                                    <strong>Research Publication:</strong> Results will be published in academic journals (all data anonymized)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-secondary" id="export-data-btn">
                            <i class="fas fa-download"></i> Export My Data (CSV)
                        </button>
                        <button class="btn btn-primary" id="finish-btn">
                            <i class="fas fa-home"></i> Return to Home
                        </button>
                    </div>

                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-secondary); font-size: 14px;">
                        <p>
                            For questions about your payment or the research study, please contact:<br>
                            <strong>researcher@university.edu</strong>
                        </p>
                        <p style="margin-top: 12px; font-size: 12px;">
                            Study ID: ESG-${experimentGroup}-${user ? user.id.substring(0, 8) : 'XXXX'} • Completion Date: ${new Date().toLocaleDateString()}
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
                            <div class="alert-title">Calculation Error</div>
                            <div class="alert-message">
                                Failed to calculate performance scores. Your base pay will still be awarded.
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
                finishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success
            const pendingElement = document.getElementById('payment-pending');
            const awardedElement = document.getElementById('payment-awarded');

            if (pendingElement) pendingElement.style.display = 'none';
            if (awardedElement) awardedElement.style.display = 'block';

            this.ui.showAlert('success', 'Payment Awarded',
                'Your payment has been successfully processed. You will receive an email confirmation shortly.');

            // Update button
            if (finishBtn) {
                finishBtn.disabled = false;
                finishBtn.innerHTML = '<i class="fas fa-home"></i> Return to Home';
            }

        } catch (error) {
            console.error('Payment award error:', error);
            this.ui.showAlert('error', 'Payment Error',
                'Failed to process payment. Please contact the researcher for assistance.');
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

            this.ui.showAlert('success', 'Data Exported',
                'Your experiment data has been downloaded as a CSV file.');

        } catch (error) {
            console.error('Data export error:', error);
            this.ui.showAlert('error', 'Export Error',
                'Failed to export data. Please try again.');
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
}