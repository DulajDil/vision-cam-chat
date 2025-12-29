// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// State
let stream = null;
let capturedBlob = null;
let currentProvider = 'bedrock';

// Elements
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('capturedImage');
const startCameraBtn = document.getElementById('startCamera');
const captureBtn = document.getElementById('captureBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const askBtn = document.getElementById('askBtn');
const questionInput = document.getElementById('questionInput');
const analysisResult = document.getElementById('analysisResult');
const chatHistory = document.getElementById('chatHistory');
const statusDiv = document.getElementById('status');
const backendStatus = document.getElementById('backendStatus');
const providerRadios = document.getElementsByName('provider');
const openaiKeyInput = document.getElementById('openaiKeyInput');
const openaiKey = document.getElementById('openaiKey');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkBackendStatus();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    startCameraBtn.addEventListener('click', startCamera);
    captureBtn.addEventListener('click', capturePhoto);
    analyzeBtn.addEventListener('click', analyzeImage);
    askBtn.addEventListener('click', askQuestion);
    
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !askBtn.disabled) {
            askQuestion();
        }
    });
    
    providerRadios.forEach(radio => {
        radio.addEventListener('change', handleProviderChange);
    });
}

// Provider Change Handler
function handleProviderChange(e) {
    currentProvider = e.target.value;
    
    if (currentProvider === 'openai') {
        openaiKeyInput.style.display = 'block';
    } else {
        openaiKeyInput.style.display = 'none';
    }
    
    showStatus(`Switched to ${currentProvider === 'openai' ? 'OpenAI' : 'AWS Bedrock'}`, 'info');
}

// Check Backend Status
async function checkBackendStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            backendStatus.classList.add('online');
            backendStatus.classList.remove('offline');
            showStatus('Connected to backend ✓', 'success');
        } else {
            throw new Error('Backend not responding');
        }
    } catch (error) {
        backendStatus.classList.add('offline');
        backendStatus.classList.remove('online');
        showStatus('Backend offline - Please start the backend server', 'error');
    }
}

// Start Camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });
        
        webcam.srcObject = stream;
        webcam.style.display = 'block';
        capturedImage.style.display = 'none';
        
        startCameraBtn.textContent = '🔴 Stop Camera';
        startCameraBtn.onclick = stopCamera;
        captureBtn.disabled = false;
        
        showStatus('Camera started', 'success');
    } catch (error) {
        console.error('Camera error:', error);
        showStatus('Failed to access camera. Please allow camera access.', 'error');
    }
}

// Stop Camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        webcam.srcObject = null;
        stream = null;
    }
    
    startCameraBtn.textContent = '📹 Start Camera';
    startCameraBtn.onclick = startCamera;
    captureBtn.disabled = true;
    
    showStatus('Camera stopped', 'info');
}

// Capture Photo
function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
        capturedBlob = blob;
        const url = URL.createObjectURL(blob);
        
        capturedImage.src = url;
        capturedImage.style.display = 'block';
        webcam.style.display = 'none';
        
        analyzeBtn.disabled = false;
        showStatus('Photo captured! Click "Analyze Image" to continue.', 'success');
    }, 'image/jpeg', 0.95);
}

// Analyze Image
async function analyzeImage() {
    if (!capturedBlob) {
        showStatus('No image captured', 'error');
        return;
    }
    
    // Validate OpenAI key if needed
    if (currentProvider === 'openai' && !openaiKey.value.trim()) {
        showStatus('Please enter your OpenAI API key', 'error');
        openaiKey.focus();
        return;
    }
    
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '⏳ Analyzing...';
    showStatus('Analyzing image...', 'info');
    
    try {
        const formData = new FormData();
        formData.append('frame', capturedBlob, 'photo.jpg');
        formData.append('provider', currentProvider);
        
        const headers = {};
        if (currentProvider === 'openai') {
            headers['X-Api-Key'] = openaiKey.value.trim();
        }
        
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: headers,
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayAnalysisResult(data);
            questionInput.disabled = false;
            askBtn.disabled = false;
            showStatus('Analysis complete!', 'success');
        } else {
            throw new Error(data.error || 'Analysis failed');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '🤖 Analyze Image';
    }
}

// Display Analysis Result
function displayAnalysisResult(data) {
    analysisResult.innerHTML = `
        <div class="analysis-content">
            <p><strong>Provider:</strong> ${data.provider === 'openai' ? 'OpenAI (GPT-4o-mini)' : 'AWS Bedrock (Claude)'}</p>
            <p><strong>Description:</strong></p>
            <p>${data.caption}</p>
        </div>
    `;
    analysisResult.classList.add('success');
    
    // Clear chat history for new image
    chatHistory.innerHTML = '<p class="placeholder">Ask questions about this image...</p>';
}

// Ask Question
async function askQuestion() {
    const question = questionInput.value.trim();
    
    if (!question) {
        showStatus('Please enter a question', 'error');
        return;
    }
    
    // Validate OpenAI key if needed
    if (currentProvider === 'openai' && !openaiKey.value.trim()) {
        showStatus('Please enter your OpenAI API key', 'error');
        openaiKey.focus();
        return;
    }
    
    addChatMessage('user', question);
    questionInput.value = '';
    questionInput.disabled = true;
    askBtn.disabled = true;
    askBtn.textContent = '⏳';
    
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (currentProvider === 'openai') {
            headers['X-Api-Key'] = openaiKey.value.trim();
        }
        
        const response = await fetch(`${API_BASE_URL}/ask`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                provider: currentProvider,
                question: question
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            addChatMessage('ai', data.answer);
        } else {
            throw new Error(data.error || 'Failed to get answer');
        }
    } catch (error) {
        console.error('Ask error:', error);
        addChatMessage('ai', `Error: ${error.message}`);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        questionInput.disabled = false;
        askBtn.disabled = false;
        askBtn.textContent = 'Send';
        questionInput.focus();
    }
}

// Add Chat Message
function addChatMessage(type, message) {
    // Remove placeholder if it exists
    const placeholder = chatHistory.querySelector('.placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    const label = type === 'user' ? 'You' : (currentProvider === 'openai' ? 'GPT-4o' : 'Claude');
    
    messageDiv.innerHTML = `
        <strong>${label}</strong>
        <p>${message}</p>
    `;
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Show Status
function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds for success/info messages
    if (type !== 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// Check backend status periodically
setInterval(checkBackendStatus, 30000); // Every 30 seconds

