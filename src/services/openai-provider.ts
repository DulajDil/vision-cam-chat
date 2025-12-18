/**
 * OpenAI Vision Provider Implementation
 */

import OpenAI from 'openai';
import { VisionProvider } from './vision-provider.js';

export class OpenAIProvider implements VisionProvider {
    private apiKey: string | undefined;

    constructor(apiKey?: string) {
        this.apiKey = apiKey;
    }

    getName(): string {
        return 'openai';
    }

    async validateConfig(): Promise<{ ok: boolean; message: string }> {
        if (!this.apiKey) {
            return {
                ok: false,
                message: 'OpenAI API key required. Provide it via X-Api-Key header.'
            };
        }

        try {
            // Quick validation - just check if we can create a client
            // Note: This doesn't make an actual API call to avoid costs
            new OpenAI({ apiKey: this.apiKey });
            return {
                ok: true,
                message: 'OpenAI provider initialized successfully'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                ok: false,
                message: `OpenAI initialization failed: ${errorMessage}`
            };
        }
    }

    async analyzeImage(
        imageBase64: string,
        mimeType: string,
        prompt: string
    ): Promise<string> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key required. Provide it via X-Api-Key header.');
        }

        const openai = new OpenAI({ apiKey: this.apiKey });

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

    async askQuestion(
        imageBase64: string,
        mimeType: string,
        question: string
    ): Promise<string> {
        // Reuse analyzeImage with the question as prompt
        return this.analyzeImage(imageBase64, mimeType, question);
    }
}

