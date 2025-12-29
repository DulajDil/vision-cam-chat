/**
 * Chat Component
 * Handles chat history display and user input
 */

import { scrollToBottom, clearElement } from '../utils/helpers.js';
import { PROVIDER_NAMES } from '../utils/constants.js';
import type { ChatElements, AIProvider } from '../types/index.js';

export class ChatComponent {
    private chatHistory: HTMLDivElement;
    private questionInput: HTMLInputElement;
    private askBtn: HTMLButtonElement;

    private currentProvider: AIProvider = 'bedrock';

    public onAskQuestion?: (question: string) => void;

    constructor(elements: ChatElements) {
        this.chatHistory = elements.chatHistory;
        this.questionInput = elements.questionInput;
        this.askBtn = elements.askBtn;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.askBtn.addEventListener('click', () => this.handleAskQuestion());

        this.questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.askBtn.disabled) {
                this.handleAskQuestion();
            }
        });
    }

    private handleAskQuestion(): void {
        const question = this.questionInput.value.trim();

        if (!question) {
            return;
        }

        // Call callback if set
        if (this.onAskQuestion) {
            this.onAskQuestion(question);
        }

        this.questionInput.value = '';
    }

    public addMessage(type: 'user' | 'ai', message: string): void {
        // Remove placeholder if exists
        const placeholder = this.chatHistory.querySelector('.placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;

        const label = type === 'user'
            ? 'You'
            : PROVIDER_NAMES[this.currentProvider] || 'AI';

        messageDiv.innerHTML = `
            <strong>${label}</strong>
            <p>${message}</p>
        `;

        this.chatHistory.appendChild(messageDiv);
        scrollToBottom(this.chatHistory);
    }

    public clear(): void {
        clearElement(this.chatHistory);
    }

    public enable(): void {
        this.questionInput.disabled = false;
        this.askBtn.disabled = false;
    }

    public disable(): void {
        this.questionInput.disabled = true;
        this.askBtn.disabled = true;
    }

    public setLoadingState(isLoading: boolean): void {
        if (isLoading) {
            this.askBtn.textContent = '...';
            this.disable();
        } else {
            this.askBtn.textContent = 'Send';
            this.enable();
            this.questionInput.focus();
        }
    }

    public setAnalyzingState(isAnalyzing: boolean): void {
        if (isAnalyzing) {
            this.disable();
        } else {
            this.enable();
        }
    }

    public setProvider(provider: AIProvider): void {
        this.currentProvider = provider;
    }
}

