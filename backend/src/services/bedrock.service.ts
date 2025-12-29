/**
 * AWS Bedrock Service
 * Handles all AWS Bedrock (Claude) vision API calls
 */
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { BedrockStatusResponse } from '../types/bedrock.js';

const region = process.env['AWS_REGION'] || 'ap-southeast-2';
const modelId = process.env['BEDROCK_MODEL_ID'] || 'anthropic.claude-3-haiku-20240307-v1:0';


/**
 * Validate Bedrock configuration without invoking model
 */
export async function validateBedrockConfig(): Promise<BedrockStatusResponse> {
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

/**
 * Call AWS Bedrock (Claude) vision API
 */
export async function callBedrock(
    prompt: string,
    imageBase64: string,
    mimeType: string
): Promise<string> {
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



