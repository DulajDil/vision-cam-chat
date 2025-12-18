import express, { Request, Response } from 'express';
import { HealthResponse } from '../types/index.js';

const app = express();

app.get('/health', (_req: Request, res: Response<HealthResponse>) => {
    res.json({ ok: true });
});

export default app;