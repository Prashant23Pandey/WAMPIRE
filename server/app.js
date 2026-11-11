import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import requestLogger from './middleware/requestLogger.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import apiRouter from './routes/index.js';

const app = express();

// Configure Production CORS
const configuredClientUrls = (process.env.CLIENT_URL || config.clientUrl || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredClientUrls,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, health probes)
      if (!origin || config.isDevelopment) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Authorize dynamic Vercel preview and production deployment subdomains
      if (/^https:\/\/[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  })
);

// Body parsers & cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'WAMPIRE Hackathon API',
    status: 'active',
    version: '1.0.0',
    documentation: '/api/v1/health',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        verifyOtp: 'POST /api/auth/verify-otp',
        resendOtp: 'POST /api/auth/resend-otp',
        login: 'POST /api/auth/login',
      },
      user: {
        me: 'GET /api/user/me',
        update: 'PUT /api/user/update',
      },
      hackathon: {
        register: 'POST /api/hackathon/register',
        myEntry: 'GET /api/hackathon/my-entry',
        updateEntry: 'PATCH /api/hackathon/my-entry',
        deleteById: 'DELETE /api/hackathon/:id',
      },
      contact: {
        submit: 'POST /api/contact',
      },
      admin: {
        login: 'POST /api/admin/login',
        stats: 'GET /api/admin/stats',
        registrations: 'GET /api/admin/registrations',
        updateStatus: 'PATCH /api/admin/registrations/:id/status',
        deleteRegistration: 'DELETE /api/admin/registrations/:id',
      },
      v1: '/api/v1/*',
    },
  });
});

// Mount Core API Endpoints directly under /api
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/hackathon', hackathonRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Mount Centralized API Routes under /api/v1
app.use('/api/v1', apiRouter);

// Catch-all 404 handler
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(globalErrorHandler);

export default app;
