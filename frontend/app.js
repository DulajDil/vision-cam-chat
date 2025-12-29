/**
 * Main Application Entry Point
 * Orchestrates all components and handles app-level logic
 */

import { CameraComponent } from './components/camera.component.js';
import { ChatComponent } from './components/chat.component.js';
import { AnalysisComponent } from './components/analysis.component.js';
import { ProviderComponent } from './components/provider.component.js';
import { BackendStatusComponent } from './components/backend-status.component.js';
import { analyzeImage, askQuestion } from './services/api.service.js';
import { showStatus } from './utils/helpers.js';

class App {
    constructor() {
        this.initializeElements();
        this.initializeComponents();
        this.setupComponentCallbacks();
        this.start();
    }

    initializeElements() {
        this.elements = {
            // Camera elements
            webcam: document.getElementById('webcam'),
            canvas: document.getElementById('canvas'),
            capturedImage: document.getElementById('capturedImage'),
            startBtn: document.getElementById('startCamera'),
            captureBtn: document.getElementById('captureBtn'),
            analyzeBtn: document.getElementById('analyzeBtn'),

            // Chat elements
            chatHistory: document.getElementById('chatHistory'),
            questionInput: document.getElementById('questionInput'),
            askBtn: document.getElementById('askBtn'),

            // Analysis elements
            analysisResult: document.getElementById('analysisResult'),

            // Provider elements
            providerRadios: document.getElementsByName('provider'),
            openaiKeyInput: document.getElementById('openaiKeyInput'),
            openaiKey: document.getElementById('openaiKey'),

            // Status elements
            statusDiv: document.getElementById('status'),
            backendStatus: document.getElementById('backendStatus')
        };
    }

    initializeComponents() {
        this.camera = new CameraComponent({
            webcam: this.elements.webcam,
            canvas: this.elements.canvas,
            capturedImage: this.elements.capturedImage,
            startBtn: this.elements.startBtn,
            captureBtn: this.elements.captureBtn
        }, this.elements.statusDiv);

        this.chat = new ChatComponent({
            chatHistory: this.elements.chatHistory,
            questionInput: this.elements.questionInput,
            askBtn: this.elements.askBtn
        });

        this.analysis = new AnalysisComponent({
            analysisResult: this.elements.analysisResult,
            analyzeBtn: this.elements.analyzeBtn
        });

        this.provider = new ProviderComponent({
            providerRadios: this.elements.providerRadios,
            openaiKeyInput: this.elements.openaiKeyInput,
            openaiKey: this.elements.openaiKey
        }, this.elements.statusDiv);

        this.backendStatus = new BackendStatusComponent({
            backendStatus: this.elements.backendStatus
        }, this.elements.statusDiv);
    }

    setupComponentCallbacks() {
        // Camera callbacks
        this.camera.onImageCaptured = (blob) => {
            this.analysis.enableAnalyzeButton();
        };

        // Provider callbacks
        this.provider.onProviderChange = (provider) => {
            this.chat.setProvider(provider);
        };

        // Analysis button
        this.elements.analyzeBtn.addEventListener('click', () => this.handleAnalyze());

        // Chat callbacks
        this.chat.onAskQuestion = (question) => this.handleAskQuestion(question);
    }

    async handleAnalyze() {
        if (!this.camera.hasCapturedImage()) {
            showStatus(this.elements.statusDiv, 'No image captured', 'error');
            return;
        }

        if (!this.provider.validateProvider()) {
            return;
        }

        this.analysis.setLoadingState(true);
        showStatus(this.elements.statusDiv, 'Analyzing image...', 'info');

        try {
            const imageBlob = this.camera.getCapturedImage();
            const provider = this.provider.getProvider();
            const openaiKey = this.provider.getOpenAIKey();

            const result = await analyzeImage(imageBlob, provider, openaiKey);

            this.analysis.displayResult(result);
            this.chat.clear();
            this.chat.enable();

            showStatus(this.elements.statusDiv, 'Analysis complete!', 'success');
        } catch (error) {
            console.error('Analysis error:', error);
            showStatus(this.elements.statusDiv, `Error: ${error.message}`, 'error');
        } finally {
            this.analysis.setLoadingState(false);
        }
    }

    async handleAskQuestion(question) {
        if (!this.provider.validateProvider()) {
            return;
        }

        this.chat.addMessage('user', question);
        this.chat.setLoadingState(true);

        try {
            const provider = this.provider.getProvider();
            const openaiKey = this.provider.getOpenAIKey();

            const result = await askQuestion(question, provider, openaiKey);

            this.chat.addMessage('ai', result.answer);
        } catch (error) {
            console.error('Ask error:', error);
            this.chat.addMessage('ai', `Error: ${error.message}`);
            showStatus(this.elements.statusDiv, `Error: ${error.message}`, 'error');
        } finally {
            this.chat.setLoadingState(false);
        }
    }

    start() {
        this.backendStatus.startMonitoring();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

