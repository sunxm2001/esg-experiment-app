/**
 * Language service for managing bilingual support
 * Supports: English (en) and Chinese (zh)
 */

export class LanguageService {
    constructor() {
        this.currentLanguage = 'en'; // Default language
        this.translations = {
            en: {},
            zh: {}
        };

        // Load translations
        this.loadTranslations();
    }

    /**
     * Load translation data
     */
    loadTranslations() {
        // Basic UI translations
        this.translations.en = {
            // Common
            'app.name': 'ESG Experiment',
            'app.subtitle': 'Narrative Spillover & Investor Behavior',
            'app.loading': 'Loading...',
            'app.error': 'Error',
            'app.success': 'Success',
            'app.warning': 'Warning',
            'app.info': 'Info',
            'app.confirm': 'Confirm',
            'app.cancel': 'Cancel',
            'app.save': 'Save',
            'app.submit': 'Submit',
            'app.next': 'Next',
            'app.back': 'Back',
            'app.continue': 'Continue',
            'app.retry': 'Retry',
            'app.close': 'Close',

            // Language selector
            'language.english': 'English',
            'language.chinese': '中文',
            'language.select': 'Select Language',

            // Header
            'header.progress': 'Experiment Progress',
            'header.complete': 'Complete',

            // Welcome page
            'welcome.title': 'Welcome to the ESG Experiment',
            'welcome.subtitle': 'Narrative Spillover, Retail Investor Misunderstanding & Trading Behavior',
            'welcome.description': 'This research study examines how Environmental, Social, and Governance (ESG) news narratives influence retail investors\' beliefs and trading decisions.',
            'welcome.important_info': 'Important Information',
            'welcome.important_message': 'Please read the following information carefully before proceeding. This experiment will take approximately 30-45 minutes to complete.',
            'welcome.expectations': 'What to Expect:',
            'welcome.registration': 'Registration & Pre-test:',
            'welcome.registration_desc': 'Demographic information and preference assessments',
            'welcome.news': 'News Reading Task:',
            'welcome.news_desc': 'Read financial news articles with time limits',
            'welcome.prediction': 'Prediction & Trading:',
            'welcome.prediction_desc': 'Make financial predictions and allocate virtual capital',
            'welcome.evaluation': 'Post-experiment Evaluation:',
            'welcome.evaluation_desc': 'Complete questionnaires and feedback',
            'welcome.incentive': 'Incentive Structure:',
            'welcome.base_pay': 'Base Pay:',
            'welcome.base_pay_desc': 'Receive a fixed amount for completing all tasks',
            'welcome.performance_bonus': 'Performance Bonus:',
            'welcome.performance_bonus_desc': 'Additional payment based on prediction accuracy and portfolio performance',
            'welcome.research': 'Research Participation',
            'welcome.research_message': 'Your participation is voluntary. You may withdraw at any time without penalty. All data collected will be anonymized and used solely for academic research purposes.',
            'welcome.continue_session': 'Continue Previous Session',
            'welcome.start_new': 'Start New Experiment',
            'welcome.footer': 'This study is conducted by the Behavioral Finance Research Group. For questions or concerns, please contact: researcher@university.edu',

            // Registration page (to be expanded)
            'registration.title': 'Registration & Pre-test',
            'registration.subtitle': 'Please provide your demographic information',

            // Navigation
            'nav.home': 'Home',
            'nav.profile': 'Profile',
            'nav.news': 'News',
            'nav.predictions': 'Predictions',
            'nav.results': 'Results'
        };

        this.translations.zh = {
            // Common
            'app.name': 'ESG实验',
            'app.subtitle': '叙事溢出与投资者行为',
            'app.loading': '加载中...',
            'app.error': '错误',
            'app.success': '成功',
            'app.warning': '警告',
            'app.info': '信息',
            'app.confirm': '确认',
            'app.cancel': '取消',
            'app.save': '保存',
            'app.submit': '提交',
            'app.next': '下一步',
            'app.back': '返回',
            'app.continue': '继续',
            'app.retry': '重试',
            'app.close': '关闭',

            // Language selector
            'language.english': 'English',
            'language.chinese': '中文',
            'language.select': '选择语言',

            // Header
            'header.progress': '实验进度',
            'header.complete': '完成',

            // Welcome page
            'welcome.title': '欢迎参加ESG实验',
            'welcome.subtitle': '叙事溢出、零售投资者误解与交易行为',
            'welcome.description': '本研究探讨环境、社会和治理（ESG）新闻叙事如何影响零售投资者的信念形成与交易决策。',
            'welcome.important_info': '重要信息',
            'welcome.important_message': '请在继续之前仔细阅读以下信息。本实验大约需要30-45分钟完成。',
            'welcome.expectations': '实验流程：',
            'welcome.registration': '注册与前测：',
            'welcome.registration_desc': '填写人口统计学信息并进行偏好评估',
            'welcome.news': '新闻阅读任务：',
            'welcome.news_desc': '阅读财经新闻文章（有时间限制）',
            'welcome.prediction': '预测与交易：',
            'welcome.prediction_desc': '进行财务预测并分配虚拟资金',
            'welcome.evaluation': '实验后评估：',
            'welcome.evaluation_desc': '完成问卷调查和反馈',
            'welcome.incentive': '激励机制：',
            'welcome.base_pay': '基础报酬：',
            'welcome.base_pay_desc': '完成所有任务可获得固定报酬',
            'welcome.performance_bonus': '绩效奖金：',
            'welcome.performance_bonus_desc': '根据预测准确性和投资组合表现获得额外报酬',
            'welcome.research': '研究参与',
            'welcome.research_message': '您的参与是自愿的。您可以随时退出而不会受到任何惩罚。所有收集的数据都将匿名处理，仅用于学术研究目的。',
            'welcome.continue_session': '继续上次会话',
            'welcome.start_new': '开始新实验',
            'welcome.footer': '本研究由行为金融学研究小组进行。如有问题或疑虑，请联系：researcher@university.edu',

            // Registration page (to be expanded)
            'registration.title': '注册与前测',
            'registration.subtitle': '请提供您的人口统计学信息',

            // Navigation
            'nav.home': '首页',
            'nav.profile': '个人资料',
            'nav.news': '新闻',
            'nav.predictions': '预测',
            'nav.results': '结果'
        };
    }

