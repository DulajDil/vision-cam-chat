import express, { Request, Response, ErrorRequestHandler } from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import OpenAI from 'openai';
import type {
    StoredImage,
    ValidatedImage,
    AIProvider,
    AnalyzeResponse,
    AskRequestBody,
    AskResponse,
    BedrockStatusResponse,
    HealthResponse,
    ErrorResponse,
    RequestWithFile
} from './types/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || '3000';

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// ========================================
// IN-MEMORY IMAGE STORAGE
// ========================================

let latestImage: StoredImage = {
    base64: null,
    mimeType: null,
    timestamp: null
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Store image in memory as base64
 */
function storeImage(buffer: Buffer, mimeType: string): void {
    latestImage = {
        base64: buffer.toString('base64'),
        mimeType: mimeType,
        timestamp: new Date().toISOString()
    };
}

/**
 * Get the latest stored image
 */
function getLatestImage(): ValidatedImage {
    if (!latestImage.base64 || !latestImage.mimeType || !latestImage.timestamp) {
        throw new Error('No image has been uploaded yet');
    }
    return {
        base64: latestImage.base64,
        mimeType: latestImage.mimeType,
        timestamp: latestImage.timestamp
    };
}

/**
 * Call OpenAI vision API
 */
async function callOpenAI(
    apiKey: string | undefined,
    prompt: string,
    imageBase64: string,
    mimeType: string
): Promise<string> {
    if (!apiKey) {
        throw new Error('OpenAI API key required. Provide it via X-Api-Key header.');
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:${mimeType};base64,${imageBase64}`,
                            detail: 'low'
                        }
                    }
                ]
            }
        ],
        max_tokens: 300
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response from OpenAI');
    }

    return content;
}

/**
 * Call AWS Bedrock (Claude) vision API
 */
async function callBedrock(
    prompt: string,
    imageBase64: string,
    mimeType: string
): Promise<string> {
    const region = process.env['AWS_REGION'] || 'ap-southeast-2';
    const modelId = process.env['BEDROCK_MODEL_ID'] || 'anthropic.claude-3-haiku-20240307-v1:0';

    const client = new BedrockRuntimeClient({ region });

    const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 300,
        messages: [
            {
                role: 'user' as const,
                content: [
                    {
                        type: 'image' as const,
                        source: {
                            type: 'base64' as const,
                            media_type: mimeType,
                            data: imageBase64
                        }
                    },
                    {
                        type: 'text' as const,
                        text: prompt
                    }
                ]
            }
        ]
    };

    const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload)
    });

    const response = await client.send(command);

    if (!response.body) {
        throw new Error('No response body from Bedrock');
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as {
        content: Array<{ text: string }>;
    };

    const text = responseBody.content[0]?.text;
    if (!text) {
        throw new Error('No text content in Bedrock response');
    }

    return text;
}

/**
 * Validate Bedrock configuration without invoking model
 */
async function validateBedrockConfig(): Promise<BedrockStatusResponse> {
    const region = process.env['AWS_REGION'] || 'ap-southeast-2';
    const modelId = process.env['BEDROCK_MODEL_ID'] || 'anthropic.claude-3-haiku-20240307-v1:0';

    try {
        // Just create client to validate credentials and region
        new BedrockRuntimeClient({ region });

        // Return success without actually invoking the model (to avoid cost)
        return {
            ok: true,
            message: `Bedrock initialized successfully in region ${region} with model ${modelId}`
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            ok: false,
            message: `Bedrock initialization failed: ${errorMessage}`
        };
    }
}

// ========================================
// ROUTES
// ========================================

/**
 * Health check endpoint
 */
app.get('/health', (_req: Request, res: Response<HealthResponse>) => {
    res.json({ ok: true });
});

/**
 * Bedrock status check endpoint
 */
app.get('/bedrock/status', async (_req: Request, res: Response<BedrockStatusResponse>) => {
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

/**
 * Analyze endpoint - accepts image and returns caption
 * POST /analyze
 * multipart/form-data with 'frame' field
 * Optional 'provider' field (openai or bedrock)
 */
app.post('/analyze', upload.single('frame'), async (req: RequestWithFile, res: Response<AnalyzeResponse | ErrorResponse>) => {
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
            if (!latestImage.base64 || !latestImage.mimeType) {
                return res.status(500).json({
                    error: 'Image not properly stored'
                });
            }
            caption = await callOpenAI(apiKey, prompt, latestImage.base64, latestImage.mimeType);
        } else {
            if (!latestImage.base64 || !latestImage.mimeType) {
                return res.status(500).json({
                    error: 'Image not properly stored'
                });
            }
            caption = await callBedrock(prompt, latestImage.base64, latestImage.mimeType);
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

/**
 * Ask endpoint - answers questions about the latest stored image
 * POST /ask
 * JSON body: { provider: 'openai' | 'bedrock', question: string }
 */
app.post('/ask', async (req: Request<{}, AskResponse | ErrorResponse, AskRequestBody>, res: Response<AskResponse | ErrorResponse>) => {
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

