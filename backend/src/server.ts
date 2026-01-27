/**
 * Vision Cam Chat Server
 * Main Express application entry point
 */

import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { getEnvironmentConfig, getConfigSummary } from './config/environment.config.js';

// Import routes
import healthRoutes from './routes/health.route.js';
import analyzeRoutes from './routes/analyze.route.js';
import askRoutes from './routes/ask.route.js';

// Validate environment configuration
const config = getEnvironmentConfig();

const app = express();
const PORT = config.PORT;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging middleware (development only)
if (config.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// ========================================
// ROUTES
// ========================================

app.use(healthRoutes);
app.use(analyzeRoutes);
app.use(askRoutes);

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// Global error handler
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error('Unhandled error:', err);

    // Don't leak error details in production
    const message = config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error';

    res.status(500).json({
        error: message
    });
};

app.use(errorHandler);

// ========================================
// START SERVER
// ========================================

app.listen(parseInt(PORT), () => {
    console.log('='.repeat(50));
    console.log('Vision Cam Chat Server');
    console.log('='.repeat(50));
    console.log(getConfigSummary());
    console.log('='.repeat(50));
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Bedrock status: http://localhost:${PORT}/bedrock/status`);
    console.log(`Analyze: POST http://localhost:${PORT}/analyze`);
    console.log(`Ask: POST http://localhost:${PORT}/ask`);
    console.log('='.repeat(50));
});
