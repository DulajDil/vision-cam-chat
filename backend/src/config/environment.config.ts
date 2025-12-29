/**
 * Environment Configuration Validation
 * Validates required environment variables and provides defaults
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
    PORT: string;
    NODE_ENV: string;
    AWS_REGION?: string;
    AWS_PROFILE?: string;
    BEDROCK_MODEL_ID?: string;
}

/**
 * Validate and return environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
    const config: EnvironmentConfig = {
        PORT: process.env['PORT'] || '3000',
        NODE_ENV: process.env['NODE_ENV'] || 'development',
        AWS_REGION: process.env['AWS_REGION'],
        AWS_PROFILE: process.env['AWS_PROFILE'],
        BEDROCK_MODEL_ID: process.env['BEDROCK_MODEL_ID']
    };

    // Validate PORT is a valid number
    const port = parseInt(config.PORT, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`Invalid PORT: ${config.PORT}. Must be between 1 and 65535.`);
    }

    return config;
}

/**
 * Check if Bedrock is configured
 */
export function isBedrockConfigured(): boolean {
    return !!(process.env['AWS_REGION'] && process.env['BEDROCK_MODEL_ID']);
}

/**
 * Get configuration summary for logging
 */
export function getConfigSummary(): string {
    const config = getEnvironmentConfig();
    return `
Environment: ${config.NODE_ENV}
Port: ${config.PORT}
Bedrock Configured: ${isBedrockConfigured()}
AWS Region: ${config.AWS_REGION || 'Not configured'}
    `.trim();
}

