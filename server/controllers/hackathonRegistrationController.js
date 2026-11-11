import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import ApiResponse from '../utils/apiResponse.js';
import HackathonRegistration from '../models/HackathonRegistration.js';
import emailService from '../services/emailService.js';

export const createRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Prevent duplicate registration for the authenticated user
  const existingRegistration = await HackathonRegistration.findOne({ userId });
  if (existingRegistration) {
    return next(
      new AppError(
        'You have already submitted a hackathon registration. Duplicate registrations are not permitted.',
        409
      )
    );
  }

  const {
    fullName,
    email,
    mobileNumber,
    collegeName,
    course,
    branch,
    yearOfStudy,
    domain,
    projectName,
    pptLink,
    prototypeLink,
    demoVideoLink,
    teamSize,
    teamMembers,
  } = req.body;

  // Field validations
  if (
    !fullName ||
    !email ||
    !mobileNumber ||
    !collegeName ||
    !course ||
    !branch ||
    !yearOfStudy ||
    !domain ||
    !projectName ||
    !pptLink ||
    !prototypeLink
  ) {
    return next(new AppError('Please fill out all required hackathon registration fields including presentation and prototype links.', 400));
  }

  // Name validation: letters and spaces only, min 3
  const trimmedName = fullName.trim();
  if (!/^[a-zA-Z\s]{3,100}$/.test(trimmedName)) {
    return next(new AppError('Full name must be at least 3 characters and contain letters and permitted spaces only.', 400));
  }

  // Mobile number validation: exactly 10 digits Indian mobile number
  const trimmedMobile = mobileNumber.trim();
  if (!/^[6-9]\d{9}$/.test(trimmedMobile)) {
    return next(new AppError('Please provide a valid 10-digit Indian mobile number (e.g., 9876543210).', 400));
  }

  // Project name validation: min 5 characters
  const trimmedProjectName = projectName.trim();
  if (trimmedProjectName.length < 5) {
    return next(new AppError('Project name must be at least 5 characters long.', 400));
  }

  // URL format validations for presentation and prototype links
  const isValidHttpUrl = (str) => {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  if (!isValidHttpUrl(pptLink.trim())) {
    return next(
      new AppError(
        'Please provide a valid presentation URL starting with http:// or https:// (e.g., Google Drive or OneDrive link).',
        400
      )
    );
  }

  if (!isValidHttpUrl(prototypeLink.trim())) {
    return next(
      new AppError(
        'Please provide a valid prototype URL starting with http:// or https:// (e.g., GitHub, Figma, or live demonstration link).',
        400
      )
    );
  }

  if (demoVideoLink && demoVideoLink.trim() && !isValidHttpUrl(demoVideoLink.trim())) {
    return next(new AppError('Please provide a valid video demonstration URL.', 400));
  }

  const parsedTeamSize = parseInt(teamSize || 1, 10);
  if (parsedTeamSize < 1 || parsedTeamSize > 5) {
    return next(new AppError('Team size must be between 1 and 5 members.', 400));
  }

  const parsedTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];

  // Team validation
  if (parsedTeamSize > 1) {
    if (parsedTeamMembers.length !== parsedTeamSize - 1) {
      return next(
        new AppError(
          `For a team size of ${parsedTeamSize}, you must specify exactly ${parsedTeamSize - 1} additional squad members.`,
          400
        )
      );
    }

    const memberEmails = new Set();
    const leadEmail = email.trim().toLowerCase();

    for (let i = 0; i < parsedTeamMembers.length; i++) {
      const m = parsedTeamMembers[i];
      if (!m.name || !/^[a-zA-Z\s]{3,100}$/.test(m.name.trim())) {
        return next(
          new AppError(`Team member #${i + 2} name must be at least 3 characters and contain letters only.`, 400)
        );
      }
      if (!m.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
        return next(
          new AppError(`Team member #${i + 2} email is invalid.`, 400)
        );
      }

      const mEmail = m.email.trim().toLowerCase();
      if (mEmail === leadEmail) {
        return next(new AppError(`Team member #${i + 2} email cannot be the same as the team leader's email.`, 400));
      }
      if (memberEmails.has(mEmail)) {
        return next(new AppError(`Duplicate email detected among team members: ${mEmail}`, 400));
      }
      memberEmails.add(mEmail);
    }
  }

  const registration = await HackathonRegistration.create({
    userId,
    fullName: trimmedName,
    email: email.trim().toLowerCase(),
    mobileNumber: trimmedMobile,
    collegeName: collegeName.trim(),
    course: course.trim(),
    branch: branch.trim(),
    yearOfStudy,
    domain: domain.trim(),
    projectName: trimmedProjectName,
    pptLink: pptLink.trim(),
    prototypeLink: prototypeLink.trim(),
    demoVideoLink: demoVideoLink ? demoVideoLink.trim() : '',
    teamSize: parsedTeamSize,
    teamMembers: parsedTeamMembers,
    registrationStatus: 'pending',
  });

  // Trigger EMAIL 2: REGISTRATION CONFIRMATION
  let emailDispatched = true;
  try {
    await emailService.sendRegistrationConfirmationEmail({
      email: registration.email,
      participantName: registration.fullName,
      registrationId: registration._id,
      collegeName: registration.collegeName,
      domain: registration.domain,
      projectName: registration.projectName,
      teamSize: registration.teamSize,
      teamMembers: registration.teamMembers,
    });
  } catch (err) {
    console.error('[Hackathon Registration Email Error]:', err.message);
    emailDispatched = false;
  }

  const formattedRegistrationId = `WAM-REG-${registration._id.toString().slice(-8).toUpperCase()}`;

  return ApiResponse.success(res, {
    statusCode: 201,
    message: emailDispatched
      ? 'Hackathon registration submitted successfully! A confirmation email has been dispatched.'
      : 'Hackathon registration submitted successfully, but email confirmation delivery could not be completed.',
    data: {
      registration,
      registrationId: formattedRegistrationId,
      emailConfirmationSent: emailDispatched,
    },
  });
});

