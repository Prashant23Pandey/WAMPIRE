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

// Protect all hackathon participant routes with JWT
router.use(protect);

// Current participant endpoints
router.get('/my-entry', getMyRegistration);
router.post('/register', createRegistration);
router.patch('/my-entry', updateMyRegistration);
router.put('/my-entry', updateMyRegistration);
router.delete('/my-entry', deleteMyRegistration);

// Administrator endpoints
router.get('/all', authorize('admin', 'superadmin'), getAllRegistrations);
router.patch('/:id/status', authorize('admin', 'superadmin'), updateRegistrationStatus);

// Specific registration by ID endpoints
router.get('/:id', getRegistrationById);
router.patch('/:id', updateRegistrationById);
router.put('/:id', updateRegistrationById);
router.delete('/:id', deleteRegistration);

export default router;

