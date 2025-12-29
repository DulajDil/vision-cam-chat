/**
 * Analysis Component
 * Handles image analysis display and controls
 */

import { PROVIDER_NAMES } from '../utils/constants.js';

export class AnalysisComponent {
    constructor(elements) {
        this.analysisResult = elements.analysisResult;
        this.analyzeBtn = elements.analyzeBtn;
    }

    displayResult(data) {
        this.analysisResult.innerHTML = `
            <div class="analysis-content">
                <p><strong>Provider:</strong> ${PROVIDER_NAMES[data.provider]}</p>
                <p><strong>Description:</strong></p>
                <p>${data.caption}</p>
            </div>
        `;
        this.analysisResult.classList.add('success');
    }

    clear() {
        this.analysisResult.innerHTML = '<p class="placeholder">Capture and analyze an image to see results...</p>';
        this.analysisResult.classList.remove('success');
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.analyzeBtn.disabled = true;
            this.analyzeBtn.textContent = '⏳ Analyzing...';
        } else {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.textContent = '🤖 Analyze Image';
        }
    }

    enableAnalyzeButton() {
        this.analyzeBtn.disabled = false;
    }

    disableAnalyzeButton() {
        this.analyzeBtn.disabled = true;
    }
}

