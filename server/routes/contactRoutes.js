import { Router } from 'express';
import { submitContact, getAllContacts } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Public submission
router.post('/', submitContact);

// Admin review
router.get('/', protect, authorize('admin'), getAllContacts);

export default router;

