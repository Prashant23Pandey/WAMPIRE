import { Router } from 'express';
import { adminLogin, getDashboardStats } from '../controllers/adminController.js';
import {
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration,
} from '../controllers/hackathonRegistrationController.js';
import { getAllContacts } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Public Admin Auth
router.post('/login', adminLogin);

// Protected Admin Stats
router.get('/stats', protect, authorize('admin', 'superadmin'), getDashboardStats);

// Admin Registration Review & Management
router.get('/registrations', protect, authorize('admin', 'superadmin'), getAllRegistrations);
router.get('/registrations/:id', protect, authorize('admin', 'superadmin'), getRegistrationById);
router.patch('/registrations/:id/status', protect, authorize('admin', 'superadmin'), updateRegistrationStatus);
router.delete('/registrations/:id', protect, authorize('admin', 'superadmin'), deleteRegistration);

// Admin Contact Inquiries Review
router.get('/contacts', protect, authorize('admin', 'superadmin'), getAllContacts);

export default router;

