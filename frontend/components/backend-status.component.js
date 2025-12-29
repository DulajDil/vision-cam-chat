/**
 * Backend Status Component
 * Monitors backend health
 */

import { checkBackendHealth } from '../services/api.service.js';
import { showStatus } from '../utils/helpers.js';

export class BackendStatusComponent {
    constructor(elements, statusDiv) {
        this.statusIndicator = elements.backendStatus;
        this.statusDiv = statusDiv;

        this.checkInterval = null;
    }

    async checkStatus() {
        try {
            await checkBackendHealth();
            this.setOnline();
            showStatus(this.statusDiv, 'Connected to backend ✓', 'success');
        } catch (error) {
            this.setOffline();
            showStatus(this.statusDiv, 'Backend offline - Please start the backend server', 'error');
        }
    }

    setOnline() {
        this.statusIndicator.classList.add('online');
        this.statusIndicator.classList.remove('offline');
    }

    setOffline() {
        this.statusIndicator.classList.add('offline');
        this.statusIndicator.classList.remove('online');
    }

    startMonitoring(intervalMs = 30000) {
        this.checkStatus();
        this.checkInterval = setInterval(() => this.checkStatus(), intervalMs);
    }

    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
}

