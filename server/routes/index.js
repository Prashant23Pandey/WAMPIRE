import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import hackathonRoutes from './hackathonRoutes.js';
import contactRoutes from './contactRoutes.js';
import adminRoutes from './adminRoutes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/hackathon', hackathonRoutes);
apiRouter.use('/registrations', hackathonRoutes); // Backward compatibility alias
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
