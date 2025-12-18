/**
 * Vision Provider Interface
 * Common interface for all AI vision providers
 */

export interface VisionProvider {
    /**
     * Analyze an image and return a description
     */
    analyzeImage(imageBase64: string, mimeType: string, prompt: string): Promise<string>;

    /**
     * Answer a question about an image
     */
    askQuestion(imageBase64: string, mimeType: string, question: string): Promise<string>;

    /**
     * Get provider name
     */
    getName(): string;

    /**
     * Validate provider configuration
     */
    validateConfig(): Promise<{ ok: boolean; message: string }>;
}

/**
 * Base prompt templates
 */
export const PromptTemplates = {
    analyze: 'Describe what you see in this image in 1-2 sentences. Answer ONLY from what you can see. If unsure, say you\'re unsure and suggest how to improve the photo (move closer, reduce glare).',

    question: (userQuestion: string) =>
        `${userQuestion}\n\nAnswer ONLY from what you can see in the image. If unsure, say you're unsure and suggest how to improve the photo (move closer, reduce glare).`
};

