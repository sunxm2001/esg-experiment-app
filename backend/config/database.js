const { Pool } = require('pg');
require('dotenv').config();

// Support for DATABASE_URL environment variable (used by cloud platforms)
let poolConfig = {
  max: 20, // maximum number of clients in the pool (sufficient for 30 concurrent users)
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // how long to wait for a connection from the pool
  allowExitOnIdle: true,
  maxUses: 7500, // close and replace a connection after this many uses to prevent memory leaks
};

// If DATABASE_URL is provided (e.g., from Railway, Render, Supabase), use it
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  // Add SSL requirement for production databases
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL.includes('sslmode=require')) {
    poolConfig.ssl = {
      rejectUnauthorized: false // Required for some cloud databases
    };
  }
} else {
  // Use individual environment variables for local development
  poolConfig = {
    ...poolConfig,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'esg_experiment',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  };
}

// Create connection pool
const pool = new Pool(poolConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process, just log the error
  // process.exit(-1);
});

// Connection pool monitoring
let poolStats = {
  totalConnections: 0,
  connectionErrors: 0,
  queryCount: 0,
  lastReset: new Date()
};

pool.on('connect', (client) => {
  poolStats.totalConnections++;
  if (process.env.NODE_ENV === 'development') {
    console.log(`Database connection established. Total connections: ${poolStats.totalConnections}`);
  }
});

pool.on('remove', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Database connection removed from pool');
  }
});

// Monitor pool health periodically (every 5 minutes)
setInterval(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Database pool statistics:', {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
      stats: poolStats
    });
  }

  // Reset stats daily
  if (new Date() - poolStats.lastReset > 24 * 60 * 60 * 1000) {
    poolStats = {
      totalConnections: 0,
      connectionErrors: 0,
      queryCount: 0,
      lastReset: new Date()
    };
  }
}, 5 * 60 * 1000);

// Enhanced query function with timeout and statistics (backward compatible)
const query = async (text, params, timeout = 10000) => {
  poolStats.queryCount++;

  const startTime = Date.now();

  // Use a client from the pool with timeout setting
  const client = await pool.connect();
  try {
    // Set statement timeout for this query (in milliseconds)
    await client.query(`SET statement_timeout = ${timeout}`);
    const result = await client.query(text, params);
    const duration = Date.now() - startTime;

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 200));
    }

    return result;
  } finally {
    client.release();
  }
};

// Simple query function for backward compatibility (no timeout)
const simpleQuery = (text, params) => pool.query(text, params);

// Default export maintains backward compatibility
// Existing code using db.query() will work with enhanced timeout support
module.exports = {
  query: (text, params) => query(text, params, 10000), // Default 10 second timeout
  simpleQuery,
  pool,
  getPoolStats: () => ({ ...poolStats, pool: {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  }})
};