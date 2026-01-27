# Vision Cam Chat - Frontend

TypeScript-based frontend for webcam image capture and AI interaction.

## Features

- HD webcam capture (1280x720)
- Auto-analysis on capture
- Interactive chat interface
- Provider selection (OpenAI/Bedrock)
- Modular component architecture
- Type-safe TypeScript

## Development

```bash
npm install
npm run build
```

For auto-rebuild during development:
```bash
npm run watch
```

## Serving

Use any static file server:

```bash
python3 -m http.server 8000
```

## Type Checking

```bash
npm run typecheck
```

## Architecture

- `src/components/` - UI components
- `src/services/` - API communication layer
- `src/types/` - TypeScript type definitions
- `src/utils/` - Helper functions and constants
- `dist/` - Compiled JavaScript output
