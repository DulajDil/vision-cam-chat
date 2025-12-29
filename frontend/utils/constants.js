/**
 * Application Constants
 */

export const API_BASE_URL = 'http://localhost:3000';

export const PROVIDERS = {
    BEDROCK: 'bedrock',
    OPENAI: 'openai'
};

export const PROVIDER_NAMES = {
    [PROVIDERS.BEDROCK]: 'AWS Bedrock (Claude)',
    [PROVIDERS.OPENAI]: 'OpenAI (GPT-4o-mini)'
};

export const STATUS_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
};

export const WEBCAM_CONFIG = {
    video: {
        width: 640,
        height: 480
    }
};

export const IMAGE_CONFIG = {
    format: 'image/jpeg',
    quality: 0.95
};

