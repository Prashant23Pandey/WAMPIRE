import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import ApiResponse from '../utils/apiResponse.js';
import Contact from '../models/Contact.js';

export const submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError('Please provide name, email, and message.', 400));
  }

  if (message.trim().length < 10) {
    return next(new AppError('Message must be at least 10 characters long.', 400));
  }

  const contactEntry = await Contact.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  });

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Your inquiry has been received. The team will be in touch shortly.',
    data: {
      contact: contactEntry,
    },
  });
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [contacts, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
    Contact.countDocuments(),
  ]);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Contacts retrieved successfully.',
    data: {
      contacts,
    },
    meta: {
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

export default {
  submitContact,
  getAllContacts,
};

