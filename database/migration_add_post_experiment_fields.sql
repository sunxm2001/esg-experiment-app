-- Database Migration Script
-- Adds missing quality control fields to post_experiment_evaluations table
-- These fields are referenced in the PostExperiment model but missing from existing databases

-- 1. Add quality_metrics column (JSONB for storing quality control data)
ALTER TABLE post_experiment_evaluations
ADD COLUMN IF NOT EXISTS quality_metrics JSONB DEFAULT '{}'::jsonb;

-- 2. Add attention_check_score column
ALTER TABLE post_experiment_evaluations
ADD COLUMN IF NOT EXISTS attention_check_score DECIMAL(5,2) DEFAULT 0;

-- 3. Add completion_time_seconds column
ALTER TABLE post_experiment_evaluations
ADD COLUMN IF NOT EXISTS completion_time_seconds INTEGER;

-- 4. Add straightlining_detected column
ALTER TABLE post_experiment_evaluations
ADD COLUMN IF NOT EXISTS straightlining_detected BOOLEAN DEFAULT FALSE;

-- 5. Add inconsistent_responses column
ALTER TABLE post_experiment_evaluations
ADD COLUMN IF NOT EXISTS inconsistent_responses BOOLEAN DEFAULT FALSE;

-- 6. Update existing records with default values
UPDATE post_experiment_evaluations
SET
  quality_metrics = '{}'::jsonb,
  attention_check_score = 0,
  straightlining_detected = FALSE,
  inconsistent_responses = FALSE
WHERE
  quality_metrics IS NULL OR
  attention_check_score IS NULL OR
  straightlining_detected IS NULL OR
  inconsistent_responses IS NULL;

-- 7. Verify migration
SELECT
  'post_experiment_evaluations' as table_name,
  COUNT(*) as total_records,
  COUNT(quality_metrics) as quality_metrics_count,
  COUNT(attention_check_score) as attention_check_score_count,
  COUNT(straightlining_detected) as straightlining_detected_count,
  COUNT(inconsistent_responses) as inconsistent_responses_count,
  COUNT(completion_time_seconds) as completion_time_seconds_count
FROM post_experiment_evaluations;

-- 8. Show table structure after migration
\d post_experiment_evaluations

-- Migration completed successfully if all counts match total_records