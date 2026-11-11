import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wampire',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  email: {
    user: process.env.EMAIL_USER || process.env.SMTP_USER || '',
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Wampire',
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  },
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate critical variables in production
if (config.isProduction) {
  const missing = [];
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (!process.env.MONGO_URI) missing.push('MONGO_URI');
  if (!process.env.EMAIL_USER) missing.push('EMAIL_USER');
  if (!process.env.EMAIL_PASS) missing.push('EMAIL_PASS');
  if (missing.length > 0) {
    throw new Error(`[CRITICAL] Missing required environment variables in production: ${missing.join(', ')}`);
  }
}

export default config;
