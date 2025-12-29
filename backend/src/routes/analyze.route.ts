/**
 * Analyze Routes
 * Image analysis endpoints
 */

import { Router, Response } from 'express';
import type { RequestWithFile, AnalyzeResponse, ErrorResponse, AIProvider } from '../types/index.js';
import { upload } from '../config/multer.config.js';
import { storeImage } from '../services/image-storage.service.js';
import { callOpenAI } from '../services/openai.service.js';
import { callBedrock } from '../services/bedrock.service.js';

const router = Router();

/**
 * POST /analyze
 * Analyze endpoint - accepts image and returns caption
 * multipart/form-data with 'frame' field
 * Optional 'provider' field (openai or bedrock)
 */
router.post('/analyze', upload.single('frame'), async (req: RequestWithFile, res: Response<AnalyzeResponse | ErrorResponse>) => {
    try {
        // Validate image upload
        if (!req.file) {
            return res.status(400).json({
                error: 'Missing image. Please provide an image in the "frame" field.'
            });
        }

        // Store image in memory
        storeImage(req.file.buffer, req.file.mimetype);

        // Get provider (default to bedrock)
        const provider = (req.body.provider || 'bedrock') as AIProvider;

        if (!['openai', 'bedrock'].includes(provider)) {
            return res.status(400).json({
                error: 'Invalid provider. Must be "openai" or "bedrock".'
            });
        }

        // Create prompt for analysis
        const prompt = 'Describe what you see in this image in 1-2 sentences. Answer ONLY from what you can see. If unsure, say you\'re unsure and suggest how to improve the photo (move closer, reduce glare).';

        let caption: string;

        if (provider === 'openai') {
            const apiKey = req.headers['x-api-key'] as string | undefined;
            caption = await callOpenAI(apiKey, prompt, req.file.buffer.toString('base64'), req.file.mimetype);
        } else {
            caption = await callBedrock(prompt, req.file.buffer.toString('base64'), req.file.mimetype);
        }

        return res.json({
            provider,
            caption
        });

    } catch (error) {
        console.error('Error in /analyze:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image';
        return res.status(500).json({
            error: errorMessage
        });
    }
});

export default router;

