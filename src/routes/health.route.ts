/**
 * Health Routes
 * Health check and status endpoints
 */

import { Router, Request, Response } from 'express';
import type { HealthResponse, BedrockStatusResponse } from '../types/index.js';
import { validateBedrockConfig } from '../services/bedrock.service.js';

const router = Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response<HealthResponse>) => {
    res.json({ ok: true });
});

/**
 * GET /bedrock/status
 * Bedrock status check endpoint
 */
router.get('/bedrock/status', async (_req: Request, res: Response<BedrockStatusResponse>) => {
    try {
        const status = await validateBedrockConfig();
        res.json(status);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            ok: false,
            message: errorMessage
        });
    }
});

export default router;

