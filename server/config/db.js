import mongoose from 'mongoose';
import config from './env.js';
import initializeDatabase from './initDB.js';

// Configure fast fail when offline instead of 10s buffering
mongoose.set('bufferTimeoutMS', 3000);

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
      serverSelectionTimeoutMS: 5000,
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
    console.warn('[MongoDB] Server will continue running, but database operations will fail until MongoDB is accessible.');
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
