/**
 * OpenAI Service
 * Handles all OpenAI vision API calls
 */

import OpenAI from 'openai';

/**
 * Call OpenAI vision API
 */
export async function callOpenAI(
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