    /**
     * Set the current language
     * @param {string} lang - Language code ('en' or 'zh')
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.saveLanguagePreference();
            return true;
        }
        return false;
    }

    /**
     * Get the current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @param {object} params - Optional parameters for string interpolation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage][key] ||
                           this.translations.en[key] ||
                           key;

        // Simple parameter replacement
        let result = translation;
        for (const [paramKey, paramValue] of Object.entries(params)) {
            result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
        }

        return result;
    }

    /**
     * Get all available languages
     * @returns {Array} Array of language objects
     */
    getAvailableLanguages() {
        return [
            { code: 'en', name: this.translations.en['language.english'] || 'English' },
            { code: 'zh', name: this.translations.zh['language.chinese'] || '中文' }
        ];
    }

    /**
     * Save language preference to localStorage
     */
    saveLanguagePreference() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('esg_experiment_language', this.currentLanguage);
        }
    }

    /**
     * Load language preference from localStorage
     */
    loadLanguagePreference() {
        if (typeof localStorage !== 'undefined') {
            const savedLang = localStorage.getItem('esg_experiment_language');
            if (savedLang && this.translations[savedLang]) {
                this.currentLanguage = savedLang;
                return true;
            }
        }
        return false;
    }

    /**
     * Initialize language service
     */
    init() {
        this.loadLanguagePreference();
        return this;
    }

    /**
     * Get language selector HTML
     * @returns {string} HTML for language selector
     */
    getLanguageSelectorHTML() {
        const languages = this.getAvailableLanguages();
        const currentLang = this.getCurrentLanguage();

        return `
            <div class="language-selector">
                <button class="btn btn-secondary btn-sm language-toggle" id="language-toggle">
                    <i class="fas fa-globe"></i>
                    ${this.t('language.select')}
                </button>
                <div class="language-dropdown" id="language-dropdown" style="display: none;">
                    ${languages.map(lang => `
                        <button class="language-option ${lang.code === currentLang ? 'active' : ''}"
                                data-lang="${lang.code}">
                            ${lang.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Initialize language selector events
     */
    initLanguageSelector() {
        const toggle = document.getElementById('language-toggle');
        const dropdown = document.getElementById('language-dropdown');

        if (toggle && dropdown) {
            // Toggle dropdown
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Language selection
            document.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const lang = e.target.getAttribute('data-lang');
                    this.setLanguage(lang);
                    dropdown.style.display = 'none';

                    // Dispatch event for language change
                    document.dispatchEvent(new CustomEvent('languagechange', {
                        detail: { language: lang }
                    }));
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.style.display = 'none';
            });
        }
    }
}

// Create singleton instance
export const languageService = new LanguageService();