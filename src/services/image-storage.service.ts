/**
 * Image Storage Service
 * Handles in-memory storage of the latest uploaded image
 */

import type { StoredImage, ValidatedImage } from '../types/index.js';

// In-memory storage for the latest image
let latestImage: StoredImage = {
    base64: null,
    mimeType: null,
    timestamp: null
};

/**
 * Store image in memory as base64
 */
export function storeImage(buffer: Buffer, mimeType: string): void {
    latestImage = {
        base64: buffer.toString('base64'),
        mimeType: mimeType,
        timestamp: new Date().toISOString()
    };
}

/**
 * Get the latest stored image
 * @throws Error if no image has been uploaded yet
 */
export function getLatestImage(): ValidatedImage {
    if (!latestImage.base64 || !latestImage.mimeType || !latestImage.timestamp) {
        throw new Error('No image has been uploaded yet');
    }
    return {
        base64: latestImage.base64,
        mimeType: latestImage.mimeType,
        timestamp: latestImage.timestamp
    };
}

/**
 * Clear stored image (optional utility)
 */
export function clearImage(): void {
    latestImage = {
        base64: null,
        mimeType: null,
        timestamp: null
    };
}

