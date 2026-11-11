import { Router } from 'express';
import {
  createRegistration,
  getMyRegistration,
  updateMyRegistration,
  deleteMyRegistration,
  getRegistrationById,
  updateRegistrationById,
  deleteRegistration,
  getAllRegistrations,
  updateRegistrationStatus,
} from '../controllers/hackathonRegistrationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Participant Routes (Protected)
router.use(protect);

router.post('/', createRegistration);
router.get('/me', getMyRegistration);
router.patch('/me', updateMyRegistration);
router.delete('/me', deleteMyRegistration);

// Admin Routes
router.get('/', authorize('admin', 'superadmin'), getAllRegistrations);
router.patch('/:id/status', authorize('admin', 'superadmin'), updateRegistrationStatus);

// Specific registration by ID
router.get('/:id', getRegistrationById);
router.patch('/:id', updateRegistrationById);
router.delete('/:id', deleteRegistration);

export default router;

