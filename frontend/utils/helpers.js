/**
 * Utility Helper Functions
 */

/**
 * Create and show a status message
 */
export function showStatus(statusDiv, message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    // Auto-hide after 5 seconds for success/info messages
    if (type !== 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Scroll element to bottom
 */
export function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

/**
 * Clear element content
 */
export function clearElement(element) {
    element.innerHTML = '';
}

/**
 * Get selected provider from radio buttons
 */
export function getSelectedProvider(radioButtons) {
    for (const radio of radioButtons) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

