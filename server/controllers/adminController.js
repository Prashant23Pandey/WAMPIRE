import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import ApiResponse from '../utils/apiResponse.js';
import { Admin, User, HackathonRegistration, Contact } from '../models/index.js';

export const adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return next(new AppError('Please provide both admin email and password.', 400));
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin || !admin.isActive) {
    return next(new AppError('Invalid credentials or account inactive.', 401));
  }

  const isMatched = await admin.comparePassword(password);
  if (!isMatched) {
    return next(new AppError('Invalid credentials or account inactive.', 401));
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = admin.generateAuthToken();

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Admin authorization granted.',
    data: {
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
      token,
    },
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalRegistrations, approvedRegistrations, pendingRegistrations, totalContacts] =
    await Promise.all([
      User.countDocuments(),
      HackathonRegistration.countDocuments(),
      HackathonRegistration.countDocuments({ registrationStatus: 'approved' }),
      HackathonRegistration.countDocuments({ registrationStatus: 'pending' }),
      Contact.countDocuments(),
    ]);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'System statistics fetched successfully.',
    data: {
      stats: {
        totalUsers,
        totalRegistrations,
        approvedRegistrations,
        pendingRegistrations,
        totalContacts,
      },
    },
  });
});

export default {
  adminLogin,
  getDashboardStats,
};

