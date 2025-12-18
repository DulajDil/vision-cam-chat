/**
 * Ask Routes
 * Question answering endpoints
 */

import { Router, Request, Response } from 'express';
import type { AskRequestBody, AskResponse, ErrorResponse } from '../types/index.js';
import { getLatestImage } from '../services/image-storage.service.js';
import { callOpenAI } from '../services/openai.service.js';
import { callBedrock } from '../services/bedrock.service.js';

const router = Router();

/**
 * POST /ask
 * Ask endpoint - answers questions about the latest stored image
 * JSON body: { provider: 'openai' | 'bedrock', question: string }
 */
router.post('/ask', async (req: Request<{}, AskResponse | ErrorResponse, AskRequestBody>, res: Response<AskResponse | ErrorResponse>) => {
    try {
        // Validate request body
        const { provider, question } = req.body;

        if (!question || typeof question !== 'string' || question.trim() === '') {
            return res.status(400).json({
                error: 'Missing or invalid question. Please provide a question string.'
            });
        }

        if (!provider || !['openai', 'bedrock'].includes(provider)) {
            return res.status(400).json({
                error: 'Invalid provider. Must be "openai" or "bedrock".'
            });
        }

        // Get latest image
        const image = getLatestImage();

        // Create prompt with constraints
        const prompt = `${question}\n\nAnswer ONLY from what you can see in the image. If unsure, say you're unsure and suggest how to improve the photo (move closer, reduce glare).`;

        let answer: string;

        if (provider === 'openai') {
            const apiKey = req.headers['x-api-key'] as string | undefined;
            answer = await callOpenAI(apiKey, prompt, image.base64, image.mimeType);
        } else {
            answer = await callBedrock(prompt, image.base64, image.mimeType);
        }

        return res.json({
            provider,
            answer
        });

    } catch (error) {
        console.error('Error in /ask:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process question';
        return res.status(500).json({
            error: errorMessage
        });
    }
});

export default router;

