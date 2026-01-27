/**
 * Provider Component
 * Handles AI provider selection and OpenAI key input
 */

import { PROVIDERS } from '../utils/constants.js';
import { getSelectedProvider, showStatus } from '../utils/helpers.js';
import type { ProviderElements, AIProvider } from '../types/index.js';

export class ProviderComponent {
    private providerRadios: NodeListOf<HTMLInputElement>;
    private openaiKeyInput: HTMLDivElement;
    private openaiKey: HTMLInputElement;
    private statusDiv: HTMLDivElement;

    private currentProvider: AIProvider = PROVIDERS.BEDROCK;

    public onProviderChange?: (provider: AIProvider) => void;

    constructor(elements: ProviderElements, statusDiv: HTMLDivElement) {
        this.providerRadios = elements.providerRadios;
        this.openaiKeyInput = elements.openaiKeyInput;
        this.openaiKey = elements.openaiKey;
        this.statusDiv = statusDiv;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.providerRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleProviderChange(e));
        });
    }

    private handleProviderChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        this.currentProvider = target.value as AIProvider;

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

    public getProvider(): AIProvider {
        const selected = getSelectedProvider(this.providerRadios);
        return (selected as AIProvider) || PROVIDERS.BEDROCK;
    }

    public getOpenAIKey(): string {
        return this.openaiKey.value.trim();
    }

    public validateProvider(): boolean {
        if (this.currentProvider === PROVIDERS.OPENAI && !this.getOpenAIKey()) {
            showStatus(this.statusDiv, 'Please enter your OpenAI API key', 'error');
            this.openaiKey.focus();
            return false;
        }
        return true;
    }
}

