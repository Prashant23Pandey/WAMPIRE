import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { getConnectionStatus } from '../config/db.js';
import config from '../config/env.js';

export const getHealth = asyncHandler(async (req, res) => {
  const dbStatus = getConnectionStatus();

  const healthData = {
    status: 'online',
    service: 'CODE-A-NOVA API',
    version: '1.0.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
    database: {
      ...dbStatus,
    },
  };

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'CODE-A-NOVA API is running healthy',
    data: healthData,
  });
});

export default {
  getHealth,
};

