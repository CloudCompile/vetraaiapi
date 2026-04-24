import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat';
import { modelsRouter } from './routes/models';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check (no auth)
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'vetra-api', version: '1.0.0' });
});

// API v1 routes
app.use('/v1', authMiddleware);
app.use('/v1/chat/completions', chatRouter);
app.use('/v1/models', modelsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Vetra API running on port ${PORT}`);
});
