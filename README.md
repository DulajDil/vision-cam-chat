# Vision Cam Chat

A real-time AI-powered image analysis application that enables users to capture images via webcam and interact with AI vision models through a conversational interface.

## Overview

Vision Cam Chat provides a streamlined interface for analyzing images using state-of-the-art AI vision models. Users can capture images directly from their webcam and receive instant AI-generated descriptions, followed by interactive Q&A sessions about the captured content.

## Architecture

### Technology Stack

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- AWS Bedrock Runtime (Claude 3 Haiku)
- OpenAI GPT-4o Vision API
- In-memory image storage

**Frontend:**
- TypeScript
- Vanilla JavaScript (ES6 Modules)
- HTML5 Canvas API for image capture
- MediaDevices API for webcam access

### Key Features

- **Dual AI Provider Support**: Choose between AWS Bedrock (Claude) or OpenAI (GPT-4o)
- **Real-time Image Capture**: Direct webcam integration with HD quality (1280x720)
- **Auto-Analysis**: Captured images are automatically analyzed
- **Interactive Chat**: Ask follow-up questions about analyzed images
- **Secure API Key Handling**: OpenAI keys are never stored, only used per-request
- **Type-Safe Codebase**: Full TypeScript implementation across frontend and backend

## Project Structure

```
vision-cam-chat/
├── backend/
│   ├── src/
│   │   ├── config/         # Multer and middleware configuration
│   │   ├── routes/         # Express route handlers
│   │   ├── services/       # AI provider integrations
│   │   ├── types/          # TypeScript type definitions
│   │   └── server.ts       # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI component classes
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Helper functions and constants
│   │   └── app.ts          # Main application orchestrator
│   ├── dist/               # Compiled JavaScript
│   ├── index.html
│   ├── styles.css
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Webcam-enabled device
- (Optional) AWS CLI configured for Bedrock access
- (Optional) OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DulajDil/vision-cam-chat.git
cd vision-cam-chat
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Configuration

Create a `.env` file in the backend directory:

```env
PORT=3000

# AWS Bedrock Configuration (Optional)
# AWS_PROFILE=your-aws-profile
# AWS_REGION=ap-southeast-2
# BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

**Note**: AWS credentials can be configured via:
- Environment variables
- AWS credentials file (`~/.aws/credentials`)
- IAM roles (for EC2/ECS deployments)

#### OpenAI Configuration

OpenAI API keys are provided per-request via the frontend UI. No backend configuration required.

### Running the Application

#### Development Mode

Start the backend server:
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000` with hot reload enabled.

Build and serve the frontend:
```bash
cd frontend
npm run build
python3 -m http.server 8000
```

Access the application at `http://localhost:8000`

#### Production Build

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

Serve the `frontend/` directory using your preferred web server (nginx, Apache, etc.)

## API Documentation

### Endpoints

#### Health Check
```http
GET /health
```

Returns backend health status.

**Response:**
```json
{
  "ok": true
}
```

#### Bedrock Status
```http
GET /bedrock/status
```

Validates AWS Bedrock configuration.

**Response:**
```json
{
  "ok": true,
  "message": "Bedrock initialized successfully..."
}
```

#### Analyze Image
```http
POST /analyze
Content-Type: multipart/form-data
```

Analyzes an uploaded image.

**Parameters:**
- `frame` (file): Image file
- `provider` (string): "openai" or "bedrock"

**Headers (for OpenAI):**
- `X-Api-Key`: OpenAI API key

**Response:**
```json
{
  "provider": "openai",
  "caption": "Image description..."
}
```

#### Ask Question
```http
POST /ask
Content-Type: application/json
```

Ask questions about the most recently analyzed image.

**Body:**
```json
{
  "provider": "openai",
  "question": "What color is the object?"
}
```

**Headers (for OpenAI):**
- `X-Api-Key`: OpenAI API key

**Response:**
```json
{
  "provider": "openai",
  "answer": "The object is blue."
}
```

## Security Considerations

### API Key Management

- OpenAI API keys are transmitted via HTTPS headers
- Keys are never logged or persisted
- Each request includes fresh authentication
- Users maintain control of their own API keys

### Image Handling

- Images are stored in-memory only
- No disk persistence by default
- Automatic cleanup on new image upload
- 10MB file size limit enforced

### CORS Configuration

- CORS enabled for development
- Configure allowed origins for production deployment

## Deployment

### Backend Deployment

The backend can be deployed to:
- AWS EC2/ECS/Lambda
- Heroku
- DigitalOcean
- Any Node.js hosting platform

Ensure environment variables are properly configured in your deployment platform.

### Frontend Deployment

The frontend is a static site and can be deployed to:
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Update `API_BASE_URL` in `frontend/src/utils/constants.ts` to point to your backend URL.

## Performance Considerations

- HD image capture (1280x720) for optimal AI analysis
- High-quality JPEG encoding (0.92)
- Efficient in-memory storage
- TypeScript compilation for production optimization

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Requires: MediaDevices API, Canvas API, ES6 modules

## Development

### Type Checking

Backend:
```bash
cd backend
npm run typecheck
```

Frontend:
```bash
cd frontend
npm run typecheck
```

### Watch Mode

Frontend development with auto-rebuild:
```bash
cd frontend
npm run watch
```

## Contributing

Contributions are welcome. Please ensure:
- TypeScript compilation passes without errors
- Code follows existing patterns and style
- Commit messages are descriptive

## License

MIT License - See LICENSE file for details

## Author

Dulaj Appuhamy
- GitHub: [@DulajDil](https://github.com/DulajDil)

## Acknowledgments

- OpenAI GPT-4o Vision API
- AWS Bedrock (Anthropic Claude)
- Express.js framework
- TypeScript language

---

**Note**: This is a demonstration project showcasing AI vision capabilities. For production use, implement additional security measures, rate limiting, and monitoring as appropriate for your use case.
