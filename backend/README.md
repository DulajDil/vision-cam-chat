# Vision Cam Chat - Backend

Node.js/Express backend for AI-powered image analysis.

## Features

- RESTful API for image analysis
- Dual AI provider support (OpenAI GPT-4o, AWS Bedrock Claude)
- In-memory image storage
- TypeScript with strict type checking
- CORS enabled
- Multer for multipart form handling

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for configuration options.

## API Endpoints

- `GET /health` - Health check
- `GET /bedrock/status` - Bedrock configuration status
- `POST /analyze` - Analyze image
- `POST /ask` - Ask questions about image

## Type Checking

```bash
npm run typecheck
```
