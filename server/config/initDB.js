import mongoose from 'mongoose';
import { User, HackathonRegistration, Contact, Admin } from '../models/index.js';

/**
 * Initializes database indexes and validates schema configurations.
 */
export const initializeDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('[DB Init] MongoDB connection is not active. Skipping index synchronization.');
    return false;
  }

  try {
    console.log('[DB Init] Synchronizing schema indexes across all collections...');

    await Promise.all([
      User.syncIndexes(),
      HackathonRegistration.syncIndexes(),
      Contact.syncIndexes(),
      Admin.syncIndexes(),
    ]);

    console.log('[DB Init] All database indexes synchronized successfully.');
    return true;
  } catch (error) {
    console.error('[DB Init Error] Failed to synchronize indexes:', error.message);
    return false;
  }
};

export default initializeDatabase;

