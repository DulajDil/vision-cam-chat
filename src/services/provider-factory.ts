/**
 * Provider Factory
 * Creates the appropriate vision provider based on provider name
 */

import { VisionProvider } from './vision-provider.js';
import { OpenAIProvider } from './openai-provider.js';
import { BedrockProvider } from './bedrock-provider.js';
import type { AIProvider } from '../types/index.js';

export class ProviderFactory {
    /**
     * Create a vision provider instance
     * @param provider - Provider name ('openai' or 'bedrock')
     * @param apiKey - Optional API key (required for OpenAI)
     * @returns VisionProvider instance
     */
    static createProvider(provider: AIProvider, apiKey?: string): VisionProvider {
        switch (provider) {
            case 'openai':
                return new OpenAIProvider(apiKey);

            case 'bedrock':
                return new BedrockProvider();

            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    /**
     * Get list of supported providers
     */
    static getSupportedProviders(): AIProvider[] {
        return ['openai', 'bedrock'];
    }

    /**
     * Validate if a provider name is supported
     */
    static isValidProvider(provider: string): provider is AIProvider {
        return this.getSupportedProviders().includes(provider as AIProvider);
    }
}

