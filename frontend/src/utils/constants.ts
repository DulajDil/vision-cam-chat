/**
 * Application Constants
 */

import type { AIProvider, WebcamConfig, ImageConfig } from '../types/index.js';

export const API_BASE_URL: string = 'http://localhost:3000';

export const PROVIDERS: Record<string, AIProvider> = {
    BEDROCK: 'bedrock',
    OPENAI: 'openai'
};

export const PROVIDER_NAMES: Record<AIProvider, string> = {
    bedrock: 'AWS Bedrock (Claude)',
    openai: 'OpenAI (GPT-4o-mini)'
};

export const STATUS_TYPES = {
    SUCCESS: 'success' as const,
    ERROR: 'error' as const,
    INFO: 'info' as const
};

export const WEBCAM_CONFIG: WebcamConfig = {
    video: {
        width: 640,
        height: 480
    }
};

export const IMAGE_CONFIG: ImageConfig = {
    format: 'image/jpeg',
    quality: 0.95
};

