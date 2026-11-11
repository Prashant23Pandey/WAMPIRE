import app from './app.js';
import config from './config/env.js';
import connectDB from './config/db.js';

const startServer = async () => {
  console.log('='.repeat(50));
  console.log('    CODE-A-NOVA HACKATHON BACKEND SERVER');
  console.log('='.repeat(50));
  console.log(`[Config] Environment: ${config.env}`);
  console.log(`[Config] Port: ${config.port}`);

  // Connect to database (with resilient error capture)
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`[Server] Running successfully on http://localhost:${config.port}`);
    console.log(`[Server] Health Check available at http://localhost:${config.port}/api/v1/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[Process Error] Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('[Process Error] Uncaught Exception:', err);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n[Process] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();