export const getMyRegistration = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const registration = await HackathonRegistration.findOne({ userId });

  return ApiResponse.success(res, {
    statusCode: 200,
    message: registration ? 'Registration fetched successfully.' : 'No active registration found.',
    data: {
      isRegistered: Boolean(registration),
      registration: registration || null,
    },
  });
});

export const updateMyRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const registration = await HackathonRegistration.findOne({ userId });
  if (!registration) {
    return next(new AppError('No registration record found to update.', 404));
  }

  // If already approved, prevent changing team members
  if (registration.registrationStatus === 'approved') {
    return next(
      new AppError('Approved registrations cannot be modified. Please contact event organizers.', 403)
    );
  }

  const updateFields = [
    'mobileNumber',
    'collegeName',
    'course',
    'branch',
    'yearOfStudy',
    'domain',
    'projectName',
    'pptLink',
    'prototypeLink',
    'demoVideoLink',
  ];

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      registration[field] = req.body[field];
    }
  });

  await registration.save();

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Hackathon registration updated successfully.',
    data: {
      registration,
    },
  });
});

export const getAllRegistrations = asyncHandler(async (req, res) => {
  const { domain, status, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (domain) filter.domain = domain;
  if (status) filter.registrationStatus = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { projectName: { $regex: search, $options: 'i' } },
      { collegeName: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [registrations, total] = await Promise.all([
    HackathonRegistration.find(filter)
      .populate('userId', 'fullName email isVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),
    HackathonRegistration.countDocuments(filter),
  ]);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Registrations retrieved successfully.',
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

export const updateRegistrationStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected', 'shortlisted'];
  if (!status || !validStatuses.includes(status)) {
    return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
  }

  const registration = await HackathonRegistration.findByIdAndUpdate(
    id,
    { registrationStatus: status },
    { new: true, runValidators: true }
  );

  if (!registration) {
    return next(new AppError('Registration not found.', 404));
  }

  return ApiResponse.success(res, {
    statusCode: 200,
    message: `Registration status updated to ${status}.`,
    data: {
      registration,
    },
  });
});

export const getRegistrationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid registration ID format.', 400));
  }

  const registration = await HackathonRegistration.findById(id).populate(
    'userId',
    'fullName email isVerified createdAt'
  );

  if (!registration) {
    return next(new AppError('Hackathon registration record not found.', 404));
  }

  const isAdmin = user.role === 'admin' || user.role === 'superadmin';
  const ownerId = registration.userId?._id
    ? registration.userId._id.toString()
    : registration.userId?.toString();
  const isOwner = ownerId === user._id.toString();

  // Security check: Must be owner or admin
  if (!isOwner && !isAdmin) {
    return next(
      new AppError('Access denied: You are not authorized to view another participant\'s registration.', 403)
    );
  }

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Registration retrieved successfully.',
    data: {
      registration,
    },
  });
});

