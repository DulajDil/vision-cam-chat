/**
 * API Service
 * Handles all backend API communications
 */

import { API_BASE_URL } from '../utils/constants.js';
import type {
    HealthResponse,
    BedrockStatusResponse,
    AnalyzeResponse,
    AskResponse,
    AIProvider
} from '../types/index.js';

/**
 * Check backend health status
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
        throw new Error('Backend not responding');
    }
    return await response.json();
}

/**
 * Check Bedrock status
 */
export async function checkBedrockStatus(): Promise<BedrockStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/bedrock/status`);
    return await response.json();
}

/**
 * Analyze image with AI
 */
export async function analyzeImage(
    imageBlob: Blob,
    provider: AIProvider,
    openaiKey: string | null = null
): Promise<AnalyzeResponse> {
    const formData = new FormData();
    formData.append('frame', imageBlob, 'photo.jpg');
    formData.append('provider', provider);

    const headers: HeadersInit = {};
    if (provider === 'openai' && openaiKey) {
        headers['X-Api-Key'] = openaiKey;
    }

    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: headers,
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
    }

    return data;
}

/**
 * Ask a question about the image
 */
export async function askQuestion(
    question: string,
    provider: AIProvider,
    openaiKey: string | null = null
): Promise<AskResponse> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    if (provider === 'openai' && openaiKey) {
        headers['X-Api-Key'] = openaiKey;
    }

    const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            provider: provider,
            question: question
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
    }

    return data;
}

