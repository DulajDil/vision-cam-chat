# TypeScript Frontend Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

### 3. Start Backend
```bash
cd ../backend
npm run dev
```

### 4. Open Frontend
Open `frontend/index.html` in your browser, or run:
```bash
cd frontend
python3 -m http.server 8000
# Visit http://localhost:8000
```

## 💻 Development Workflow

### Auto-rebuild on Changes
```bash
npm run watch
```
This watches your TypeScript files and automatically recompiles when you save.

### Type Checking
```bash
npm run typecheck
```
Checks types without emitting files - useful for quick validation.

### Full Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist/` folder.

## 📁 File Structure

```
frontend/
├── src/                      # Your TypeScript source code
│   ├── app.ts               # Main entry point - orchestrates everything
│   ├── components/          # UI component classes
│   │   ├── camera.component.ts          # Webcam & capture
│   │   ├── chat.component.ts            # Chat UI & messages
│   │   ├── analysis.component.ts        # Results display
│   │   ├── provider.component.ts        # Provider selection
│   │   └── backend-status.component.ts  # Health monitoring
│   ├── services/            # API communication
│   │   └── api.service.ts
│   ├── utils/               # Helper functions
│   │   ├── constants.ts
│   │   └── helpers.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts
│
├── dist/                    # Compiled JavaScript (generated - don't edit)
├── index.html              # HTML page
├── styles.css              # Styling
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Key TypeScript Features

### Strict Type Checking
The project uses strict TypeScript settings:
- ✅ No implicit `any` types
- ✅ Strict null checks
- ✅ Strict function types
- ✅ All type safety features enabled

### Type Definitions
All types are in `src/types/index.ts`:
- `AIProvider` - 'openai' | 'bedrock'
- `AnalyzeResponse` - API response types
- `AskResponse` - Q&A response types
- Component element interfaces

### Component Pattern
Each component is a TypeScript class:
```typescript
export class CameraComponent {
    private webcam: HTMLVideoElement;
    private stream: MediaStream | null = null;
    
    constructor(elements: CameraElements, statusDiv: HTMLDivElement) {
        // ...
    }
}
```

## 🔧 Common Tasks

### Adding a New Component
1. Create `src/components/mycomponent.component.ts`
2. Define the component class with typed constructor
3. Export the class
4. Import and use in `src/app.ts`

### Adding a New Type
1. Open `src/types/index.ts`
2. Add your interface:
```typescript
export interface MyNewType {
    field1: string;
    field2: number;
}
```

### Adding a New API Call
1. Open `src/services/api.service.ts`
2. Add function with return type:
```typescript
export async function myApiCall(): Promise<MyResponse> {
    const response = await fetch(`${API_BASE_URL}/endpoint`);
    return await response.json();
}
```

## 🐛 Debugging

### TypeScript Errors
Run type check to see all errors:
```bash
npm run typecheck
```

### Runtime Errors
1. Build generates source maps (`.js.map` files)
2. Browser DevTools will show TypeScript source
3. Set breakpoints directly in `.ts` files

### Common Issues

**"Cannot find module"**
- Make sure to use `.js` extension in imports (TypeScript convention for ES modules)
- Example: `import { MyClass } from './myfile.js'`

**Type errors after editing**
- Run `npm run typecheck` to see all type errors
- Fix types in `src/types/index.ts` if needed

**Changes not showing**
- Make sure to run `npm run build` after editing TypeScript
- Or use `npm run watch` for auto-rebuild

## 📚 TypeScript Concepts Used

### Type Safety
```typescript
// Function parameters and return types
function showStatus(statusDiv: HTMLDivElement, message: string, type: StatusType): void {
    // ...
}
```

### Interfaces
```typescript
interface CameraElements {
    webcam: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    // ...
}
```

### Union Types
```typescript
type AIProvider = 'openai' | 'bedrock';
type StatusType = 'success' | 'error' | 'info';
```

### Nullable Types
```typescript
private stream: MediaStream | null = null;
```

### Generic Types
```typescript
const getElement = <T extends HTMLElement>(id: string): T => {
    // ...
}
```

### Type Assertions
```typescript
const target = e.target as HTMLInputElement;
```

## 🎨 Code Style

- Use `const` for immutable values
- Use `private` for internal component state
- Use `public` for component API methods
- Use arrow functions for callbacks
- Type everything explicitly (no `any`)

## 📦 Build Output

After `npm run build`, the `dist/` folder contains:
- `.js` files - Compiled JavaScript
- `.js.map` files - Source maps for debugging

The browser loads `dist/app.js` which imports other compiled modules.

## ✅ Best Practices

1. **Always type function parameters and returns**
2. **Use interfaces for object shapes**
3. **Avoid `any` type** - use `unknown` if you must
4. **Null check before use** - TypeScript will warn you
5. **Use type guards** for runtime type checking
6. **Keep types in `types/` folder** for reusability

## 🚀 Deployment

Before deploying:
1. Run `npm run build` to compile
2. Deploy `dist/`, `index.html`, and `styles.css`
3. Make sure backend URL is correct in `src/utils/constants.ts`

---

Happy coding! TypeScript makes your code safer and easier to maintain. 🎉

