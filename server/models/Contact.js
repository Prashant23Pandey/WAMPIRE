import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Sender email address is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // Avoid duplicate updatedAt as only createdAt was requested
    versionKey: false,
  }
);

contactSchema.index({ email: 1, createdAt: -1 });

export const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
