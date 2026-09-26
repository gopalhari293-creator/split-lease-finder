import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './seed/seed.js';
import { authenticateToken } from './middleware/auth.js';
import { getMe } from './controllers/authController.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import roommateRoutes from './routes/roommateRoutes.js';
import apartmentRoutes from './routes/apartmentRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import savedApartmentRoutes from './routes/savedApartmentRoutes.js';
import messagingRoutes from './routes/messagingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        CLIENT_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.some((o) => o.replace(/\/$/, '') === cleanOrigin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'SplitLease Express Backend', timestamp: new Date() });
});

// User Me Endpoints
app.get('/api/users/me', authenticateToken, getMe);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/saved-apartments', savedApartmentRoutes);
app.use('/api/conversations', messagingRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();
    // Auto-seed if database is empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`[SplitLease API] Server running on http://localhost:${PORT}`);
      console.log(`[SplitLease API] REST API base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
