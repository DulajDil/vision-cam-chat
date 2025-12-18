/**
 * Type definitions for Vision Cam Chat backend
 */

import { Request } from 'express';

/**
 * Stored image data in memory
 */
export interface StoredImage {
    base64: string | null;
    mimeType: string | null;
    timestamp: string | null;
}

/**
 * Validated stored image (all fields non-null)
 */
export interface ValidatedImage {
    base64: string;
    mimeType: string;
    timestamp: string;
}

/**
 * AI Provider types
 */
export type AIProvider = 'openai' | 'bedrock';

/**
 * Analyze endpoint request body
 */
export interface AnalyzeRequestBody {
    provider?: AIProvider;
}

/**
 * Analyze endpoint response
 */
export interface AnalyzeResponse {
    provider: AIProvider;
    caption: string;
}

/**
 * Ask endpoint request body
 */
export interface AskRequestBody {
    provider: AIProvider;
    question: string;
}

/**
 * Ask endpoint response
 */
export interface AskResponse {
    provider: AIProvider;
    answer: string;
}

/**
 * Bedrock status response
 */
export interface BedrockStatusResponse {
    ok: boolean;
    message: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
    ok: boolean;
}

/**
 * Error response
 */
export interface ErrorResponse {
    error: string;
}

/**
 * Extended Express Request with file upload
 */
export interface RequestWithFile extends Request {
    file?: Express.Multer.File;
    body: AnalyzeRequestBody;
}

/**
 * Environment variables
 */
export interface EnvConfig {
    PORT: string;
    AWS_PROFILE?: string;
    AWS_REGION?: string;
    BEDROCK_MODEL_ID?: string;
}

