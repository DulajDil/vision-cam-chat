/**
 * Backend Status Component
 * Monitors backend health
 */

import { checkBackendHealth } from '../services/api.service.js';
import { showStatus } from '../utils/helpers.js';
import type { StatusElements } from '../types/index.js';

export class BackendStatusComponent {
    private statusIndicator: HTMLSpanElement;
    private statusDiv: HTMLDivElement;

    private checkInterval: number | null = null;

    constructor(elements: StatusElements, statusDiv: HTMLDivElement) {
        this.statusIndicator = elements.backendStatus;
        this.statusDiv = statusDiv;
    }

    public async checkStatus(): Promise<void> {
        try {
            await checkBackendHealth();
            this.setOnline();
            showStatus(this.statusDiv, 'Connected to backend ✓', 'success');
        } catch (error) {
            this.setOffline();
            showStatus(this.statusDiv, 'Backend offline - Please start the backend server', 'error');
        }
    }

    private setOnline(): void {
        this.statusIndicator.classList.add('online');
        this.statusIndicator.classList.remove('offline');
    }

    private setOffline(): void {
        this.statusIndicator.classList.add('offline');
        this.statusIndicator.classList.remove('online');
    }

    public startMonitoring(intervalMs: number = 30000): void {
        this.checkStatus();
        this.checkInterval = window.setInterval(() => this.checkStatus(), intervalMs);
    }

    public stopMonitoring(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
}

