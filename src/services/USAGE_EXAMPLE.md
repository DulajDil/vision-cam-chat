# Vision Provider Usage Example

## Why This Architecture?

### ❌ **What NOT to Do:**
```typescript
// BAD: Generic HTTP call for both providers
const apiCall = async (url, method, body) => {
  return axios.request({ url, method, data: body });
};
```

**Problems:**
- OpenAI and Bedrock use **different SDKs** (not simple HTTP)
- Different authentication mechanisms (API key vs AWS SigV4)
- Different request/response formats
- Bypasses SDK benefits (retries, rate limiting, error handling)

### ✅ **Better Approach: Provider Pattern**

Use a **common interface** with **provider-specific implementations**.

## How to Use

### 1. **In Your Routes/Controllers:**

```typescript
import { ProviderFactory } from '../services/provider-factory.js';
import { PromptTemplates } from '../services/vision-provider.js';

// Example: Analyze endpoint
app.post('/analyze', upload.single('frame'), async (req, res) => {
  try {
    const provider = req.body.provider || 'bedrock';
    const apiKey = req.headers['x-api-key'] as string | undefined;
    
    // Create the right provider
    const visionProvider = ProviderFactory.createProvider(provider, apiKey);
    
    // Use common interface
    const caption = await visionProvider.analyzeImage(
      imageBase64,
      mimeType,
      PromptTemplates.analyze
    );
    
    res.json({ provider, caption });
  } catch (error) {
    // Handle error
  }
});
```

### 2. **Benefits:**

✅ **Type Safety** - TypeScript enforces the interface  
✅ **Flexibility** - Easy to add new providers (Google Gemini, Anthropic, etc.)  
✅ **Testability** - Mock the interface for testing  
✅ **Maintainability** - Each provider's logic is isolated  
✅ **SDK Benefits** - Uses official SDKs with all their features  

### 3. **Adding a New Provider:**

```typescript
// src/services/gemini-provider.ts
import { VisionProvider } from './vision-provider.js';

export class GeminiProvider implements VisionProvider {
  async analyzeImage(imageBase64, mimeType, prompt) {
    // Use Google's Gemini SDK
    // ...
  }
  
  async askQuestion(imageBase64, mimeType, question) {
    // ...
  }
  
  getName() {
    return 'gemini';
  }
  
  async validateConfig() {
    // ...
  }
}
```

Then add to factory:
```typescript
case 'gemini':
  return new GeminiProvider(apiKey);
```

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         VisionProvider Interface        │
│  (Common contract for all providers)   │
└─────────────────────────────────────────┘
                    ▲
                    │ implements
        ┌───────────┴───────────┐
        │                       │
┌───────┴──────┐       ┌────────┴───────┐
│   OpenAI     │       │    Bedrock     │
│   Provider   │       │    Provider    │
│              │       │                │
│ Uses OpenAI  │       │ Uses AWS SDK   │
│ SDK          │       │                │
└──────────────┘       └────────────────┘
```

## Key Differences Between Providers

| Feature          | OpenAI                | Bedrock              |
|------------------|-----------------------|----------------------|
| **SDK**          | `openai` npm package  | AWS SDK              |
| **Auth**         | API key (header)      | AWS IAM/credentials  |
| **Request**      | Chat completions API  | InvokeModel command  |
| **Response**     | JSON with choices     | Binary + JSON decode |
| **Retry Logic**  | Built into SDK        | Built into AWS SDK   |
| **Cost**         | Per token             | Per request          |

## Summary

- ✅ Use the **Provider Pattern** for abstraction
- ❌ Don't use generic HTTP calls for SDK-based services
- ✅ Each provider uses its **official SDK**
- ✅ Common interface for **consistent API**
- ✅ Easy to **extend** with new providers

