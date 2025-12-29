/**
 * Utility Helper Functions
 */

import type { StatusType } from '../types/index.js';

/**
 * Create and show a status message as floating toast
 */
export function showStatus(statusDiv: HTMLDivElement, message: string, type: StatusType = 'info'): void {
    statusDiv.textContent = message;
    statusDiv.className = `status-toast ${type}`;

    // Show toast
    requestAnimationFrame(() => {
        statusDiv.classList.add('show');
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 3000);
}

/**
 * Scroll element to bottom
 */
export function scrollToBottom(element: HTMLElement): void {
    element.scrollTop = element.scrollHeight;
}

/**
 * Clear element content
 */
export function clearElement(element: HTMLElement): void {
    element.innerHTML = '';
}

/**
 * Get selected provider from radio buttons
 */
export function getSelectedProvider(radioButtons: NodeListOf<HTMLInputElement>): string | null {
    for (const radio of radioButtons) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

