/**
 * TypeScript Type Definitions for Frontend
 */

export type AIProvider = 'openai' | 'bedrock';

export type StatusType = 'success' | 'error' | 'info';

export interface AnalyzeResponse {
    provider: AIProvider;
    caption: string;
}

export interface AskResponse {
    provider: AIProvider;
    answer: string;
}

export interface HealthResponse {
    ok: boolean;
}

export interface BedrockStatusResponse {
    ok: boolean;
    message: string;
}

export interface ErrorResponse {
    error: string;
}

export interface WebcamConfig {
    video: {
        width: number;
        height: number;
    };
}

export interface ImageConfig {
    format: string;
    quality: number;
}

export interface CameraElements {
    webcam: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    capturedImage: HTMLImageElement;
    startBtn: HTMLButtonElement;
    captureBtn: HTMLButtonElement;
}

export interface ChatElements {
    chatHistory: HTMLDivElement;
    questionInput: HTMLInputElement;
    askBtn: HTMLButtonElement;
}

export interface AnalysisElements {
    analysisResult: HTMLDivElement;
    analyzeBtn: HTMLButtonElement;
}

export interface ProviderElements {
    providerRadios: NodeListOf<HTMLInputElement>;
    openaiKeyInput: HTMLDivElement;
    openaiKey: HTMLInputElement;
}

export interface StatusElements {
    backendStatus: HTMLSpanElement;
}

export interface AppElements {
    webcam: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    capturedImage: HTMLImageElement;
    startBtn: HTMLButtonElement;
    captureBtn: HTMLButtonElement;
    analyzeBtn: HTMLButtonElement;
    chatHistory: HTMLDivElement;
    questionInput: HTMLInputElement;
    askBtn: HTMLButtonElement;
    analysisResult: HTMLDivElement;
    providerRadios: NodeListOf<HTMLInputElement>;
    openaiKeyInput: HTMLDivElement;
    openaiKey: HTMLInputElement;
    statusDiv: HTMLDivElement;
    backendStatus: HTMLSpanElement;
}

