#!/usr/bin/env node

/**
 * Database Initialization Script for ESG Experiment App
 *
 * This script creates all necessary tables in the PostgreSQL database
 * using the schema defined in database/schema.sql.
 *
 * Usage:
 *   node src/init-db.js
 *   DATABASE_URL=postgresql://... node src/init-db.js
 *   npm run init-db
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const SCHEMA_FILE = path.resolve(__dirname, '../../database/schema.sql');
const LOG_PREFIX = '[DB-INIT]';

/**
 * Main initialization function
 */
async function initializeDatabase() {
  console.log(`${LOG_PREFIX} Starting database initialization...`);
  console.log(`${LOG_PREFIX} Schema file: ${SCHEMA_FILE}`);

  // Check if schema file exists
  if (!fs.existsSync(SCHEMA_FILE)) {
    console.error(`${LOG_PREFIX} ERROR: Schema file not found at ${SCHEMA_FILE}`);
    console.error(`${LOG_PREFIX} Please ensure the file exists or check the path.`);
    process.exit(1);
  }

  // Read the schema file
  let schemaSQL;
  try {
    schemaSQL = fs.readFileSync(SCHEMA_FILE, 'utf8');
    console.log(`${LOG_PREFIX} Schema file loaded (${schemaSQL.length} characters)`);
  } catch (error) {
    console.error(`${LOG_PREFIX} ERROR: Failed to read schema file:`, error.message);
    process.exit(1);
  }

  // Remove comments to clean up the SQL (optional, but helpful for logging)
  const cleanSchemaSQL = schemaSQL
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .trim();

  console.log(`${LOG_PREFIX} Cleaned SQL (${cleanSchemaSQL.length} characters)`);

  // Configure database connection
  const config = {};

  // Override with DATABASE_URL if provided (cloud platforms)
  if (process.env.DATABASE_URL) {
    console.log(`${LOG_PREFIX} Using DATABASE_URL from environment`);
    config.connectionString = process.env.DATABASE_URL;

    // Add SSL configuration for production
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL.includes('sslmode=require')) {
      config.ssl = {
        rejectUnauthorized: false
      };
    }
  } else {
    console.log(`${LOG_PREFIX} Using individual database environment variables`);

    // Use current system username as default if DB_USER not set
    const defaultUser = process.env.USER || process.env.USERNAME || 'postgres';

    config.host = process.env.DB_HOST || 'localhost';
    config.port = parseInt(process.env.DB_PORT || '5432', 10);
    config.database = process.env.DB_NAME || 'esg_experiment';
    config.user = process.env.DB_USER || defaultUser;

    // Only include password if it's set (PostgreSQL allows empty password)
    if (process.env.DB_PASSWORD !== undefined) {
      config.password = process.env.DB_PASSWORD;
    }
  }

  console.log(`${LOG_PREFIX} Database configuration:`);
  if (config.connectionString) {
    // Mask password in connection string for security
    const maskedConnectionString = config.connectionString.replace(/:[^:@]+@/, ':****@');
    console.log(`  connectionString: ${maskedConnectionString}`);
  } else {
    console.log(`  host: ${config.host}`);
    console.log(`  port: ${config.port}`);
    console.log(`  database: ${config.database}`);
    console.log(`  user: ${config.user}`);
    console.log(`  password: ${config.password ? '****' : '(not set)'}`);
    console.log(`  ssl: ${config.ssl ? JSON.stringify(config.ssl) : 'not configured'}`);
  }

  // Create database client
  const client = new Client(config);

  try {
    // Connect to database
    await client.connect();
    console.log(`${LOG_PREFIX} Successfully connected to database`);

    // Execute the entire schema SQL as a single query
    console.log(`${LOG_PREFIX} Executing complete schema SQL...`);

    try {
      await client.query(cleanSchemaSQL);
      console.log(`${LOG_PREFIX} ✅ Schema executed successfully!`);
    } catch (executionError) {
      console.error(`${LOG_PREFIX} ✗ ERROR executing schema:`, executionError.message);
      console.error(`${LOG_PREFIX} This might be expected if some tables/indexes already exist.`);
      console.error(`${LOG_PREFIX} Continuing with verification...`);
    }

    // Summary and verification
    console.log('\n' + '='.repeat(60));
    console.log(`${LOG_PREFIX} DATABASE INITIALIZATION SUMMARY`);
    console.log('='.repeat(60));

    // Verify tables were created
    try {
      const tablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);

      const expectedTables = ['users', 'news_articles', 'reading_sessions', 'predictions',
                             'post_experiment_evaluations', 'performance_tracking', 'audit_log'];
      const createdTables = tablesResult.rows.map(row => row.table_name);

      console.log(`${LOG_PREFIX} 📊 Found tables (${createdTables.length}):`);
      createdTables.forEach(table => {
        console.log(`  - ${table}`);
      });

      // Check for missing tables
      const missingTables = expectedTables.filter(table => !createdTables.includes(table));
      if (missingTables.length === 0) {
        console.log(`${LOG_PREFIX} ✅ All expected tables are present!`);
      } else {
        console.log(`${LOG_PREFIX} ⚠️  Missing tables: ${missingTables.join(', ')}`);
        console.log(`${LOG_PREFIX} You may need to check the schema.sql file or run the script again.`);
      }

    } catch (verifyError) {
      console.warn(`${LOG_PREFIX} ⚠️  Could not verify tables: ${verifyError.message}`);
    }

    console.log('='.repeat(60));

  } catch (connectionError) {
    console.error(`${LOG_PREFIX} ERROR: Failed to connect to database:`, connectionError.message);
    console.error(`${LOG_PREFIX} Check your DATABASE_URL or database credentials.`);

    if (config.connectionString) {
      // Mask password in connection string for security
      const maskedConnectionString = config.connectionString.replace(/:[^:@]+@/, ':****@');
      console.error(`${LOG_PREFIX} Current configuration: connectionString=${maskedConnectionString}`);
    } else {
      console.error(`${LOG_PREFIX} Current configuration:`, {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password ? '****' : '(not set)',
        ssl: config.ssl
      });
    }

    console.error(`${LOG_PREFIX} Troubleshooting tips:`);
    console.error(`  1. For Railway: Ensure DATABASE_URL is set in environment variables`);
    console.error(`  2. For local development: Ensure PostgreSQL is running (brew services start postgresql)`);
    console.error(`  3. Check if database exists: createdb ${config.database || 'esg_experiment'}`);
    console.error(`  4. Verify user permissions: psql -U ${config.user} -d ${config.database || 'esg_experiment'}`);

    process.exit(1);
  } finally {
    // Close connection
    try {
      await client.end();
      console.log(`${LOG_PREFIX} Database connection closed`);
    } catch (endError) {
      console.warn(`${LOG_PREFIX} Warning: Error closing connection:`, endError.message);
    }
  }
}

// Handle command line arguments
if (require.main === module) {
  initializeDatabase().catch(error => {
    console.error(`${LOG_PREFIX} Unhandled error:`, error);
    process.exit(1);
  });
}

module.exports = { initializeDatabase };