# Vision Cam Chat - Frontend

Simple web UI for the Vision Cam Chat backend.

## Features

- 📹 **Webcam Integration** - Capture photos directly from your webcam
- 🤖 **Dual AI Providers** - Choose between OpenAI or AWS Bedrock
- 💬 **Interactive Chat** - Ask questions about captured images
- 🎨 **Modern UI** - Clean, responsive design
- 🔒 **Secure** - OpenAI keys never stored, only used per request

## Quick Start

### 1. Ensure Backend is Running

```bash
cd ../backend
npm run dev
```

Backend should be running on http://localhost:3000

### 2. Open Frontend

Simply open `index.html` in your browser:

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or use a local server (recommended):

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (if you have http-server installed)
npx http-server -p 8080
```

Then visit: http://localhost:8080

## How to Use

### 1. Start Camera
- Click "Start Camera" button
- Allow browser to access your webcam

### 2. Capture Photo
- Click "Capture Photo" when ready
- Preview your captured image

### 3. Choose AI Provider
- **AWS Bedrock (Claude)** - Default, uses backend AWS credentials
- **OpenAI (GPT-4o-mini)** - Requires your OpenAI API key

### 4. Analyze Image
- Click "Analyze Image"
- Wait for AI to describe what it sees

### 5. Ask Questions
- Type questions about the image
- Get AI-powered answers based on what's visible

## AI Providers

### AWS Bedrock (Claude)
- ✅ No API key needed (uses backend AWS credentials)
- ✅ Fast and accurate
- ✅ Cost-effective
- ⚠️ Backend must have AWS credentials configured

### OpenAI (GPT-4o-mini)
- ✅ BYOK - Bring Your Own Key
- ✅ Powerful vision model
- ✅ Keys never stored
- 🔑 Requires OpenAI API key from https://platform.openai.com

## Browser Compatibility

Requires a modern browser with:
- ✅ WebRTC support (for webcam)
- ✅ Fetch API
- ✅ ES6+ JavaScript

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Security Notes

- 🔒 OpenAI API keys are **never stored**
- 🔒 Keys are only sent with API requests
- 🔒 All communication with backend via CORS
- 🔒 No data is saved to localStorage/cookies

## Troubleshooting

### "Backend offline" message
- Make sure backend server is running on port 3000
- Check backend logs for errors

### Camera not working
- Allow camera permissions in browser
- Check if another app is using the camera
- Try refreshing the page

### OpenAI errors
- Verify your API key is correct (starts with `sk-`)
- Check you have credits on your OpenAI account
- Ensure API key has proper permissions

### CORS errors
- Backend has CORS enabled by default
- If using a different port, update `API_BASE_URL` in `app.js`

## File Structure

```
frontend/
├── index.html    # Main HTML structure
├── styles.css    # Styling and layout
├── app.js        # JavaScript logic
└── README.md     # This file
```

## Development

### Modify API URL

If backend is on a different port, edit `app.js`:

```javascript
const API_BASE_URL = 'http://localhost:YOUR_PORT';
```

### Customize Styling

Edit `styles.css` to change colors, layout, etc.

## Tech Stack

- **Vanilla JavaScript** - No frameworks needed
- **WebRTC** - Webcam access
- **Fetch API** - Backend communication
- **CSS Grid/Flexbox** - Responsive layout

## Future Enhancements

- [ ] Image upload (instead of webcam only)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Image history
- [ ] Export chat conversations
- [ ] Mobile app version

---

Built with ❤️ for webcam-based AI interactions

