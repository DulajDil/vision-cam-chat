/**
 * Analysis Component
 * Handles image analysis display and controls
 */

import { PROVIDER_NAMES } from '../utils/constants.js';
import type { AnalysisElements, AnalyzeResponse } from '../types/index.js';

export class AnalysisComponent {
    private analysisResult: HTMLDivElement;
    private analyzeBtn: HTMLButtonElement;

    constructor(elements: AnalysisElements) {
        this.analysisResult = elements.analysisResult;
        this.analyzeBtn = elements.analyzeBtn;
    }

    public displayResult(data: AnalyzeResponse): void {
        this.analysisResult.innerHTML = `
            <div class="analysis-content">
                <p><strong>Provider:</strong> ${PROVIDER_NAMES[data.provider]}</p>
                <p><strong>Description:</strong></p>
                <p>${data.caption}</p>
            </div>
        `;
        this.analysisResult.classList.add('success');
    }

    public clear(): void {
        this.analysisResult.innerHTML = '<p class="placeholder">Capture and analyze an image to see results...</p>';
        this.analysisResult.classList.remove('success');
    }

    public setLoadingState(isLoading: boolean): void {
        if (isLoading) {
            this.analyzeBtn.disabled = true;
            this.analyzeBtn.textContent = 'Analyzing...';
        } else {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.textContent = 'Analyze Image';
        }
    }

    public enableAnalyzeButton(): void {
        this.analyzeBtn.disabled = false;
    }

    public disableAnalyzeButton(): void {
        this.analyzeBtn.disabled = true;
    }
}

