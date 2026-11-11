import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generates a cryptographically secure 6-digit OTP string (100000 - 999999).
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hashes a 6-digit OTP using bcrypt with salt rounds.
 */
export const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/**
 * Verifies a candidate OTP against a bcrypt OTP hash.
 */
export const verifyOTPHash = async (candidateOtp, storedHash) => {
  if (!candidateOtp || !storedHash) return false;
  return bcrypt.compare(candidateOtp, storedHash);
};

export default {
  generateOTP,
  hashOTP,
  verifyOTPHash,
};

