# Vision Cam Chat Backend

A lightweight **TypeScript** Node.js backend for a webcam snapshot app with AI vision analysis. Supports OpenAI (BYOK - Bring Your Own Key) and AWS Bedrock providers.

## Features

- 📸 Analyze webcam snapshots with AI vision models
- 💬 Ask questions about captured images
- 🔄 Provider toggle: OpenAI (BYOK) or AWS Bedrock
- 🔒 Secure: OpenAI keys never stored, only used per-request
- 💾 Lightweight: In-memory image storage (no disk writes)
- ⚡ Fast: Express + multer for efficient uploads

## Prerequisites

- Node.js 18+ (ES modules support)
- TypeScript 5.7+ (included in dev dependencies)
- AWS credentials configured (for Bedrock provider)
- OpenAI API key (for OpenAI provider - provided per request)

## Installation

```bash
# Install dependencies (already done if node_modules exists)
npm install

# Create .env file from example
cp .env.example .env
```

## Configuration

Create a `.env` file with:

```env
# Server Configuration
PORT=3000

# AWS Bedrock Configuration
AWS_PROFILE=your-aws-profile-name
AWS_REGION=ap-southeast-2
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

**Important:** Set `AWS_PROFILE` to your desired AWS CLI profile name (e.g., `default`, `personal`, etc.)

**Note:** OpenAI API keys are NOT stored in .env - they must be provided per-request via the `X-Api-Key` header.

## AWS Credentials Setup

For Bedrock provider, ensure AWS credentials are configured via:

- AWS CLI (`aws configure`)
- Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- IAM role (if running on EC2/ECS)

Required IAM permissions:
```json
{
  "Effect": "Allow",
  "Action": "bedrock:InvokeModel",
  "Resource": "arn:aws:bedrock:*::foundation-model/*"
}
```

## Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Type checking only (no build)
npm run typecheck
```

Server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### 1. Health Check

```bash
GET /health
```

**Response:**
```json
{
  "ok": true
}
```

### 2. Bedrock Status Check

```bash
GET /bedrock/status
```

Validates Bedrock configuration without invoking the model (no cost).

**Response:**
```json
{
  "ok": true,
  "message": "Bedrock initialized successfully in region ap-southeast-2..."
}
```

### 3. Analyze Image

```bash
POST /analyze
Content-Type: multipart/form-data
```

**Parameters:**
- `frame` (file, required): Image file
- `provider` (text, optional): `"openai"` or `"bedrock"` (default: `"bedrock"`)

**Headers (for OpenAI):**
- `X-Api-Key`: Your OpenAI API key

**Example (using curl with Bedrock):**
```bash
curl -X POST http://localhost:3000/analyze \
  -F "frame=@photo.jpg" \
  -F "provider=bedrock"
```

**Example (using curl with OpenAI):**
```bash
curl -X POST http://localhost:3000/analyze \
  -H "X-Api-Key: sk-..." \
  -F "frame=@photo.jpg" \
  -F "provider=openai"
```

**Response:**
```json
{
  "provider": "bedrock",
  "caption": "A person sitting at a desk with a laptop and monitor in a modern office setting."
}
```

### 4. Ask Question About Image

```bash
POST /ask
Content-Type: application/json
```

**Body:**
```json
{
  "provider": "openai",
  "question": "What color is the laptop?"
}
```

**Headers (for OpenAI):**
- `X-Api-Key`: Your OpenAI API key

**Response:**
```json
{
  "provider": "openai",
  "answer": "The laptop appears to be silver or gray in color."
}
```

**Note:** Uses the latest uploaded image from `/analyze`.

## Provider Details

### OpenAI (BYOK - Bring Your Own Key)

- **Model:** `gpt-4o-mini` (vision-capable)
- **Security:** API key provided via `X-Api-Key` header per request
- **Cost:** Paid by the user making the request
- **Image detail:** `low` (cost-optimized)

### AWS Bedrock (Local Credentials)

- **Model:** Claude 3 Haiku (configurable via `BEDROCK_MODEL_ID`)
- **Region:** `ap-southeast-2` (configurable via `AWS_REGION`)
- **Authentication:** Uses local AWS credentials (IAM role, CLI, env vars)
- **Cost:** Charged to the AWS account configured locally

## Security Features

✅ **BYOK for OpenAI:** User keys never stored or logged  
✅ **In-memory storage:** Images stored as base64, never written to disk  
✅ **Single image limit:** Only latest image kept in memory  
✅ **CORS enabled:** Cross-origin requests supported  
✅ **File size limits:** 10MB max upload size  
✅ **Image validation:** Only image files accepted  

## Error Handling

The API returns descriptive error messages:

- `400`: Missing image, missing question, invalid provider
- `500`: AI provider errors, missing OpenAI key, image processing errors

**Example error:**
```json
{
  "error": "OpenAI API key required. Provide it via X-Api-Key header."
}
```

## Response Constraints

AI responses follow these rules:

- ✅ Answer ONLY from what is visible in the image
- ✅ If unsure, acknowledge uncertainty and suggest photo improvements
- ✅ Analyze responses limited to 1-2 sentences
- ✅ Maximum 300 tokens per response

## Development Tips

1. **Test Bedrock first:** Run `GET /bedrock/status` to validate AWS setup
2. **Use environment variables:** Don't hardcode sensitive values
3. **Monitor costs:** Bedrock charges per request; OpenAI charges per token
4. **Image quality:** Better lighting = better AI responses
5. **Question specificity:** More specific questions = better answers

## Troubleshooting

### "Bedrock initialization failed"
- Check AWS credentials are configured
- Verify AWS_REGION is supported by Bedrock
- Ensure IAM permissions include `bedrock:InvokeModel`

### "OpenAI API key required"
- Ensure `X-Api-Key` header is set with valid OpenAI key
- Key format: `sk-...`

### "No image has been uploaded yet"
- Call `/analyze` endpoint first to store an image
- Then call `/ask` to question that image

### "Only image files are allowed"
- Ensure uploaded file has image MIME type (jpeg, png, gif, etc.)

## Project Structure

```
vision-cam-chat/
├── src/
│   ├── server.ts       # Main Express server (TypeScript)
│   └── types/
│       └── index.ts    # TypeScript type definitions
├── dist/               # Compiled JavaScript (generated by tsc)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── .env               # Environment configuration (create from env.example)
└── README.md          # This file
```

## Dependencies

### Production
- `express` - Web framework
- `multer` - File upload handling
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `openai` - OpenAI API client
- `@aws-sdk/client-bedrock-runtime` - AWS Bedrock client

### Development
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution and hot reload
- `@types/express` - Express type definitions
- `@types/multer` - Multer type definitions
- `@types/cors` - CORS type definitions
- `@types/node` - Node.js type definitions

## License

ISC

## Contributing

Feel free to open issues or submit pull requests!

---

Built with ❤️ for webcam-based AI interactions

