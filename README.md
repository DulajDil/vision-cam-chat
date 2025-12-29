# Vision Cam Chat

A full-stack TypeScript application for webcam-based AI vision analysis.

## 📁 Project Structure

```
vision-cam-chat/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic
│   │   └── types/    # TypeScript types
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/         # React + TypeScript UI (Coming soon)
    └── (to be built)
```

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
npm run dev      # Development with hot reload
```

Server runs on: http://localhost:3000

### API Endpoints

- `GET /health` - Health check
- `GET /bedrock/status` - AWS Bedrock status
- `POST /analyze` - Analyze image with AI
- `POST /ask` - Ask questions about image

For full backend documentation, see [backend/README.md](./backend/README.md)

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **AI Providers:** OpenAI (BYOK), AWS Bedrock (Claude)

### Frontend (Coming Soon)
- **Framework:** TBD (React/Vue/Vanilla)
- **Language:** TypeScript
- **Features:** Webcam integration, AI chat interface

## 📝 License

ISC

