-- ESG Experiment Database Schema
-- PostgreSQL

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table: stores participant information and pre-experiment data
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Demographic information
  age INTEGER,
  gender VARCHAR(50),
  education VARCHAR(100),
  investment_years INTEGER,

  -- Risk preference (from Holt-Laury task)
  risk_preference_score DECIMAL(5,2),

  -- ESG preference (pre-experiment)
  esg_preference_pre DECIMAL(5,2),

  -- Experiment group assignment (G1-G5)
  experiment_group VARCHAR(10) NOT NULL,
  -- For G4 subgroup: 'single' (G4a) or 'split' (G4b)
  g4_subgroup VARCHAR(10),

  -- Completion status
  completed_pretest BOOLEAN DEFAULT FALSE,
  completed_news BOOLEAN DEFAULT FALSE,
  completed_prediction BOOLEAN DEFAULT FALSE,
  completed_posttest BOOLEAN DEFAULT FALSE,
  completed_all BOOLEAN DEFAULT FALSE,

  -- Incentive
  base_pay_awarded DECIMAL(10,2) DEFAULT 0,
  performance_bonus DECIMAL(10,2) DEFAULT 0,
  total_payment DECIMAL(10,2) DEFAULT 0,

  -- Device information (for data analysis)
  device_type VARCHAR(20) DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
  device_platform VARCHAR(50), -- 'Windows', 'macOS', 'Linux', 'iOS', 'Android'
  user_agent TEXT, -- Full user agent string
  screen_width INTEGER,
  screen_height INTEGER,
  language_preference VARCHAR(10) DEFAULT 'en', -- User's language preference 'en' or 'zh'

  -- Tracking
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News articles table: stores all news articles used in the experiment
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  title_zh VARCHAR(500), -- Chinese title
  content_zh TEXT, -- Chinese content

  -- Article type: 'neutral', 'financial', 'esg', 'bundled', 'placebo'
  article_type VARCHAR(50) NOT NULL,

  -- For bundled articles: 'single' or 'split' (only for G4)
  bundle_type VARCHAR(50),

  -- Group assignment: which experiment group should see this article
  target_group VARCHAR(10),

  -- Ordering within the group (for sequencing)
  display_order INTEGER,

  -- Time limit for reading (seconds)
  time_limit_seconds INTEGER DEFAULT 60,

  -- Is filler article (unrelated content)
  is_filler BOOLEAN DEFAULT FALSE,

  -- True future performance ratings (for bonus calculation)
  true_future_stock_price_rating INTEGER CHECK (true_future_stock_price_rating >= 1 AND true_future_stock_price_rating <= 7),
  true_future_profitability_rating INTEGER CHECK (true_future_profitability_rating >= 1 AND true_future_profitability_rating <= 7),

  -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User reading sessions: tracks attention/time spent on each article
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,

  -- Timestamps
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,

  -- Duration in seconds
  duration_seconds INTEGER,

  -- Whether the article was completed within time limit
  completed_within_limit BOOLEAN,

  -- User's credibility rating for this article (1-7)
  credibility_rating INTEGER,

  -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Predictions table: stores user predictions after reading news
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,

  -- 7-point Likert scale ratings
  future_stock_price_rating INTEGER CHECK (future_stock_price_rating >= 1 AND future_stock_price_rating <= 7),
  future_profitability_rating INTEGER CHECK (future_profitability_rating >= 1 AND future_profitability_rating <= 7),

  -- Virtual capital allocation (percentage 0-100)
  capital_allocation_percentage DECIMAL(5,2) CHECK (capital_allocation_percentage >= 0 AND capital_allocation_percentage <= 100),

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Post-experiment evaluations
CREATE TABLE post_experiment_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Cognitive spillover (EFCI proxy): agreement with statement
  -- "良好ESG表现将带来良好财务表现"
  esg_financial_link_rating INTEGER CHECK (esg_financial_link_rating >= 1 AND esg_financial_link_rating <= 7),

  -- Emotional state (simplified PANAS)
  positive_affect_score INTEGER CHECK (positive_affect_score >= 1 AND positive_affect_score <= 5),
  negative_affect_score INTEGER CHECK (negative_affect_score >= 1 AND negative_affect_score <= 5),

  -- News credibility (overall)
  overall_credibility_rating INTEGER CHECK (overall_credibility_rating >= 1 AND overall_credibility_rating <= 7),

  -- Manipulation check: recall of news topic and tone
  recalled_news_topic VARCHAR(100),
  recalled_news_tone VARCHAR(50),
  passed_manipulation_check BOOLEAN,

  -- Post-experiment retest
  esg_preference_post DECIMAL(5,2),
  risk_preference_post DECIMAL(5,2),

  -- Additional comments
  comments TEXT,

  -- Quality control metrics (JSON format)
  quality_metrics JSONB DEFAULT '{}'::jsonb,

  -- Attention check scores
  attention_check_score DECIMAL(5,2) DEFAULT 0,

  -- Data quality flags
  completion_time_seconds INTEGER,
  straightlining_detected BOOLEAN DEFAULT FALSE,
  inconsistent_responses BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance tracking for incentive calculation
CREATE TABLE performance_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Prediction accuracy metrics (to be calculated)
  prediction_accuracy_score DECIMAL(5,2),

  -- Portfolio performance (simulated)
  portfolio_performance_score DECIMAL(5,2),

  -- Final bonus calculation
  bonus_calculated DECIMAL(10,2),
  bonus_awarded BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for important events
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_group ON users(experiment_group);
CREATE INDEX idx_users_completion ON users(completed_all);
CREATE INDEX idx_reading_sessions_user ON reading_sessions(user_id);
CREATE INDEX idx_reading_sessions_article ON reading_sessions(article_id);
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_news_articles_type ON news_articles(article_type);
CREATE INDEX idx_news_articles_group ON news_articles(target_group);