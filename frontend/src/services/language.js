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

            // Registration page
            'registration.title': 'Registration & Pre-Experiment Assessment',
            'registration.subtitle': 'Please provide your demographic information and complete the initial assessments.',
            'registration.demographic_info': 'Demographic Information',
            'registration.email': 'Email Address',
            'registration.email_help': 'Used for payment and communication purposes only.',
            'registration.age': 'Age',
            'registration.gender': 'Gender',
            'registration.gender_select': 'Select gender',
            'registration.gender_male': 'Male',
            'registration.gender_female': 'Female',
            'registration.gender_nonbinary': 'Non-binary',
            'registration.gender_prefernottosay': 'Prefer not to say',
            'registration.gender_other': 'Other',
            'registration.education': 'Highest Education Level',
            'registration.education_select': 'Select education level',
            'registration.education_highschool': 'High School',
            'registration.education_associate': 'Associate Degree',
            'registration.education_bachelor': 'Bachelor\'s Degree',
            'registration.education_master': 'Master\'s Degree',
            'registration.education_doctorate': 'Doctorate',
            'registration.education_other': 'Other',
            'registration.investment_years': 'Years of Investment Experience',
            'registration.investment_help': 'Enter 0 if you have no investment experience.',
            'registration.risk_assessment': 'Risk Preference Assessment',
            'registration.risk_question': 'How would you describe your willingness to take financial risks?',
            'registration.risk_averse': 'Very Risk Averse',
            'registration.risk_seeking': 'Very Risk Seeking',
            'registration.risk_cautious': 'Extremely cautious',
            'registration.risk_moderate': 'Moderate',
            'registration.risk_bold': 'Extremely bold',
            'registration.esg_assessment': 'ESG Preference Assessment',
            'registration.esg_question': 'How important are Environmental, Social, and Governance (ESG) factors in your investment decisions?',
            'registration.esg_notimportant': 'Not Important',
            'registration.esg_veryimportant': 'Very Important',
            'registration.esg_never': 'Never consider ESG',
            'registration.esg_sometimes': 'Sometimes consider',
            'registration.esg_always': 'Always prioritize ESG',
            'registration.group_assignment': 'Random Group Assignment',
            'registration.group_message': 'After registration, you will be randomly assigned to one of five experimental groups. This assignment determines the type of news articles you will read during the experiment.',
            'registration.back_welcome': 'Back to Welcome',
            'registration.complete': 'Complete Registration & Start Experiment',
            'registration.validation_required': 'This field is required',
            'registration.validation_email': 'Please enter a valid email address',
            'registration.validation_min': 'Value must be at least {{min}}',
            'registration.validation_max': 'Value must be at most {{max}}',
            'registration.validation_risk': 'Please select a risk preference rating.',
            'registration.validation_esg': 'Please select an ESG preference rating.',
            'registration.validation_all': 'Please fill in all required fields correctly.',
            'registration.success': 'Registration Successful',
            'registration.success_message': 'You have been assigned to Group {{group}}. Please proceed to the news reading task.',
            'registration.error': 'Registration Failed',
            'registration.error_message': 'Registration failed. Please try again.',
            'registration.error_unexpected': 'An unexpected error occurred. Please try again.',
            'registration.processing': 'Processing...',

            // Navigation
            'nav.home': 'Home',
            'nav.profile': 'Profile',
            'nav.news': 'News',
            'nav.predictions': 'Predictions',
            'nav.results': 'Results',

            // News reading task
            'news.title': 'News Reading Task',
            'news.subtitle': 'Read the following article carefully. You have a limited time to read and answer questions.',
            'news.loading_articles': 'Loading news articles...',
            'news.credibility_title': 'Article Credibility Rating',
            'news.credibility_question': 'How credible do you find this article?',
            'news.credibility_not_credible': 'Not at all credible',
            'news.credibility_extremely_credible': 'Extremely credible',
            'news.credibility_completely_unreliable': 'Completely unreliable',
            'news.credibility_moderately_credible': 'Moderately credible',
            'news.credibility_highly_trustworthy': 'Highly trustworthy',
            'news.next_article': 'Next Article',
            'news.complete_title': 'News Reading Task Complete!',
            'news.complete_message': 'You have completed all news articles. Please proceed to the prediction and trading task.',
            'news.proceed_prediction': 'Proceed to Prediction Task',
            'news.attention_title': 'Attention Tracking',
            'news.attention_message': 'Your reading time is being tracked as a measure of attention. Please read each article carefully within the time limit.',
            'news.session_error': 'Session Error',
            'news.user_not_found': 'User session not found. Please restart the experiment.',
            'news.loading_error': 'Failed to load news articles. Please try again.',
            'news.no_articles': 'No articles available for your experiment group.',
            'news.unexpected_error': 'An unexpected error occurred while loading articles.',
            'news.article_error': 'Article Error',
            'news.article_load_error': 'Failed to load article content. Please refresh the page or contact the researcher.',
            'news.reading_progress': 'Reading Progress',
            'news.progress_message': 'Complete all articles to earn your base payment.',
            'news.articles': 'Articles',
            'news.time_limit': 'Time limit: {{seconds}} seconds',
            'news.article_x_of_y': 'Article {{current}} of {{total}}',
            'news.no_content': 'No content available for this article.',
            'news.time_expired': 'Time Expired',
            'news.time_expired_message': 'Time limit reached. Please rate the article credibility and proceed.',
            'news.rating_required': 'Rating Required',
            'news.rating_required_message': 'Please rate the article credibility before proceeding.',
            'news.seconds_remaining': 'Seconds Remaining',
            'news.filler_article': 'Filler Article',

            // Prediction and trading task
            'prediction.title': 'Prediction & Trading Decision',
            'prediction.subtitle': 'Based on the article you just read, make predictions and allocate your virtual capital.',
            'prediction.loading_article': 'Loading article information...',
            'prediction.financial_title': 'Financial Predictions',
            'prediction.financial_question': 'Based on the news article, how do you expect the company to perform in the future?',
            'prediction.stock_title': 'Future Stock Price',
            'prediction.stock_question': 'How do you expect the company\'s stock price to perform over the next year?',
            'prediction.stock_decline': 'Strongly Decline',
            'prediction.stock_increase': 'Strongly Increase',
            'prediction.stock_significant_loss': 'Significant loss expected',
            'prediction.stock_stable': 'Stable performance',
            'prediction.stock_major_gains': 'Major gains expected',
            'prediction.profit_title': 'Future Profitability',
            'prediction.profit_question': 'How do you expect the company\'s profitability to change over the next year?',
            'prediction.profit_decrease': 'Strongly Decrease',
            'prediction.profit_increase': 'Strongly Increase',
            'prediction.profit_major_decline': 'Major decline in profits',
            'prediction.profit_steady': 'Steady profitability',
            'prediction.profit_substantial_growth': 'Substantial profit growth',
            'prediction.trading_title': 'Trading Decision',
            'prediction.trading_question': 'You have <strong>${{capital}}</strong> in virtual capital. What percentage would you invest in this company\'s stock?',
            'prediction.slider_no_investment': '0% (No investment)',
            'prediction.slider_all_in': '100% (All-in)',
            'prediction.amount_to_invest': 'Amount to invest:',
            'prediction.remaining_capital': 'Remaining capital:',
            'prediction.performance_bonus_title': 'Performance Bonus',
            'prediction.performance_bonus_message': 'Your prediction accuracy and portfolio performance will determine your bonus payment at the end of the experiment.',
            'prediction.skip_article': 'Skip This Article',
            'prediction.submit': 'Submit Prediction & Continue',
            'prediction.complete_title': 'Predictions Complete!',
            'prediction.complete_message': 'You have completed all prediction tasks. Please proceed to the post-experiment evaluation.',
            'prediction.proceed_evaluation': 'Proceed to Evaluation',
            'prediction.validation_error': 'Validation Error',
            'prediction.validation_message': 'Please complete both prediction ratings before submitting.',
            'prediction.processing': 'Processing...',
            'prediction.submission_success': 'Prediction Submitted',
            'prediction.submission_success_message': 'Your prediction has been recorded. Loading next article...',
            'prediction.submission_failed': 'Submission Failed',
            'prediction.submission_error': 'Submission Error',
            'prediction.submission_error_message': 'An unexpected error occurred. Please try again.',

            // Post-experiment evaluation
            'posttest.title': 'Post-Experiment Evaluation',
            'posttest.subtitle': 'Please complete the following questionnaires and evaluations.',
            'posttest.cognitive_title': 'Cognitive Spillover Assessment',
            'posttest.cognitive_question': 'To what extent do you agree with the following statement?',
            'posttest.cognitive_statement': '\"Good ESG performance will lead to good financial performance.\"',
            'posttest.cognitive_disagree': 'Strongly Disagree',
            'posttest.cognitive_agree': 'Strongly Agree',
            'posttest.cognitive_completely_disagree': 'Completely disagree',
            'posttest.cognitive_neutral': 'Neutral',
            'posttest.cognitive_completely_agree': 'Completely agree',
            'posttest.emotional_title': 'Emotional State Assessment',
            'posttest.emotional_question': 'How do you feel right now? Please rate your current emotional state.',
            'posttest.positive_title': 'Positive Emotions',
            'posttest.positive_question': 'How strongly are you experiencing positive emotions (e.g., interested, excited, enthusiastic)?',
            'posttest.negative_title': 'Negative Emotions',
            'posttest.negative_question': 'How strongly are you experiencing negative emotions (e.g., distressed, upset, nervous)?',
            'posttest.emotional_not_at_all': 'Not at all',
            'posttest.emotional_extremely': 'Extremely',
            'posttest.credibility_title': 'Overall News Credibility',
            'posttest.credibility_question': 'Overall, how credible did you find the news articles you read during this experiment?',
            'posttest.credibility_not_credible': 'Not at all credible',
            'posttest.credibility_extremely_credible': 'Extremely credible',
            'posttest.credibility_completely_unreliable': 'Completely unreliable',
            'posttest.credibility_moderately_credible': 'Moderately credible',
            'posttest.credibility_highly_trustworthy': 'Highly trustworthy',
            'posttest.recall_title': 'News Recall Check',
            'posttest.recall_question': 'Please recall the main news articles you read during the experiment.',
            'posttest.recall_topic_label': 'What was the main topic of the news articles?',
            'posttest.recall_tone_label': 'What was the overall tone of the news articles?',
            'posttest.recall_manipulation_label': 'Based on your recall, did you read articles that matched your expectations?',
            'posttest.recall_yes': 'Yes, the articles matched what I expected',
            'posttest.recall_no': 'No, the articles were different than expected',
            'posttest.preference_title': 'Final Preference Assessment',
            'posttest.preference_question': 'Please rate your current preferences after completing the experiment.',
            'posttest.risk_post_title': 'Risk Preference',
            'posttest.risk_post_question': 'How would you describe your willingness to take financial risks now?',
            'posttest.risk_averse': 'Very Risk Averse',
            'posttest.risk_seeking': 'Very Risk Seeking',
            'posttest.esg_post_title': 'ESG Preference',
            'posttest.esg_post_question': 'How important are ESG factors in your investment decisions now?',
            'posttest.esg_not_important': 'Not Important',
            'posttest.esg_very_important': 'Very Important',
            'posttest.attention_title': 'Attention Check Questions',
            'posttest.attention_question': 'Please answer these questions carefully to show you are paying attention.',
            'posttest.attention_check_1_label': 'Please select <strong>\"Strongly Agree\"</strong> to show you are paying attention:',
            'posttest.attention_check_2_label': 'Please select <strong>\"Not at all\"</strong> for this question:',
            'posttest.attention_options': ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
            'posttest.attention_options_2': ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
            'posttest.comments_title': 'Additional Comments',
            'posttest.comments_label': 'Any additional comments or feedback about the experiment?',
            'posttest.comments_placeholder': 'Optional: Share your thoughts about the experiment, suggestions for improvement, or any difficulties you encountered.',
            'posttest.data_integrity_title': 'Data Integrity',
            'posttest.data_integrity_message': 'Your honest responses are crucial for the validity of this research. Please answer all questions thoughtfully.',
            'posttest.submit': 'Complete Evaluation & Finish Experiment',
            'posttest.processing': 'Processing...',
            'posttest.evaluation_complete': 'Evaluation Complete',
            'posttest.evaluation_complete_message': 'Thank you for completing the experiment! Processing your results...',
            'posttest.validation_error': 'Validation Error',
            'posttest.submission_failed': 'Submission Failed',
            'posttest.submission_error': 'Submission Error',
            'posttest.submission_error_message': 'An unexpected error occurred. Please try again.',

            // News recall topic options
            'posttest.recall_topic_esg': 'ESG (Environmental, Social, Governance)',
            'posttest.recall_topic_financial': 'Financial Performance',
            'posttest.recall_topic_esg_financial': 'Both ESG and Financial',
            'posttest.recall_topic_neutral': 'Neutral/Business News',
            'posttest.recall_topic_corporate_culture': 'Corporate Culture/Other',
            'posttest.recall_topic_not_sure': 'Not Sure/Don\'t Remember',

            // News recall tone options
            'posttest.recall_tone_positive': 'Positive/Optimistic',
            'posttest.recall_tone_neutral': 'Neutral/Balanced',
            'posttest.recall_tone_negative': 'Negative/Pessimistic',
            'posttest.recall_tone_mixed': 'Mixed/Varied',
            'posttest.recall_tone_not_sure': 'Not Sure/Don\'t Remember',

            // Validation field names
            'posttest.validation_field_esg_financial_link_rating': 'ESG-Financial Link rating',
            'posttest.validation_field_positive_affect_score': 'Positive emotions rating',
            'posttest.validation_field_negative_affect_score': 'Negative emotions rating',
            'posttest.validation_field_overall_credibility_rating': 'Overall credibility rating',
            'posttest.validation_field_risk_preference_post': 'Post-experiment risk preference',
            'posttest.validation_field_esg_preference_post': 'Post-experiment ESG preference',
            'posttest.validation_field_attention_check_1': 'Attention check question 1',
            'posttest.validation_field_attention_check_2': 'Attention check question 2',
            'posttest.validation_error_title': 'Validation Error',
            'posttest.validation_error_message': 'Please complete the following required fields: {fields}',
            'posttest.evaluation_complete_title': 'Evaluation Complete',
            'posttest.evaluation_complete_message': 'Thank you for completing the experiment! Processing your results...',

            // Completion view (incentive calculation)
            'completion.title': 'Experiment Complete!',
            'completion.subtitle': 'Thank you for participating in our research study.',
            'completion.contribution': 'Your Contribution',
            'completion.contribution_message': 'You have successfully completed all stages of the experiment. Your data will contribute to important research on ESG narratives and investor behavior.',
            'completion.performance_summary': 'Performance Summary',
            'completion.calculating_performance': 'Calculating your performance and bonus...',
            'completion.prediction_accuracy': 'Prediction Accuracy',
            'completion.prediction_score': 'Score (0-100)',
            'completion.portfolio_performance': 'Portfolio Performance',
            'completion.portfolio_score': 'Score (0-100)',
            'completion.total_bonus': 'Total Bonus Calculated',
            'completion.payment_summary': 'Payment Summary',
            'completion.base_pay': 'Base Pay:',
            'completion.performance_bonus': 'Performance Bonus:',
            'completion.total_payment': 'Total Payment:',
            'completion.payment_pending_title': 'Payment Pending',
            'completion.payment_pending_message': 'Your payment will be processed within 3-5 business days. You will receive an email confirmation.',
            'completion.payment_awarded_title': 'Payment Awarded',
            'completion.payment_awarded_message': 'Your payment has been successfully awarded. You will receive it via your preferred payment method.',
            'completion.next_steps': 'Next Steps',
            'completion.next_steps_email': 'Email Confirmation:',
            'completion.next_steps_email_desc': 'You will receive a confirmation email with your payment details',
            'completion.next_steps_data': 'Data Download:',
            'completion.next_steps_data_desc': 'Researchers can download anonymized data for analysis',
            'completion.next_steps_publication': 'Research Publication:',
            'completion.next_steps_publication_desc': 'Results will be published in academic journals (all data anonymized)',
            'completion.export_data': 'Export My Data (CSV)',
            'completion.return_home': 'Return to Home',
            'completion.processing_payment': 'Processing Payment...',
            'completion.payment_awarded_alert': 'Payment Awarded',
            'completion.payment_awarded_alert_message': 'Your payment has been successfully processed. You will receive an email confirmation shortly.',
            'completion.payment_error': 'Payment Error',
            'completion.payment_error_message': 'Failed to process payment. Please contact the researcher for assistance.',
            'completion.data_exported': 'Data Exported',
            'completion.data_exported_message': 'Your experiment data has been downloaded as a CSV file.',
            'completion.export_error': 'Export Error',
            'completion.export_error_message': 'Failed to export data. Please try again.',
            'completion.calculation_error_title': 'Calculation Error',
            'completion.calculation_error_message': 'Failed to calculate performance scores. Your base pay will still be awarded.',
            'completion.experiment_group': 'Experiment Group:',
            'completion.unknown_group': 'Unknown',
            'completion.contact_message': 'For questions about your payment or the research study, please contact:',
            'completion.study_id': 'Study ID: {{study_id}} • Completion Date: {{date}}',

            // Completed view (final thank you)
            'completed.title': 'Thank You for Your Participation!',
            'completed.subtitle': 'Your contribution to our research is greatly appreciated.',
            'completed.experiment_successful': 'Experiment Successfully Completed',
            'completed.experiment_successful_message': 'You have successfully completed the ESG Narrative Spillover experiment. Your responses will help advance our understanding of how media narratives influence investor behavior.',
            'completed.what_happens_next': 'What Happens Next?',
            'completed.payment_confirmation': 'Payment Confirmation',
            'completed.payment_confirmation_desc': 'You will receive an email within 3-5 business days confirming your payment details.',
            'completed.research_analysis': 'Research Analysis',
            'completed.research_analysis_desc': 'Your anonymized data will be analyzed as part of our academic research study.',
            'completed.publication': 'Publication',
            'completed.publication_desc': 'Results will be published in academic journals. All data remains completely anonymous.',
            'completed.data_privacy_title': 'Data Privacy Assured',
            'completed.data_privacy_message': 'Your personal information is protected and will never be shared. All research data is anonymized and used solely for academic purposes.',
            'completed.want_to_learn_more': 'Want to Learn More?',
            'completed.learn_more_message': 'If you\'re interested in the findings of this study or would like to participate in future research:',
            'completed.start_new_session': 'Start New Session (Different Participant)',
            'completed.close_experiment': 'Close Experiment',
            'completed.close_confirm': 'Are you sure you want to close the experiment?',
            'completed.footer': 'Behavioral Finance Research Group • Department of Finance • University<br>Study ID: ESG-EXP-2024 • IRB Approval: #2024-12345',

            // Error view
            'error.general_title': 'Error',
            'error.general_message': 'An unexpected error occurred.',
            'error.page_not_found': 'Page Not Found',
            'error.page_not_found_message': 'The page you are looking for does not exist.',
            'error.session_expired': 'Session Expired',
            'error.session_expired_message': 'Your session has expired. Please start a new experiment.',
            'error.return_home': 'Return to Home',
            'error.retry': 'Retry',
            'error.oops_title': 'Oops! Something Went Wrong',
            'error.oops_subtitle': 'We encountered an error while processing your request.',
            'error.technical_error': 'Technical Error',
            'error.technical_error_message': 'There seems to be a problem with the experiment application. This could be due to a network issue, server problem, or browser compatibility.',
            'error.troubleshooting_steps': 'Troubleshooting Steps',
            'error.step1_title': 'Check your internet connection',
            'error.step1_desc': 'Make sure you have a stable internet connection.',
            'error.step2_title': 'Refresh the page',
            'error.step2_desc': 'Try refreshing the browser page (F5 or Ctrl+R).',
            'error.step3_title': 'Clear browser cache',
            'error.step3_desc': 'Clear your browser\'s cache and cookies, then try again.',
            'error.step4_title': 'Try a different browser',
            'error.step4_desc': 'Switch to Chrome, Firefox, or Edge if you\'re using a different browser.',
            'error.step5_title': 'Contact support',
            'error.step5_desc': 'If the problem persists, please contact the research team.',
            'error.data_preservation_title': 'Data Preservation',
            'error.data_preservation_message': 'Your progress has been saved locally. You can safely refresh or close the page and return later to continue where you left off.',
            'error.refresh_page': 'Refresh Page',
            'error.error_code_message': 'If contacting support, please provide this error code.',

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

            // Registration page
            'registration.title': '注册与实验前评估',
            'registration.subtitle': '请提供您的人口统计学信息并完成初步评估。',
            'registration.demographic_info': '人口统计学信息',
            'registration.email': '电子邮件地址',
            'registration.email_help': '仅用于付款和沟通目的。',
            'registration.age': '年龄',
            'registration.gender': '性别',
            'registration.gender_select': '选择性别',
            'registration.gender_male': '男',
            'registration.gender_female': '女',
            'registration.gender_nonbinary': '非二元性别',
            'registration.gender_prefernottosay': '不愿透露',
            'registration.gender_other': '其他',
            'registration.education': '最高教育水平',
            'registration.education_select': '选择教育水平',
            'registration.education_highschool': '高中',
            'registration.education_associate': '副学士学位',
            'registration.education_bachelor': '学士学位',
            'registration.education_master': '硕士学位',
            'registration.education_doctorate': '博士学位',
            'registration.education_other': '其他',
            'registration.investment_years': '投资经验年限',
            'registration.investment_help': '如果没有投资经验，请输入0。',
            'registration.risk_assessment': '风险偏好评估',
            'registration.risk_question': '您如何描述自己承担财务风险的意愿？',
            'registration.risk_averse': '非常风险规避',
            'registration.risk_seeking': '非常风险寻求',
            'registration.risk_cautious': '极其谨慎',
            'registration.risk_moderate': '中等',
            'registration.risk_bold': '极其大胆',
            'registration.esg_assessment': 'ESG偏好评估',
            'registration.esg_question': '在您的投资决策中，环境、社会和治理（ESG）因素的重要性如何？',
            'registration.esg_notimportant': '不重要',
            'registration.esg_veryimportant': '非常重要',
            'registration.esg_never': '从不考虑ESG',
            'registration.esg_sometimes': '有时考虑',
            'registration.esg_always': '总是优先考虑ESG',
            'registration.group_assignment': '随机分组分配',
            'registration.group_message': '注册后，您将被随机分配到五个实验组之一。这个分配决定了您在实验中将要阅读的新闻文章类型。',
            'registration.back_welcome': '返回欢迎页面',
            'registration.complete': '完成注册并开始实验',
            'registration.validation_required': '此字段为必填项',
            'registration.validation_email': '请输入有效的电子邮件地址',
            'registration.validation_min': '值必须至少为{{min}}',
            'registration.validation_max': '值最多为{{max}}',
            'registration.validation_risk': '请选择风险偏好评分。',
            'registration.validation_esg': '请选择ESG偏好评分。',
            'registration.validation_all': '请正确填写所有必填字段。',
            'registration.success': '注册成功',
            'registration.success_message': '您已被分配到{{group}}组。请继续新闻阅读任务。',
            'registration.error': '注册失败',
            'registration.error_message': '注册失败，请重试。',
            'registration.error_unexpected': '发生意外错误，请重试。',
            'registration.processing': '处理中...',

            // Navigation
            'nav.home': '首页',
            'nav.profile': '个人资料',
            'nav.news': '新闻',
            'nav.predictions': '预测',
            'nav.results': '结果',

            // News reading task
            'news.title': '新闻阅读任务',
            'news.subtitle': '请仔细阅读以下文章。您有有限的时间阅读并回答问题。',
            'news.loading_articles': '加载新闻文章中...',
            'news.credibility_title': '文章可信度评分',
            'news.credibility_question': '您认为这篇文章的可信度如何？',
            'news.credibility_not_credible': '完全不可信',
            'news.credibility_extremely_credible': '非常可信',
            'news.credibility_completely_unreliable': '完全不可靠',
            'news.credibility_moderately_credible': '中等可信度',
            'news.credibility_highly_trustworthy': '高度可信赖',
            'news.next_article': '下一篇文章',
            'news.complete_title': '新闻阅读任务完成！',
            'news.complete_message': '您已完成所有新闻文章。请继续进行预测和交易任务。',
            'news.proceed_prediction': '继续进行预测任务',
            'news.attention_title': '注意力追踪',
            'news.attention_message': '您的阅读时间正在被追踪作为注意力衡量指标。请在时间限制内仔细阅读每篇文章。',
            'news.session_error': '会话错误',
            'news.user_not_found': '未找到用户会话。请重新开始实验。',
            'news.loading_error': '加载新闻文章失败，请重试。',
            'news.no_articles': '您的实验组没有可用的文章。',
            'news.unexpected_error': '加载文章时发生意外错误。',
            'news.article_error': '文章错误',
            'news.article_load_error': '加载文章内容失败。请刷新页面或联系研究人员。',
            'news.reading_progress': '阅读进度',
            'news.progress_message': '完成所有文章以获得基础报酬。',
            'news.articles': '文章',
            'news.time_limit': '时间限制：{{seconds}}秒',
            'news.article_x_of_y': '文章 {{current}} / {{total}}',
            'news.no_content': '此文章无可用内容。',
            'news.time_expired': '时间已到',
            'news.time_expired_message': '时间限制已到。请评估文章可信度并继续。',
            'news.rating_required': '需要评分',
            'news.rating_required_message': '请先评估文章可信度再继续。',
            'news.seconds_remaining': '剩余秒数',
            'news.filler_article': '填充文章',

            // Prediction and trading task
            'prediction.title': '预测与交易决策',
            'prediction.subtitle': '根据您刚刚阅读的文章，进行预测并分配您的虚拟资金。',
            'prediction.loading_article': '加载文章信息中...',
            'prediction.financial_title': '财务预测',
            'prediction.financial_question': '根据新闻文章，您预期公司未来表现如何？',
            'prediction.stock_title': '未来股价',
            'prediction.stock_question': '您预期公司股价在未来一年内表现如何？',
            'prediction.stock_decline': '大幅下跌',
            'prediction.stock_increase': '大幅上涨',
            'prediction.stock_significant_loss': '预期重大损失',
            'prediction.stock_stable': '稳定表现',
            'prediction.stock_major_gains': '预期重大收益',
            'prediction.profit_title': '未来盈利能力',
            'prediction.profit_question': '您预期公司盈利能力在未来一年内如何变化？',
            'prediction.profit_decrease': '大幅下降',
            'prediction.profit_increase': '大幅增长',
            'prediction.profit_major_decline': '利润大幅下降',
            'prediction.profit_steady': '稳定盈利能力',
            'prediction.profit_substantial_growth': '利润大幅增长',
            'prediction.trading_title': '交易决策',
            'prediction.trading_question': '您拥有<strong>${{capital}}</strong>虚拟资金。您会将多少百分比投资于该公司股票？',
            'prediction.slider_no_investment': '0%（不投资）',
            'prediction.slider_all_in': '100%（全押）',
            'prediction.amount_to_invest': '投资金额：',
            'prediction.remaining_capital': '剩余资金：',
            'prediction.performance_bonus_title': '绩效奖金',
            'prediction.performance_bonus_message': '您的预测准确性和投资组合表现将决定您在实验结束时的奖金支付。',
            'prediction.skip_article': '跳过此文章',
            'prediction.submit': '提交预测并继续',
            'prediction.complete_title': '预测完成！',
            'prediction.complete_message': '您已完成所有预测任务。请继续进行实验后评估。',
            'prediction.proceed_evaluation': '进行评估',
            'prediction.validation_error': '验证错误',
            'prediction.validation_message': '请在提交前完成两个预测评分。',
            'prediction.processing': '处理中...',
            'prediction.submission_success': '预测已提交',
            'prediction.submission_success_message': '您的预测已记录。正在加载下一篇文章...',
            'prediction.submission_failed': '提交失败',
            'prediction.submission_error': '提交错误',
            'prediction.submission_error_message': '发生意外错误，请重试。',

            // Post-experiment evaluation
            'posttest.title': '实验后评估',
            'posttest.subtitle': '请完成以下问卷和评估。',
            'posttest.cognitive_title': '认知溢出评估',
            'posttest.cognitive_question': '您在多大程度上同意以下陈述？',
            'posttest.cognitive_statement': '“良好的ESG表现将带来良好的财务表现。”',
            'posttest.cognitive_disagree': '非常不同意',
            'posttest.cognitive_agree': '非常同意',
            'posttest.cognitive_completely_disagree': '完全不同意',
            'posttest.cognitive_neutral': '中立',
            'posttest.cognitive_completely_agree': '完全同意',
            'posttest.emotional_title': '情绪状态评估',
            'posttest.emotional_question': '您现在感觉如何？请评估您当前的情绪状态。',
            'posttest.positive_title': '积极情绪',
            'posttest.positive_question': '您正在经历积极情绪（如感兴趣、兴奋、热情）的强度如何？',
            'posttest.negative_title': '消极情绪',
            'posttest.negative_question': '您正在经历消极情绪（如苦恼、不安、紧张）的强度如何？',
            'posttest.emotional_not_at_all': '完全没有',
            'posttest.emotional_extremely': '极其强烈',
            'posttest.credibility_title': '总体新闻可信度',
            'posttest.credibility_question': '总体而言，您认为在本次实验中阅读的新闻文章可信度如何？',
            'posttest.credibility_not_credible': '完全不可信',
            'posttest.credibility_extremely_credible': '非常可信',
            'posttest.credibility_completely_unreliable': '完全不可靠',
            'posttest.credibility_moderately_credible': '中等可信度',
            'posttest.credibility_highly_trustworthy': '高度可信赖',
            'posttest.recall_title': '新闻回忆检查',
            'posttest.recall_question': '请回忆您在实验中阅读的主要新闻文章。',
            'posttest.recall_topic_label': '新闻文章的主要主题是什么？',
            'posttest.recall_tone_label': '新闻文章的总体基调是什么？',
            'posttest.recall_manipulation_label': '根据您的回忆，您阅读的文章是否符合您的期望？',
            'posttest.recall_yes': '是的，文章符合我的期望',
            'posttest.recall_no': '不，文章与预期不同',
            'posttest.preference_title': '最终偏好评估',
            'posttest.preference_question': '请在完成实验后评估您当前的偏好。',
            'posttest.risk_post_title': '风险偏好',
            'posttest.risk_post_question': '您现在如何描述自己承担财务风险的意愿？',
            'posttest.risk_averse': '非常风险规避',
            'posttest.risk_seeking': '非常风险寻求',
            'posttest.esg_post_title': 'ESG偏好',
            'posttest.esg_post_question': 'ESG因素在您当前投资决策中的重要性如何？',
            'posttest.esg_not_important': '不重要',
            'posttest.esg_very_important': '非常重要',
            'posttest.attention_title': '注意力检查问题',
            'posttest.attention_question': '请仔细回答这些问题以显示您正在关注。',
            'posttest.attention_check_1_label': '请选择<strong>“非常同意”</strong>以显示您正在关注：',
            'posttest.attention_check_2_label': '请为此问题选择<strong>“完全没有”</strong>：',
            'posttest.attention_options': ['非常不同意', '不同意', '有点不同意', '中立', '有点同意', '同意', '非常同意'],
            'posttest.attention_options_2': ['完全没有', '轻微', '中等', '非常', '极其强烈'],
            'posttest.comments_title': '附加评论',
            'posttest.comments_label': '有关本实验的任何附加评论或反馈？',
            'posttest.comments_placeholder': '可选：分享您对实验的想法、改进建议或遇到的任何困难。',
            'posttest.data_integrity_title': '数据完整性',
            'posttest.data_integrity_message': '您的诚实回答对本研究的有效性至关重要。请认真回答所有问题。',
            'posttest.submit': '完成评估并结束实验',
            'posttest.processing': '处理中...',
            'posttest.evaluation_complete': '评估完成',
            'posttest.evaluation_complete_message': '感谢您完成实验！正在处理您的结果...',
            'posttest.validation_error': '验证错误',
            'posttest.submission_failed': '提交失败',
            'posttest.submission_error': '提交错误',
            'posttest.submission_error_message': '发生意外错误，请重试。',

            // 新闻回忆主题选项
            'posttest.recall_topic_esg': 'ESG（环境、社会、治理）',
            'posttest.recall_topic_financial': '财务绩效',
            'posttest.recall_topic_esg_financial': 'ESG和财务两者',
            'posttest.recall_topic_neutral': '中性/商业新闻',
            'posttest.recall_topic_corporate_culture': '企业文化/其他',
            'posttest.recall_topic_not_sure': '不确定/不记得',

            // 新闻回忆基调选项
            'posttest.recall_tone_positive': '积极/乐观',
            'posttest.recall_tone_neutral': '中性/平衡',
            'posttest.recall_tone_negative': '消极/悲观',
            'posttest.recall_tone_mixed': '混合/多样',
            'posttest.recall_tone_not_sure': '不确定/不记得',

            // 验证字段名称
            'posttest.validation_field_esg_financial_link_rating': 'ESG-财务链接评分',
            'posttest.validation_field_positive_affect_score': '积极情绪评分',
            'posttest.validation_field_negative_affect_score': '消极情绪评分',
            'posttest.validation_field_overall_credibility_rating': '总体可信度评分',
            'posttest.validation_field_risk_preference_post': '实验后风险偏好',
            'posttest.validation_field_esg_preference_post': '实验后ESG偏好',
            'posttest.validation_field_attention_check_1': '注意力检查问题1',
            'posttest.validation_field_attention_check_2': '注意力检查问题2',
            'posttest.validation_error_title': '验证错误',
            'posttest.validation_error_message': '请完成以下必填字段：{fields}',
            'posttest.evaluation_complete_title': '评估完成',
            'posttest.evaluation_complete_message': '感谢您完成实验！正在处理您的结果...',

            // Completion view (incentive calculation)
            'completion.title': '实验完成！',
            'completion.subtitle': '感谢您参与我们的研究。',
            'completion.contribution': '您的贡献',
            'completion.contribution_message': '您已成功完成实验的所有阶段。您的数据将有助于ESG叙事与投资者行为的重要研究。',
            'completion.performance_summary': '绩效总结',
            'completion.calculating_performance': '正在计算您的绩效和奖金...',
            'completion.prediction_accuracy': '预测准确性',
            'completion.prediction_score': '分数（0-100）',
            'completion.portfolio_performance': '投资组合表现',
            'completion.portfolio_score': '分数（0-100）',
            'completion.total_bonus': '总奖金计算',
            'completion.payment_summary': '支付总结',
            'completion.base_pay': '基础报酬：',
            'completion.performance_bonus': '绩效奖金：',
            'completion.total_payment': '总支付：',
            'completion.payment_pending_title': '支付待处理',
            'completion.payment_pending_message': '您的支付将在3-5个工作日内处理。您将收到电子邮件确认。',
            'completion.payment_awarded_title': '支付已发放',
            'completion.payment_awarded_message': '您的支付已成功发放。您将通过首选支付方式收到款项。',
            'completion.next_steps': '后续步骤',
            'completion.next_steps_email': '电子邮件确认：',
            'completion.next_steps_email_desc': '您将收到包含支付详细信息的确认邮件',
            'completion.next_steps_data': '数据下载：',
            'completion.next_steps_data_desc': '研究人员可以下载匿名数据进行分析',
            'completion.next_steps_publication': '研究发表：',
            'completion.next_steps_publication_desc': '结果将发表在学术期刊上（所有数据匿名）',
            'completion.export_data': '导出我的数据（CSV）',
            'completion.return_home': '返回首页',
            'completion.processing_payment': '处理支付中...',
            'completion.payment_awarded_alert': '支付已发放',
            'completion.payment_awarded_alert_message': '您的支付已成功处理。您将很快收到电子邮件确认。',
            'completion.payment_error': '支付错误',
            'completion.payment_error_message': '处理支付失败。请联系研究人员寻求帮助。',
            'completion.data_exported': '数据已导出',
            'completion.data_exported_message': '您的实验数据已下载为CSV文件。',
            'completion.export_error': '导出错误',
            'completion.export_error_message': '导出数据失败，请重试。',
            'completion.calculation_error_title': '计算错误',
            'completion.calculation_error_message': '计算绩效分数失败。您的基础报酬仍将发放。',
            'completion.experiment_group': '实验组：',
            'completion.unknown_group': '未知',
            'completion.contact_message': '有关您的支付或本研究的问题，请联系：',
            'completion.study_id': '研究ID：{{study_id}} • 完成日期：{{date}}',

            // Completed view (final thank you)
            'completed.title': '感谢您的参与！',
            'completed.subtitle': '您对本研究的贡献深表感谢。',
            'completed.experiment_successful': '实验成功完成',
            'completed.experiment_successful_message': '您已成功完成ESG叙事溢出实验。您的回答将有助于我们理解媒体叙事如何影响投资者行为。',
            'completed.what_happens_next': '接下来会发生什么？',
            'completed.payment_confirmation': '支付确认',
            'completed.payment_confirmation_desc': '您将在3-5个工作日内收到确认支付详情的电子邮件。',
            'completed.research_analysis': '研究分析',
            'completed.research_analysis_desc': '您的匿名数据将作为我们学术研究的一部分进行分析。',
            'completed.publication': '发表',
            'completed.publication_desc': '结果将发表在学术期刊上。所有数据保持完全匿名。',
            'completed.data_privacy_title': '数据隐私保障',
            'completed.data_privacy_message': '您的个人信息受到保护，永远不会被分享。所有研究数据均被匿名处理，仅用于学术目的。',
            'completed.want_to_learn_more': '想了解更多？',
            'completed.learn_more_message': '如果您对本研究的发现感兴趣或想参与未来研究：',
            'completed.start_new_session': '开始新会话（不同参与者）',
            'completed.close_experiment': '关闭实验',
            'completed.close_confirm': '确定要关闭实验吗？',
            'completed.footer': '行为金融学研究小组 • 金融系 • 大学<br>研究ID：ESG-EXP-2024 • IRB批准号：#2024-12345',

            // Error view
            'error.general_title': '错误',
            'error.general_message': '发生意外错误。',
            'error.page_not_found': '页面未找到',
            'error.page_not_found_message': '您查找的页面不存在。',
            'error.session_expired': '会话已过期',
            'error.session_expired_message': '您的会话已过期。请开始新的实验。',
            'error.return_home': '返回首页',
            'error.retry': '重试',
            'error.oops_title': '哎呀！出错了',
            'error.oops_subtitle': '处理您的请求时遇到错误。',
            'error.technical_error': '技术错误',
            'error.technical_error_message': '实验应用程序似乎出现了问题。这可能是由于网络问题、服务器问题或浏览器兼容性导致的。',
            'error.troubleshooting_steps': '故障排除步骤',
            'error.step1_title': '检查您的互联网连接',
            'error.step1_desc': '确保您有稳定的互联网连接。',
            'error.step2_title': '刷新页面',
            'error.step2_desc': '尝试刷新浏览器页面（F5或Ctrl+R）。',
            'error.step3_title': '清除浏览器缓存',
            'error.step3_desc': '清除浏览器的缓存和Cookie，然后重试。',
            'error.step4_title': '尝试不同的浏览器',
            'error.step4_desc': '如果您使用的是其他浏览器，请切换到Chrome、Firefox或Edge。',
            'error.step5_title': '联系支持',
            'error.step5_desc': '如果问题仍然存在，请联系研究团队。',
            'error.data_preservation_title': '数据保存',
            'error.data_preservation_message': '您的进度已本地保存。您可以安全地刷新或关闭页面，稍后返回继续。',
            'error.refresh_page': '刷新页面',
            'error.error_code_message': '如果联系支持，请提供此错误代码。',

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
     * @param {string} prefix - Optional prefix for unique IDs (e.g., 'welcome-', 'header-')
     * @returns {string} HTML for language selector
     */
    getLanguageSelectorHTML(prefix = '') {
        const languages = this.getAvailableLanguages();
        const currentLang = this.getCurrentLanguage();
        const toggleId = `${prefix}language-toggle`;
        const dropdownId = `${prefix}language-dropdown`;

        return `
            <div class="language-selector">
                <button class="btn btn-secondary btn-sm language-toggle" id="${toggleId}">
                    <i class="fas fa-globe"></i>
                    ${this.t('language.select')}
                </button>
                <div class="language-dropdown" id="${dropdownId}" style="display: none;">
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
     * @param {string} prefix - Optional prefix for unique IDs (e.g., 'welcome-', 'header-')
     */
    initLanguageSelector(prefix = '') {
        const toggleId = `${prefix}language-toggle`;
        const dropdownId = `${prefix}language-dropdown`;
        const toggle = document.getElementById(toggleId);
        const dropdown = document.getElementById(dropdownId);

        if (toggle && dropdown) {
            // Toggle dropdown
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Language selection - use event delegation for dynamic elements
            dropdown.addEventListener('click', (e) => {
                const option = e.target.closest('.language-option');
                if (option) {
                    const lang = option.getAttribute('data-lang');
                    this.setLanguage(lang);
                    dropdown.style.display = 'none';

                    // Dispatch event for language change
                    document.dispatchEvent(new CustomEvent('languagechange', {
                        detail: { language: lang }
                    }));
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && e.target !== toggle) {
                    dropdown.style.display = 'none';
                }
            });
        }
    }
}

// Create singleton instance
export const languageService = new LanguageService();