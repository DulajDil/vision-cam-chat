/**
 * Vision Cam Chat Server
 * Main Express application entry point
 */

import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import healthRoutes from './routes/health.route.js';
import analyzeRoutes from './routes/analyze.route.js';
import askRoutes from './routes/ask.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || '3000';

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ========================================
// ROUTES
// ========================================

app.use(healthRoutes);
app.use(analyzeRoutes);
app.use(askRoutes);

// ========================================
// ERROR HANDLING
// ========================================

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
        error: errorMessage
    });
};

app.use(errorHandler);

// ========================================
// START SERVER
// ========================================

app.listen(parseInt(PORT), () => {
    console.log(`🚀 Vision Cam Chat server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 Bedrock status: http://localhost:${PORT}/bedrock/status`);
    console.log(`📍 Analyze: POST http://localhost:${PORT}/analyze`);
    console.log(`📍 Ask: POST http://localhost:${PORT}/ask`);
});
