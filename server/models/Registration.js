import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    institution: {
      type: String,
      required: [true, 'College or Organization name is required'],
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner (0-1 yrs)', 'Intermediate (1-3 yrs)', 'Advanced (3+ yrs)'],
      default: 'Intermediate (1-3 yrs)',
    },
    tShirtSize: {
      type: String,
      enum: ['S', 'M', 'L', 'XL', '2XL'],
      default: 'L',
    },
    dietaryRestrictions: {
      type: String,
      default: 'None',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'waitlisted', 'checked_in', 'rejected'],
      default: 'confirmed',
    },
    hasLaptop: {
      type: Boolean,
      default: true,
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;

