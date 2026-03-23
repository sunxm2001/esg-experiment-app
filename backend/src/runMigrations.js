#!/usr/bin/env node

/**
 * Database Migration Runner for ESG Experiment App
 * Runs all necessary migrations on startup
 */

const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Read migration SQL from file
function readMigrationSQL() {
  const migrationPath = path.resolve(__dirname, '../../database/migration_add_device_and_bilingual.sql');
  try {
    return fs.readFileSync(migrationPath, 'utf8');
  } catch (error) {
    console.error('Failed to read migration file:', error.message);
    throw error;
  }
}

// Check if a column exists in a table
async function columnExists(tableName, columnName) {
  try {
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2
      ) as exists;
    `;
    const result = await db.query(query, [tableName, columnName]);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking column ${columnName} in ${tableName}:`, error.message);
    return false;
  }
}

// Run the migration
async function runMigration() {
  console.log('Running database migrations...');

  try {
    // Check if migration is needed
    const needsTitleZh = !(await columnExists('news_articles', 'title_zh'));
    const needsContentZh = !(await columnExists('news_articles', 'content_zh'));
    const needsDeviceType = !(await columnExists('users', 'device_type'));

    if (!needsTitleZh && !needsContentZh && !needsDeviceType) {
      console.log('All migration columns already exist. No migration needed.');
      return { migrated: false, message: 'No migration needed' };
    }

    console.log('Migration needed for columns:', {
      title_zh: needsTitleZh,
      content_zh: needsContentZh,
      device_type: needsDeviceType
    });

    // Read and execute migration SQL
    const migrationSQL = readMigrationSQL();
    console.log('Executing migration SQL...');

    // Split SQL into individual statements for better error handling
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    let executedCount = 0;

    for (const statement of statements) {
      try {
        // Skip verification SELECT statements - we'll run our own verification
        if (statement.toUpperCase().includes('SELECT') &&
            (statement.includes('COUNT') || statement.includes('VERIFY'))) {
          console.log('Skipping verification statement...');
          continue;
        }

        console.log(`Executing: ${statement.substring(0, 100)}...`);
        await db.query(statement);
        executedCount++;
      } catch (error) {
        // If it's a "column already exists" error, it's okay
        if (error.code === '42701' || error.message.includes('already exists')) {
          console.log(`Column already exists, skipping: ${error.message.substring(0, 100)}`);
        } else {
          console.error('Migration statement failed:', error.message);
          throw error;
        }
      }
    }

    console.log(`Migration completed. Executed ${executedCount} statements.`);

    // Verify migration was successful
    const finalCheck = {
      title_zh: await columnExists('news_articles', 'title_zh'),
      content_zh: await columnExists('news_articles', 'content_zh'),
      device_type: await columnExists('users', 'device_type')
    };

    console.log('Migration verification:', finalCheck);

    return {
      migrated: true,
      message: `Migration completed. Columns created: ${JSON.stringify(finalCheck)}`,
      columnsCreated: finalCheck
    };

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migrations and then fix translations
async function runFullMigrationAndFix() {
  try {
    console.log('Starting full database initialization...');

    // 1. Run migration
    const migrationResult = await runMigration();

    // 2. Only run Chinese translations fix if title_zh column now exists
    if (migrationResult.columnsCreated && migrationResult.columnsCreated.title_zh) {
      console.log('Running Chinese translations fix...');
      try {
        const { fixChineseTranslations } = require('./fixChineseTranslations');
        const updatedCount = await fixChineseTranslations();
        console.log(`Chinese translations fix completed. Updated ${updatedCount} articles.`);
        return {
          migration: migrationResult,
          translationsFixed: true,
          updatedCount
        };
      } catch (translationError) {
        console.error('Chinese translations fix failed:', translationError.message);
        // Return migration result even if translation fix failed
        return {
          migration: migrationResult,
          translationsFixed: false,
          error: translationError.message
        };
      }
    } else {
      console.log('Skipping Chinese translations fix - title_zh column not created.');
      return {
        migration: migrationResult,
        translationsFixed: false,
        message: 'title_zh column not created'
      };
    }

  } catch (error) {
    console.error('Full database initialization failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runFullMigrationAndFix()
    .then(result => {
      console.log('Database initialization completed successfully:', JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration, runFullMigrationAndFix };