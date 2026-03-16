import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import tasksRoutes from './routes/tasks.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 4000;

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

app.use(limiter);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/tasks', tasksRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running', timestamp: new Date() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;