import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import ApiResponse from '../utils/apiResponse.js';
import Registration from '../models/Registration.js';
import Team from '../models/Team.js';

export const createRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const existingRegistration = await Registration.findOne({ user: userId });
  if (existingRegistration) {
    return next(new AppError('You have already submitted your hackathon registration.', 409));
  }

  const {
    institution,
    graduationYear,
    experienceLevel,
    tShirtSize,
    dietaryRestrictions,
    hasLaptop,
    emergencyContact,
  } = req.body;

  if (!institution || !graduationYear) {
    return next(new AppError('Please provide your institution and graduation year.', 400));
  }

  // Check if user is already in a team
  const userTeam = await Team.findOne({ members: userId });

  const registration = await Registration.create({
    user: userId,
    team: userTeam ? userTeam._id : null,
    institution,
    graduationYear: parseInt(graduationYear, 10),
    experienceLevel: experienceLevel || 'Intermediate (1-3 yrs)',
    tShirtSize: tShirtSize || 'L',
    dietaryRestrictions: dietaryRestrictions || 'None',
    hasLaptop: hasLaptop !== undefined ? hasLaptop : true,
    emergencyContact: emergencyContact || { name: '', phone: '' },
    status: 'confirmed',
  });

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Hackathon registration submitted successfully!',
    data: {
      registration,
    },
  });
});

export const getMyRegistration = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const registration = await Registration.findOne({ user: userId })
    .populate('team')
    .populate('user', 'name email role avatar githubProfile linkedinProfile');

  return ApiResponse.success(res, {
    statusCode: 200,
    message: registration ? 'Registration details fetched.' : 'No registration found.',
    data: {
      isRegistered: Boolean(registration),
      registration: registration || null,
    },
  });
});

export const updateRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const registration = await Registration.findOne({ user: userId });
  if (!registration) {
    return next(new AppError('Registration record not found.', 404));
  }

  const allowedUpdates = [
    'institution',
    'graduationYear',
    'experienceLevel',
    'tShirtSize',
    'dietaryRestrictions',
    'hasLaptop',
    'emergencyContact',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      registration[field] = req.body[field];
    }
  });

  await registration.save();

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Registration updated successfully.',
    data: {
      registration,
    },
  });
});

export const getAllRegistrations = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [registrations, total] = await Promise.all([
    Registration.find(query)
      .populate('user', 'name email role githubProfile')
      .populate('team', 'name joinCode track status')
      .skip(skip)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 }),
    Registration.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'All registrations retrieved successfully.',
    data: {
      registrations,
    },
    meta: {
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

export default {
  createRegistration,
  getMyRegistration,
  updateRegistration,
  getAllRegistrations,
};

