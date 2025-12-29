/**
 * Chat Component
 * Handles chat history display and user input
 */

import { scrollToBottom, clearElement } from '../utils/helpers.js';
import { PROVIDER_NAMES } from '../utils/constants.js';

export class ChatComponent {
    constructor(elements) {
        this.chatHistory = elements.chatHistory;
        this.questionInput = elements.questionInput;
        this.askBtn = elements.askBtn;

        this.currentProvider = 'bedrock';

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.askBtn.addEventListener('click', () => this.handleAskQuestion());

        this.questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.askBtn.disabled) {
                this.handleAskQuestion();
            }
        });
    }

    handleAskQuestion() {
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

    addMessage(type, message) {
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

    clear() {
        clearElement(this.chatHistory);
        this.chatHistory.innerHTML = '<p class="placeholder">Ask questions about this image...</p>';
    }

    enable() {
        this.questionInput.disabled = false;
        this.askBtn.disabled = false;
    }

    disable() {
        this.questionInput.disabled = true;
        this.askBtn.disabled = true;
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.askBtn.textContent = '⏳';
            this.disable();
        } else {
            this.askBtn.textContent = 'Send';
            this.enable();
            this.questionInput.focus();
        }
    }

    setProvider(provider) {
        this.currentProvider = provider;
    }
}

