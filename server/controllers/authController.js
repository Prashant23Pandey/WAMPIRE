import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import ApiResponse from '../utils/apiResponse.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';
import { generateOTP, hashOTP, verifyOTPHash } from '../utils/otpUtils.js';
import config from '../config/env.js';

/**
 * Cookie options helper
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * SIGNUP
 * POST /api/auth/signup
 */
export const signup = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;

  // 1. Validate required fields & types (prevent NoSQL type confusion injection)
  if (
    !fullName || typeof fullName !== 'string' ||
    !email || typeof email !== 'string' ||
    !password || typeof password !== 'string' ||
    !confirmPassword || typeof confirmPassword !== 'string'
  ) {
    return next(new AppError('Please provide fullName, email, password, and confirmPassword.', 400));
  }

  // 2. Validate password confirmation
  if (password !== confirmPassword) {
    return next(new AppError('Passwords do not match.', 400));
  }

  // 3. Validate password strength
  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters long.', 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 4. Check whether email already exists
  const existingUser = await User.findOne({ email: normalizedEmail }).select('+password');

  if (existingUser && existingUser.isVerified) {
    return next(new AppError('An account with this email address already exists. Please log in.', 409));
  }

  // 5. Generate cryptographically secure 6-digit OTP
  const rawOtp = generateOTP();
  const hashedOtp = await hashOTP(rawOtp);
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // Exactly 10 minutes

  let user;

  if (existingUser && !existingUser.isVerified) {
    // If account exists but was never verified, update credentials & refresh OTP
    existingUser.fullName = fullName.trim();
    existingUser.password = password; // Will be hashed by pre-save hook
    existingUser.otpHash = hashedOtp;
    existingUser.otpExpiresAt = expiryTime;
    existingUser.otpAttempts = 0;
    existingUser.lastOtpSentAt = new Date();
    user = await existingUser.save();
  } else {
    // Create new unverified user
    user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password, // Hashed by pre-save hook
      isVerified: false,
      otpHash: hashedOtp,
      otpExpiresAt: expiryTime,
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
    });
  }

  // 6. Send OTP using Nodemailer
  let emailDispatched = true;
  try {
    await emailService.sendOtpVerificationEmail({
      email: user.email,
      fullName: user.fullName,
      otp: rawOtp,
    });
  } catch (err) {
    console.error('[Signup Email Error] Failed to send OTP email:', err.message);
    emailDispatched = false;
  }

  // 7. Return response instructing redirect to OTP verification
  if (!emailDispatched) {
    return ApiResponse.success(res, {
      statusCode: 201,
      message:
        'Account created, but we encountered an issue delivering your verification code email. Please click "Resend Code" on the verification screen.',
      data: {
        email: user.email,
        requiresVerification: true,
        emailSent: false,
        expiresIn: '10 minutes',
      },
    });
  }

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Signup successful! A 6-digit verification code has been dispatched to your email.',
    data: {
      email: user.email,
      requiresVerification: true,
      emailSent: true,
      expiresIn: '10 minutes',
    },
  });
});

/**
 * OTP VERIFICATION
 * POST /api/auth/verify-otp
 */
export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || typeof email !== 'string' || !otp || (typeof otp !== 'string' && typeof otp !== 'number')) {
    return next(new AppError('Please provide both email and OTP verification code.', 400));
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedOtp = otp.toString().trim();

  // 1. Find account with hidden OTP fields
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+otpHash +otpExpiresAt +otpAttempts'
  );

  if (!user) {
    return next(new AppError('Invalid verification request.', 400));
  }

  if (user.isVerified) {
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'Account is already verified. You may proceed to log in.',
      data: { isVerified: true },
    });
  }

  // 2. Check excessive invalid attempts
  if (user.otpAttempts >= 5) {
    return next(
      new AppError(
        'Too many failed verification attempts. Please request a new verification code.',
        400
      )
    );
  }

  // 3. Check OTP expiry
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return next(
      new AppError('Verification code has expired. Please request a new code.', 400)
    );
  }

  // 4. Verify OTP hash
  const isValid = await verifyOTPHash(normalizedOtp, user.otpHash);
  if (!isValid) {
    user.otpAttempts += 1;
    await user.save();
    return next(new AppError('Invalid verification code. Please check and try again.', 400));
  }

  // 5. Invalidate OTP and mark account as verified
  user.isVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  user.otpAttempts = 0;
  await user.save();

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Email verified successfully! You may now log in to WAMPIRE.',
    data: {
      email: user.email,
      isVerified: true,
    },
  });
});

/**
 * RESEND OTP
 * POST /api/auth/resend-otp
 */
export const resendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return next(new AppError('Please provide an email address.', 400));
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+otpHash +otpExpiresAt +lastOtpSentAt +otpAttempts'
  );

  // Protect against account enumeration where practical
  if (!user) {
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'If an unverified account exists for this email, a new code has been sent.',
    });
  }

  if (user.isVerified) {
    return next(new AppError('This account is already verified. Please proceed to login.', 400));
  }

  // 1. Resend cooldown enforcement (60 seconds)
  const now = Date.now();
  if (user.lastOtpSentAt) {
    const elapsedMs = now - user.lastOtpSentAt.getTime();
    const cooldownMs = 60 * 1000;
    if (elapsedMs < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
      return next(
        new AppError(`Please wait ${waitSeconds} seconds before requesting a new code.`, 429)
      );
    }
  }

  // 2. Generate and hash new OTP
  const rawOtp = generateOTP();
  const hashedOtp = await hashOTP(rawOtp);

  // 3. Invalidate previous OTP and set new expiry
  user.otpHash = hashedOtp;
  user.otpExpiresAt = new Date(now + 10 * 60 * 1000);
  user.lastOtpSentAt = new Date(now);
  user.otpAttempts = 0;
  await user.save();

  // 4. Send the new OTP
  try {
    await emailService.sendOtpVerificationEmail({
      email: user.email,
      fullName: user.fullName,
      otp: rawOtp,
    });

    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'A fresh 6-digit verification code has been dispatched to your email.',
      data: {
        email: user.email,
        emailSent: true,
        expiresIn: '10 minutes',
      },
    });
  } catch (err) {
    console.error('[Resend OTP Error] Failed to send email:', err.message);
    return next(new AppError('Failed to dispatch verification email. Please try again.', 500));
  }
});

/**
 * LOGIN
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return next(new AppError('Please provide both email and password.', 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Find user with password field
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    // Generic authentication error
    return next(new AppError('Invalid email or password credentials.', 401));
  }

  // 2. Verify account status
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Your account is not verified yet. Please complete email verification.',
      requiresVerification: true,
      email: user.email,
    });
  }

  // 3. Compare password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new AppError('Invalid email or password credentials.', 401));
  }

  // 4. Generate JWT
  const token = user.generateAuthToken();

  // 5. Set secure HTTP-only cookie
  res.cookie('token', token, getCookieOptions());

  const userData = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Login successful.',
    data: {
      user: userData,
      token,
    },
  });
});

/**
 * LOGOUT
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', getCookieOptions());
  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Logged out successfully.',
  });
});

export default {
  signup,
  verifyOtp,
  resendOtp,
  login,
  logout,
};
