import mongoose from 'mongoose';

// Subdocument Schema for individual team members
const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
      maxlength: [100, 'Team member name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Team member email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address for team member',
      ],
    },
    mobileNumber: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s]{8,15}$/, 'Please provide a valid contact number for team member'],
      default: '',
    },
    role: {
      type: String,
      trim: true,
      default: 'Developer',
    },
  },
  { _id: false }
);

const hackathonRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Registration must be associated with an authenticated user'],
      unique: true, // Prevents duplicate registrations per user account
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile contact number is required'],
      trim: true,
      match: [/^[0-9+\-\s]{8,15}$/, 'Please provide a valid 10-15 digit mobile number'],
    },
    collegeName: {
      type: String,
      required: [true, 'College / University name is required'],
      trim: true,
      maxlength: [150, 'College name cannot exceed 150 characters'],
      index: true,
    },
    course: {
      type: String,
      required: [true, 'Course / Degree program is required'],
      trim: true,
      maxlength: [60, 'Course cannot exceed 60 characters'],
    },
    branch: {
      type: String,
      required: [true, 'Department / Branch of study is required'],
      trim: true,
      maxlength: [80, 'Branch cannot exceed 80 characters'],
    },
    yearOfStudy: {
      type: String,
      required: [true, 'Current year of study is required'],
      trim: true,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year / Dual', 'Postgraduate'],
    },
    domain: {
      type: String,
      required: [true, 'Hackathon domain / track is required'],
      trim: true,
      maxlength: [100, 'Domain cannot exceed 100 characters'],
      index: true,
    },
    projectName: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [5, 'Project title must be at least 5 characters'],
      maxlength: [120, 'Project title cannot exceed 120 characters'],
    },
    pptLink: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$|^$/,
        'Please provide a valid presentation URL',
      ],
    },
    prototypeLink: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$|^$/,
        'Please provide a valid prototype URL',
      ],
    },
    demoVideoLink: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$|^$/,
        'Please provide a valid video demo URL',
      ],
    },
    teamSize: {
      type: Number,
      required: [true, 'Team size is required'],
      min: [1, 'Team size must be at least 1'],
      max: [5, 'Team size cannot exceed 5 members'],
      default: 1,
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: [],
      validate: {
        validator: function (members) {
          // If teamSize is > 1, ensure teamMembers contains teamSize - 1 additional members
          if (this.teamSize > 1) {
            if (members.length !== this.teamSize - 1) {
              return false;
            }
          } else {
            if (members.length > 0) {
              return false;
            }
          }
          // Check for unique emails among team members
          const emails = members.map((m) => m.email.toLowerCase());
          const uniqueEmails = new Set(emails);
          return uniqueEmails.size === emails.length;
        },
        message: 'Team members list must match team size (excluding the team leader) with unique emails.',
      },
    },
    registrationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'shortlisted'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Composite & single indexes for optimized lookup
hackathonRegistrationSchema.index({ domain: 1, registrationStatus: 1 });
hackathonRegistrationSchema.index({ createdAt: -1 });

export const HackathonRegistration = mongoose.model(
  'HackathonRegistration',
  hackathonRegistrationSchema
);
export default HackathonRegistration;
