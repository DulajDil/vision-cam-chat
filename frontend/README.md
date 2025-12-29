# Frontend - Vision Cam Chat

TypeScript-based frontend for the Vision Cam Chat application.

## 🚀 Features

- **Webcam Integration**: Capture images directly from your camera
- **AI Vision Analysis**: Get instant descriptions of captured images
- **Interactive Chat**: Ask questions about your images
- **Dual Provider Support**: Choose between AWS Bedrock or OpenAI
- **Real-time Status**: Monitor backend connection status
- **Type-Safe**: Built entirely in TypeScript

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # UI Components (TypeScript)
│   │   ├── camera.component.ts
│   │   ├── chat.component.ts
│   │   ├── analysis.component.ts
│   │   ├── provider.component.ts
│   │   └── backend-status.component.ts
│   │
│   ├── services/            # API Layer
│   │   └── api.service.ts
│   │
│   ├── utils/               # Utilities
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── types/               # TypeScript Types
│   │   └── index.ts
│   │
│   └── app.ts              # Main Entry Point
│
├── dist/                   # Compiled JavaScript (generated)
├── index.html             # Main HTML
├── styles.css             # Styling
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript Config
```

## 🛠️ Development

### Prerequisites

- Node.js (v20+)
- npm

### Install Dependencies

```bash
npm install
```

### Build TypeScript

```bash
npm run build
```

### Watch Mode (Auto-rebuild on changes)

```bash
npm run watch
```

### Type Check Only

```bash
npm run typecheck
```

## 🌐 Running the Frontend

1. Build the TypeScript:
   ```bash
   npm run build
   ```

2. Start the backend server (see `../backend/README.md`)

3. Open `index.html` in your browser, or use a local server:
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 🎯 Usage

1. **Start Camera**: Click the "📹 Start Camera" button
2. **Capture Photo**: Click "📸 Take Photo"
3. **Select Provider**: Choose between Bedrock or OpenAI
   - For OpenAI: Enter your API key
4. **Analyze**: Click "🤖 Analyze Image"
5. **Ask Questions**: Type questions in the chat and press Enter

## 🔧 TypeScript Configuration

The project uses strict TypeScript settings:
- Strict null checks
- No implicit any
- Full type safety
- ES2020 target
- ES Modules

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run watch` | Watch mode - auto-compile on changes |
| `npm run typecheck` | Type check without emitting files |

## 🎨 Component Architecture

Each component is self-contained and handles a specific UI concern:

- **CameraComponent**: Webcam control, photo capture
- **ChatComponent**: Message display, user input
- **AnalysisComponent**: Results display
- **ProviderComponent**: AI provider selection
- **BackendStatusComponent**: Health monitoring

## 🔌 API Integration

All API calls are centralized in `api.service.ts`:
- `checkBackendHealth()` - Health check
- `checkBedrockStatus()` - Bedrock status
- `analyzeImage()` - Image analysis
- `askQuestion()` - Q&A about image

## 🧪 Type Safety

The project includes comprehensive TypeScript types:
- Request/Response types
- Component element types
- Configuration types
- Provider types

See `src/types/index.ts` for all type definitions.
