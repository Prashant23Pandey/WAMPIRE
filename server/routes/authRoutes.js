import { Router } from 'express';
import { signup, verifyOtp, resendOtp, login, logout } from '../controllers/authController.js';
import { authLimiter, otpVerifyLimiter, resendCooldownLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authLimiter, signup);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.post('/resend-otp', resendCooldownLimiter, resendOtp);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

export default router;
