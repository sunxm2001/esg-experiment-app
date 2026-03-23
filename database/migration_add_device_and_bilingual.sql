-- Database Migration Script
-- Adds device information fields and bilingual support for news articles
-- Run this script on existing databases to add the new columns

-- 1. Add device information columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS device_type VARCHAR(20) DEFAULT 'desktop',
ADD COLUMN IF NOT EXISTS device_platform VARCHAR(50),
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS screen_width INTEGER,
ADD COLUMN IF NOT EXISTS screen_height INTEGER,
ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en';

-- 2. Add Chinese translation columns and updated_at field to news_articles table
ALTER TABLE news_articles
ADD COLUMN IF NOT EXISTS title_zh VARCHAR(500),
ADD COLUMN IF NOT EXISTS content_zh TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- 3. Update existing records with default values if needed
-- Users: set language_preference based on existing data or default
UPDATE users
SET language_preference = 'en'
WHERE language_preference IS NULL;

-- News articles: initialize Chinese fields as NULL (will be populated by seed data)
-- Note: After running this migration, you should re-run the seed script to populate Chinese translations

-- 4. Create indexes for new columns (optional)
CREATE INDEX IF NOT EXISTS idx_users_device ON users(device_type, device_platform);
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language_preference);

-- 5. Verify migration
SELECT
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(device_type) as device_type_count,
    COUNT(language_preference) as language_preference_count
FROM users
UNION ALL
SELECT
    'news_articles' as table_name,
    COUNT(*) as total_records,
    COUNT(title_zh) as title_zh_count,
    COUNT(content_zh) as content_zh_count
FROM news_articles;

-- Migration completed successfully if all counts match expectations