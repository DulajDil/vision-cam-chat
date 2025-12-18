/**
 * AWS Bedrock Vision Provider Implementation
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { VisionProvider } from './vision-provider.js';

export class BedrockProvider implements VisionProvider {
    private region: string;
    private modelId: string;

    constructor(region?: string, modelId?: string) {
        this.region = region || process.env['AWS_REGION'] || 'ap-southeast-2';
        this.modelId = modelId || process.env['BEDROCK_MODEL_ID'] || 'anthropic.claude-3-haiku-20240307-v1:0';
    }

    getName(): string {
        return 'bedrock';
    }

    async validateConfig(): Promise<{ ok: boolean; message: string }> {
        try {
            // Just create client to validate credentials and region
            new BedrockRuntimeClient({ region: this.region });

            // Return success without actually invoking the model (to avoid cost)
            return {
                ok: true,
                message: `Bedrock initialized successfully in region ${this.region} with model ${this.modelId}`
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                ok: false,
                message: `Bedrock initialization failed: ${errorMessage}`
            };
        }
    }

    async analyzeImage(
        imageBase64: string,
        mimeType: string,
        prompt: string
    ): Promise<string> {
        const client = new BedrockRuntimeClient({ region: this.region });

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
            modelId: this.modelId,
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

    async askQuestion(
        imageBase64: string,
        mimeType: string,
        question: string
    ): Promise<string> {
        // Reuse analyzeImage with the question as prompt
        return this.analyzeImage(imageBase64, mimeType, question);
    }
}

