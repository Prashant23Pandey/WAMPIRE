import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check Authorization Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to HTTP-only cookie if available
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError('Authentication required. Please log in to access this resource.', 401)
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid authentication token. Please log in again.', 401));
  }

  // Lookup in User collection
  let currentUser = await User.findById(decoded.id).select('-password -otpHash -otpExpiresAt');

  // If not found in User, inspect Admin collection
  if (!currentUser) {
    const adminUser = await Admin.findById(decoded.id).select('-password');
    if (adminUser && adminUser.isActive) {
      req.user = adminUser;
      return next();
    }
    return next(new AppError('The account associated with this token no longer exists.', 401));
  }

  if (!currentUser.isVerified && currentUser.role !== 'admin') {
    return next(
      new AppError('Your account has not been verified yet. Please complete OTP verification.', 403)
    );
  }

  req.user = currentUser;
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not possess the required permissions.', 403));
    }
    next();
  };
};

export default {
  protect,
  authorize,
};
