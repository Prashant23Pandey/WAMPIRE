import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import ApiResponse from '../utils/apiResponse.js';
import User from '../models/User.js';

/**
 * GET /api/user/me
 * Returns current authenticated user
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -otpHash -otpExpiresAt');

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'User profile retrieved successfully.',
    data: {
      user,
    },
  });
});

/**
 * PUT /api/user/update
 * Updates user profile details or changes password
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { fullName, currentPassword, newPassword, confirmNewPassword } = req.body;

  let user = await User.findById(req.user._id).select('+password');
  let isAdminModel = false;

  if (!user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    const AdminModel = (await import('../models/Admin.js')).default;
    user = await AdminModel.findById(req.user._id).select('+password');
    isAdminModel = true;
  }

  if (!user) {
    return next(new AppError('User account not found.', 404));
  }

  // Handle name update with strict validation
  if (fullName !== undefined) {
    const trimmed = typeof fullName === 'string' ? fullName.trim() : '';
    if (trimmed.length < 3) {
      return next(new AppError('Full name must be at least 3 characters long.', 400));
    }
    if (!/^[a-zA-Z\s]{3,100}$/.test(trimmed)) {
      return next(new AppError('Full name must contain letters and permitted spaces only.', 400));
    }
    user.fullName = trimmed;
  }

  // Handle password update if supplied
  if (currentPassword || newPassword || confirmNewPassword) {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(
        new AppError(
          'To change your password, please provide currentPassword, newPassword, and confirmNewPassword.',
          400
        )
      );
    }

    if (newPassword !== confirmNewPassword) {
      return next(new AppError('New password and confirmation do not match.', 400));
    }

    if (newPassword.length < 8) {
      return next(new AppError('New password must be at least 8 characters long.', 400));
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new AppError('Current password provided is incorrect.', 400));
    }

    user.password = newPassword; // Will be hashed by pre-save hook
  }

  await user.save();

  const sanitizedUser = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: isAdminModel ? true : user.isVerified,
    updatedAt: user.updatedAt,
  };

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Profile updated successfully.',
    data: {
      user: sanitizedUser,
    },
  });
});

export default {
  getMe,
  updateProfile,
};