export const updateRegistrationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid registration ID format.', 400));
  }

  const registration = await HackathonRegistration.findById(id);
  if (!registration) {
    return next(new AppError('Hackathon registration record not found.', 404));
  }

  const isAdmin = user.role === 'admin' || user.role === 'superadmin';
  const ownerId = registration.userId?._id
    ? registration.userId._id.toString()
    : registration.userId?.toString();
  const isOwner = ownerId === user._id.toString();

  // Security check: Must be owner or admin
  if (!isOwner && !isAdmin) {
    return next(
      new AppError('Access denied: You are not authorized to modify another participant\'s registration.', 403)
    );
  }

  // Registration Policy check: Non-admins cannot edit approved registrations
  if (!isAdmin && registration.registrationStatus === 'approved') {
    return next(
      new AppError('Policy restriction: Approved registrations cannot be modified. Please contact event organizers.', 403)
    );
  }

  const updateFields = [
    'mobileNumber',
    'collegeName',
    'course',
    'branch',
    'yearOfStudy',
    'domain',
    'projectName',
    'pptLink',
    'prototypeLink',
    'demoVideoLink',
  ];

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      registration[field] = req.body[field];
    }
  });

  if (isAdmin && req.body.registrationStatus !== undefined) {
    registration.registrationStatus = req.body.registrationStatus;
  }

  await registration.save();

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Hackathon registration updated successfully.',
    data: {
      registration,
    },
  });
});

export const deleteRegistration = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid registration ID format.', 400));
  }

  const registration = await HackathonRegistration.findById(id);
  if (!registration) {
    return next(new AppError('Hackathon registration record not found.', 404));
  }

  const isAdmin = user.role === 'admin' || user.role === 'superadmin';
  const ownerId = registration.userId?._id
    ? registration.userId._id.toString()
    : registration.userId?.toString();
  const isOwner = ownerId === user._id.toString();

  // Security check: Must be owner or admin
  if (!isOwner && !isAdmin) {
    return next(
      new AppError('Access denied: You are not authorized to delete another participant\'s registration.', 403)
    );
  }

  // Policy check: Participants cannot delete approved registrations
  if (!isAdmin && registration.registrationStatus === 'approved') {
    return next(
      new AppError(
        'Policy restriction: Approved hackathon registrations cannot be deleted. Please contact the hackathon administration team.',
        403
      )
    );
  }

  await HackathonRegistration.findByIdAndDelete(id);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: isAdmin
      ? 'Hackathon registration deleted successfully by administrator.'
      : 'Your hackathon registration has been withdrawn and deleted successfully.',
    data: null,
  });
});

export const deleteMyRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const registration = await HackathonRegistration.findOne({ userId });
  if (!registration) {
    return next(new AppError('No active hackathon registration found for your account.', 404));
  }

  if (registration.registrationStatus === 'approved') {
    return next(
      new AppError(
        'Policy restriction: Approved hackathon registrations cannot be deleted. Please contact the hackathon administration team.',
        403
      )
    );
  }

  await HackathonRegistration.findByIdAndDelete(registration._id);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Your hackathon registration has been withdrawn and deleted successfully.',
    data: null,
  });
});

export default {
  createRegistration,
  getMyRegistration,
  updateMyRegistration,
  deleteMyRegistration,
  getRegistrationById,
  updateRegistrationById,
  deleteRegistration,
  getAllRegistrations,
  updateRegistrationStatus,
};

