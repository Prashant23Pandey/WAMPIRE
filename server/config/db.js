import mongoose from 'mongoose';
import config from './env.js';
import initializeDatabase from './initDB.js';
import { setupMockDbEngine, isMockEngineActive } from './mockDbEngine.js';

// Disable command buffering when disconnected to prevent timeout buffering errors
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 2000);

let isConnected = false;

export const connectDB = async (customUri = null) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('[MongoDB] Using existing database connection');
    return mongoose.connection;
  }

  const uri = customUri || config.mongoUri;
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: !config.isProduction, // Disable index builds on startup in production for performance
      maxPoolSize: 10,
      serverSelectionTimeoutMS: config.isProduction ? 5000 : 2000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connection.readyState === 1;

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Synchronize schema indexes upon connection
    await initializeDatabase();

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Runtime error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Connection restored');
      isConnected = true;
    });

    return conn;
  } catch (error) {
    isConnected = false;
    // Ensure credentials from connection strings are never leaked in error logs
    const safeErrorMessage = error.message.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.error(`[MongoDB Connection Error] ${safeErrorMessage}`);
    console.warn(`[MongoDB] Failed to connect to: ${sanitizedUri}`);

    // If running in development and MongoDB is offline, automatically activate in-memory engine
    if (!config.isProduction) {
      console.log('[MongoDB Fallback] Activating in-memory database engine for offline local development.');
      setupMockDbEngine();
    } else {
      console.warn('[MongoDB] Server will continue running, but database operations will fail until MongoDB is accessible.');
    }
    return null;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] Disconnected cleanly.');
  }
};

export const getConnectionStatus = () => {
  if (isMockEngineActive()) {
    return {
      state: 'connected (in-memory mock)',
      statusCode: 1,
      isConnected: true,
      host: 'localhost (in-memory mock)',
      name: 'wampire_mock',
    };
  }

  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'unknown',
    statusCode: stateCode,
    isConnected: stateCode === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

export default connectDB;
