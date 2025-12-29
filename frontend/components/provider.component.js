/**
 * Provider Component
 * Handles AI provider selection and OpenAI key input
 */

import { PROVIDERS } from '../utils/constants.js';
import { getSelectedProvider, showStatus } from '../utils/helpers.js';

export class ProviderComponent {
    constructor(elements, statusDiv) {
        this.providerRadios = elements.providerRadios;
        this.openaiKeyInput = elements.openaiKeyInput;
        this.openaiKey = elements.openaiKey;
        this.statusDiv = statusDiv;

        this.currentProvider = PROVIDERS.BEDROCK;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.providerRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleProviderChange(e));
        });
    }

    handleProviderChange(e) {
        this.currentProvider = e.target.value;

        if (this.currentProvider === PROVIDERS.OPENAI) {
            this.openaiKeyInput.style.display = 'block';
        } else {
            this.openaiKeyInput.style.display = 'none';
        }

        const providerName = this.currentProvider === PROVIDERS.OPENAI
            ? 'OpenAI'
            : 'AWS Bedrock';

        showStatus(this.statusDiv, `Switched to ${providerName}`, 'info');

        // Notify callback
        if (this.onProviderChange) {
            this.onProviderChange(this.currentProvider);
        }
    }

    getProvider() {
        return getSelectedProvider(this.providerRadios);
    }

    getOpenAIKey() {
        return this.openaiKey.value.trim();
    }

    validateProvider() {
        if (this.currentProvider === PROVIDERS.OPENAI && !this.getOpenAIKey()) {
            showStatus(this.statusDiv, 'Please enter your OpenAI API key', 'error');
            this.openaiKey.focus();
            return false;
        }
        return true;
    }
}

