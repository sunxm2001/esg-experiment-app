const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
  origin: (origin, callback) => {
    // In development, allow all origins for easier testing
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }

    // In production, only allow specified origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple rate limiting for 30 concurrent users
const rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes
const maxRequestsPerWindow = 100; // 100 requests per window per IP
const requestCounts = new Map();

const rateLimitMiddleware = (req, res, next) => {
  // Skip rate limiting for health checks
  if (req.path === '/api/health' || req.path === '/api/health/detailed') {
    return next();
  }

  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - rateLimitWindowMs;

  // Clean up old entries
  if (requestCounts.has(ip)) {
    const requests = requestCounts.get(ip).filter(time => time > windowStart);
    if (requests.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, requests);
    }
  }

  // Get or create request count for this IP
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const requests = requestCounts.get(ip);

  // Check if exceeded limit
  if (requests.length >= maxRequestsPerWindow) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((requests[0] + rateLimitWindowMs - now) / 1000)
    });
  }

  // Add current request
  requests.push(now);

  // Set headers
  res.setHeader('X-RateLimit-Limit', maxRequestsPerWindow);
  res.setHeader('X-RateLimit-Remaining', maxRequestsPerWindow - requests.length);
  res.setHeader('X-RateLimit-Reset', Math.ceil((requests[0] + rateLimitWindowMs) / 1000));

  next();
};

// Apply rate limiting to all API routes
app.use('/api/', rateLimitMiddleware);

// Basic route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ESG Experiment Backend is running' });
});

// Detailed health check with system status
app.get('/api/health/detailed', async (req, res) => {
  try {
    const db = require('../config/database');
    const poolStats = db.getPoolStats ? db.getPoolStats() : {};

    // Check database connection
    let dbStatus = 'unknown';
    try {
      await db.query('SELECT 1 as test');
      dbStatus = 'connected';
    } catch (dbError) {
      dbStatus = 'disconnected';
    }

    const healthInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: dbStatus,
        pool: poolStats.pool || {}
      },
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform
    };

    res.json(healthInfo);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
});

// Serve frontend static files from frontend/public directory
const frontendPublicPath = path.resolve(__dirname, '../../frontend/public');
console.log(`Static files path: ${frontendPublicPath}`);
console.log(`Directory exists: ${fs.existsSync(frontendPublicPath)}`);

app.use(express.static(frontendPublicPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0', // Cache in production
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Add security headers for static files
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
  fallthrough: true  // Allow requests to fall through if file not found
}));

// Also serve src directory for JavaScript modules
const frontendSrcPath = path.resolve(__dirname, '../../frontend/src');
console.log(`JavaScript modules path: ${frontendSrcPath}`);
console.log(`Directory exists: ${fs.existsSync(frontendSrcPath)}`);

app.use('/src', express.static(frontendSrcPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
  etag: true,
  lastModified: true,
  fallthrough: true
}));

// Handle favicon.ico requests (return 204 No Content if no favicon)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Import routes
const userRoutes = require('../routes/userRoutes');
const newsRoutes = require('../routes/newsRoutes');
const predictionRoutes = require('../routes/predictionRoutes');
const postExperimentRoutes = require('../routes/postExperimentRoutes');
const incentiveRoutes = require('../routes/incentiveRoutes');
const dataExportRoutes = require('../routes/dataExportRoutes');
const performanceRoutes = require('../routes/performanceRoutes');
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/post-experiment', postExperimentRoutes);
app.use('/api/incentives', incentiveRoutes);
app.use('/api/export', dataExportRoutes);
app.use('/api/performance', performanceRoutes);

// Fallback to index.html for client-side routing (SPA)
app.get('*', (req, res) => {
  // Don't handle API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'API endpoint not found',
      path: req.path
    });
  }

  // Serve index.html for all other routes
  const indexPath = path.join(frontendPublicPath, 'index.html');

  // Check if index.html exists before sending
  if (!fs.existsSync(indexPath)) {
    console.error(`index.html not found at: ${indexPath}`);
    return res.status(500).json({
      error: 'Frontend application not properly deployed',
      message: `index.html not found at ${indexPath}`,
      timestamp: new Date().toISOString()
    });
  }

  // Send file with error handling
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error sending index.html: ${err.message}`, {
        path: indexPath,
        error: err
      });
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to serve frontend application',
          message: err.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  // Log error with context
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Determine status code based on error type
  let statusCode = err.status || 500;
  let userMessage = err.message || 'Internal server error';
  let errorDetails = {};

  // Classify errors
  if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    userMessage = 'Resource already exists';
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    statusCode = 400;
    userMessage = 'Invalid reference';
  } else if (err.code === '23502') { // PostgreSQL not null violation
    statusCode = 400;
    userMessage = 'Missing required field';
  } else if (err.code === '22P02') { // PostgreSQL invalid input syntax
    statusCode = 400;
    userMessage = 'Invalid input data';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  }

  // Prepare response
  const response = {
    message: userMessage,
    timestamp: new Date().toISOString(),
    path: req.path
  };

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code
    };
  }

  // Add suggestion for common errors
  if (statusCode === 500) {
    response.suggestion = 'Please try again later. If the problem persists, contact support.';
  } else if (statusCode === 429) {
    response.suggestion = 'You have made too many requests. Please wait before trying again.';
  }

  res.status(statusCode).json(response);
});

// Start server
const server = app.listen(port, () => {
  console.log(`ESG Experiment Backend running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
  console.log(`Detailed health: http://localhost:${port}/api/health/detailed`);
});

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    console.log('HTTP server closed.');

    // Close database pool if available
    try {
      const db = require('../config/database');
      if (db.pool && typeof db.pool.end === 'function') {
        db.pool.end(() => {
          console.log('Database pool closed.');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error('Error closing database pool:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle process signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally shutdown here, but often just log
});