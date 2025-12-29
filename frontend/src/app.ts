/**
 * Main Application Entry Point
 * Orchestrates all components and handles application logic
 */

import { CameraComponent } from './components/camera.component.js';
import { ChatComponent } from './components/chat.component.js';
import { AnalysisComponent } from './components/analysis.component.js';
import { ProviderComponent } from './components/provider.component.js';
import { BackendStatusComponent } from './components/backend-status.component.js';
import { analyzeImage, askQuestion } from './services/api.service.js';
import { showStatus } from './utils/helpers.js';
import type { AIProvider, AppElements } from './types/index.js';

class App {
    private camera!: CameraComponent;
    private chat!: ChatComponent;
    private analysis!: AnalysisComponent;
    private provider!: ProviderComponent;
    private backendStatus!: BackendStatusComponent;

    private statusDiv!: HTMLDivElement;

    constructor() {
        this.init();
    }

    private init(): void {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    private initializeApp(): void {
        const elements = this.getElements();

        // Initialize all components
        this.camera = new CameraComponent(
            {
                webcam: elements.webcam,
                canvas: elements.canvas,
                capturedImage: elements.capturedImage,
                startBtn: elements.startBtn,
                captureBtn: elements.captureBtn
            },
            elements.statusDiv
        );

        this.chat = new ChatComponent({
            chatHistory: elements.chatHistory,
            questionInput: elements.questionInput,
            askBtn: elements.askBtn
        });

        this.analysis = new AnalysisComponent({
            analysisResult: elements.analysisResult,
            analyzeBtn: elements.analyzeBtn
        });

        this.provider = new ProviderComponent(
            {
                providerRadios: elements.providerRadios,
                openaiKeyInput: elements.openaiKeyInput,
                openaiKey: elements.openaiKey
            },
            elements.statusDiv
        );

        this.backendStatus = new BackendStatusComponent(
            {
                backendStatus: elements.backendStatus
            },
            elements.statusDiv
        );

        this.statusDiv = elements.statusDiv;

        // Set up component interactions
        this.setupInteractions();

        // Start backend monitoring
        this.backendStatus.startMonitoring();

        // Analyze button click handler
        elements.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
    }

    private getElements(): AppElements {
        const getElement = <T extends HTMLElement>(id: string): T => {
            const element = document.getElementById(id) as T | null;
            if (!element) {
                throw new Error(`Element with id '${id}' not found`);
            }
            return element;
        };

        return {
            webcam: getElement<HTMLVideoElement>('webcam'),
            canvas: getElement<HTMLCanvasElement>('canvas'),
            capturedImage: getElement<HTMLImageElement>('capturedImage'),
            startBtn: getElement<HTMLButtonElement>('startBtn'),
            captureBtn: getElement<HTMLButtonElement>('captureBtn'),
            analyzeBtn: getElement<HTMLButtonElement>('analyzeBtn'),
            chatHistory: getElement<HTMLDivElement>('chatHistory'),
            questionInput: getElement<HTMLInputElement>('questionInput'),
            askBtn: getElement<HTMLButtonElement>('askBtn'),
            analysisResult: getElement<HTMLDivElement>('analysisResult'),
            providerRadios: document.querySelectorAll<HTMLInputElement>('input[name="provider"]'),
            openaiKeyInput: getElement<HTMLDivElement>('openaiKeyInput'),
            openaiKey: getElement<HTMLInputElement>('openaiKey'),
            statusDiv: getElement<HTMLDivElement>('status'),
            backendStatus: getElement<HTMLSpanElement>('backendStatus')
        };
    }

    private setupInteractions(): void {
        // When image is captured, enable analyze button
        this.camera.onImageCaptured = () => {
            this.analysis.enableAnalyzeButton();
        };

        // When provider changes, update chat component
        this.provider.onProviderChange = (provider: AIProvider) => {
            this.chat.setProvider(provider);
        };

        // When user asks a question
        this.chat.onAskQuestion = (question: string) => {
            this.handleAskQuestion(question);
        };
    }

    private async handleAnalyze(): Promise<void> {
        // Validate inputs
        if (!this.camera.hasCapturedImage()) {
            showStatus(this.statusDiv, 'Please capture an image first', 'error');
            return;
        }

        if (!this.provider.validateProvider()) {
            return;
        }

        // Get current settings
        const imageBlob = this.camera.getCapturedImage();
        if (!imageBlob) return;

        const currentProvider = this.provider.getProvider();
        const openaiKey = currentProvider === 'openai' ? this.provider.getOpenAIKey() : null;

        // Set loading states
        this.analysis.setLoadingState(true);

        try {
            const data = await analyzeImage(imageBlob, currentProvider, openaiKey);

            // Display result
            this.analysis.displayResult(data);

            // Enable chat
            this.chat.enable();
            this.chat.clear();

            showStatus(this.statusDiv, 'Analysis complete! You can now ask questions.', 'success');

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Analysis failed';
            showStatus(this.statusDiv, `Error: ${message}`, 'error');
            console.error('Analysis error:', error);

        } finally {
            this.analysis.setLoadingState(false);
        }
    }

    private async handleAskQuestion(question: string): Promise<void> {
        // Validate inputs
        if (!this.camera.hasCapturedImage()) {
            showStatus(this.statusDiv, 'Please capture and analyze an image first', 'error');
            return;
        }

        if (!this.provider.validateProvider()) {
            return;
        }

        // Get current settings
        const currentProvider = this.provider.getProvider();
        const openaiKey = currentProvider === 'openai' ? this.provider.getOpenAIKey() : null;

        // Show user message
        this.chat.addMessage('user', question);

        // Set loading state
        this.chat.setLoadingState(true);

        try {
            const data = await askQuestion(question, currentProvider, openaiKey);

            // Show AI response
            this.chat.addMessage('ai', data.answer);

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get answer';
            showStatus(this.statusDiv, `Error: ${message}`, 'error');
            console.error('Ask error:', error);

        } finally {
            this.chat.setLoadingState(false);
        }
    }
}

// Initialize the application
new App();

