/**
 * Camera Component
 * Handles webcam control, capture, and display
 */

import { WEBCAM_CONFIG, IMAGE_CONFIG } from '../utils/constants.js';
import { showStatus } from '../utils/helpers.js';
import type { CameraElements } from '../types/index.js';

export class CameraComponent {
    private webcam: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private capturedImage: HTMLImageElement;
    private startBtn: HTMLButtonElement;
    private captureBtn: HTMLButtonElement;
    private statusDiv: HTMLDivElement;

    private stream: MediaStream | null = null;
    private capturedBlob: Blob | null = null;

    public onImageCaptured?: (blob: Blob) => void;

    constructor(elements: CameraElements, statusDiv: HTMLDivElement) {
        this.webcam = elements.webcam;
        this.canvas = elements.canvas;
        this.capturedImage = elements.capturedImage;
        this.startBtn = elements.startBtn;
        this.captureBtn = elements.captureBtn;
        this.statusDiv = statusDiv;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.startBtn.addEventListener('click', () => this.toggleCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
    }

    private async toggleCamera(): Promise<void> {
        if (this.stream) {
            this.stopCamera();
        } else {
            await this.startCamera();
        }
    }

    private async startCamera(): Promise<void> {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(WEBCAM_CONFIG);

            this.webcam.srcObject = this.stream;
            this.webcam.style.display = 'block';
            this.capturedImage.style.display = 'none';

            this.startBtn.textContent = 'Stop Camera';
            this.captureBtn.disabled = false;

            showStatus(this.statusDiv, 'Camera started', 'success');
        } catch (error) {
            console.error('Camera error:', error);
            showStatus(this.statusDiv, 'Failed to access camera. Please allow camera access.', 'error');
        }
    }

    private stopCamera(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.webcam.srcObject = null;
            this.stream = null;
        }

        this.startBtn.textContent = 'Start Camera';
        this.captureBtn.disabled = true;

        showStatus(this.statusDiv, 'Camera stopped', 'info');
    }

    private capturePhoto(): void {
        const context = this.canvas.getContext('2d');
        if (!context) return;

        this.canvas.width = this.webcam.videoWidth;
        this.canvas.height = this.webcam.videoHeight;

        context.drawImage(this.webcam, 0, 0, this.canvas.width, this.canvas.height);

        this.canvas.toBlob((blob) => {
            if (!blob) return;

            this.capturedBlob = blob;
            const url = URL.createObjectURL(blob);

            this.capturedImage.src = url;
            this.capturedImage.style.display = 'block';
            this.webcam.style.display = 'none';

            showStatus(this.statusDiv, 'Photo captured! Analyzing...', 'success');

            // Notify that image is ready
            if (this.onImageCaptured) {
                this.onImageCaptured(this.capturedBlob);
            }
        }, IMAGE_CONFIG.format, IMAGE_CONFIG.quality);
    }

    public getCapturedImage(): Blob | null {
        return this.capturedBlob;
    }

    public hasCapturedImage(): boolean {
        return this.capturedBlob !== null;
    }
}

