import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Team name must be at least 3 characters'],
      maxlength: [50, 'Team name cannot exceed 50 characters'],
    },
    joinCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team leader reference is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxSize: {
      type: Number,
      default: 4,
      min: 1,
      max: 5,
    },
    track: {
      type: String,
      enum: [
        'AI & Machine Learning',
        'Web3 & Decentralized Systems',
        'Cloud & DevOps Innovation',
        'FinTech & Cybersecurity',
        'HealthTech & Bio-Informatics',
        'Open Innovation',
      ],
      default: 'Open Innovation',
    },
    projectTitle: {
      type: String,
      trim: true,
      default: '',
    },
    projectDescription: {
      type: String,
      trim: true,
      default: '',
    },
    githubRepoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['forming', 'finalized', 'submitted'],
      default: 'forming',
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model('Team', teamSchema);
export default Team;

