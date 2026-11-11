import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.put('/update', updateProfile);

export default router;

