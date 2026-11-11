import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from './env.js';
import { User, HackathonRegistration, Contact, Admin } from '../models/index.js';

// In-Memory Storage Engine for local offline testing
export const mockDb = {
  users: new Map(),
  registrations: new Map(),
  contacts: new Map(),
  admins: new Map(),
};

let isMockActive = false;

export function isMockEngineActive() {
  return isMockActive;
}

/**
 * Helper to apply population and field selection to documents in memory
 */
function applyTransforms(item, populateConfigs = [], selectedFields = null) {
  if (!item) return null;
  const clone = { ...item };

  // Handle populations
  for (const { field } of populateConfigs) {
    if (field === 'userId' && clone.userId) {
      const uIdStr = clone.userId._id ? clone.userId._id.toString() : clone.userId.toString();
      const user = mockDb.users.get(uIdStr);
      if (user) {
        clone.userId = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        };
      }
    }
  }

  // Handle field selection
  if (selectedFields && typeof selectedFields === 'string') {
    const fields = selectedFields.trim().split(/\s+/);
    const exclusions = fields.filter((f) => f.startsWith('-')).map((f) => f.substring(1));
    const inclusions = fields.filter((f) => !f.startsWith('-') && !f.startsWith('+'));

    for (const excl of exclusions) {
      delete clone[excl];
    }

    if (inclusions.length > 0) {
      const filtered = { _id: clone._id };
      for (const inc of inclusions) {
        if (clone[inc] !== undefined) filtered[inc] = clone[inc];
      }
      return filtered;
    }
  }

  return clone;
}

/**
 * Creates a fully-chainable Mongoose Query mock
 */
function createMockQuery(getResultFn) {
  const populateList = [];
  let selectFields = null;

  const queryObj = {
    populate(field, select) {
      populateList.push({ field, select });
      return queryObj;
    },
    select(fields) {
      selectFields = fields;
      return queryObj;
    },
    sort() {
      return queryObj;
    },
    skip() {
      return queryObj;
    },
    limit() {
      return queryObj;
    },
    lean() {
      return queryObj;
    },
    async exec() {
      const raw = await getResultFn();
      if (Array.isArray(raw)) {
        return raw.map((item) => applyTransforms(item, populateList, selectFields));
      }
      return applyTransforms(raw, populateList, selectFields);
    },
    then(resolve, reject) {
      return queryObj.exec().then(resolve, reject);
    },
    catch(reject) {
      return queryObj.exec().catch(reject);
    },
  };

  return queryObj;
}

export function setupMockDbEngine() {
  if (isMockActive) return;
  isMockActive = true;

  console.log('='.repeat(60));
  console.log(' [Database Engine] MONGODB OFFLINE - IN-MEMORY ENGINE ACTIVE');
  console.log(' All signups, OTP verifications, logins, and registrations');
  console.log(' will persist in memory for seamless local testing.');
  console.log('='.repeat(60));

  // Pre-seed an Administrator
  const adminId = new mongoose.Types.ObjectId();
  const adminPasswordHash = bcrypt.hashSync('AdminAudit2026!', 10);
  const testAdmin = {
    _id: adminId,
    fullName: 'System Administrator',
    email: 'admin@wampire.io',
    password: adminPasswordHash,
    role: 'admin',
    isActive: true,
    comparePassword: async function (candidate) {
      return bcrypt.compare(candidate, this.password);
    },
    generateAuthToken: function () {
      return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
    },
    save: async function () {
      mockDb.admins.set(this._id.toString(), this);
      return this;
    },
  };
  mockDb.admins.set(adminId.toString(), testAdmin);

  // --- 1. USER MODEL INTERCEPTORS ---
  User.findOne = function (query = {}) {
    return createMockQuery(() => {
      for (const u of mockDb.users.values()) {
        if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return u;
        if (query._id && u._id.toString() === query._id.toString()) return u;
      }
      return null;
    });
  };

  User.findById = function (id) {
    return createMockQuery(() => {
      const idStr = id ? id.toString() : '';
      return mockDb.users.get(idStr) || null;
    });
  };

  User.find = function () {
    return createMockQuery(() => Array.from(mockDb.users.values()));
  };

  User.countDocuments = async function () {
    return mockDb.users.size;
  };

  User.create = async function (data) {
    const id = new mongoose.Types.ObjectId();
    const isPlainPass = !data.password || !data.password.startsWith('$2');
    const hashedPass = isPlainPass ? await bcrypt.hash(data.password, 10) : data.password;

    const userDoc = {
      _id: id,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      password: hashedPass,
      isVerified: Boolean(data.isVerified),
      otpHash: data.otpHash || null,
      otpExpiresAt: data.otpExpiresAt || null,
      otpAttempts: data.otpAttempts || 0,
      lastOtpSentAt: data.lastOtpSentAt || new Date(),
      role: data.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function (candidate) {
        return bcrypt.compare(candidate, this.password);
      },
      generateAuthToken: function () {
        return jwt.sign(
          { id: this._id, email: this.email, role: this.role },
          config.jwt.secret,
          { expiresIn: config.jwt.expiresIn }
        );
      },
      save: async function () {
        if (this.password && !this.password.startsWith('$2')) {
          this.password = await bcrypt.hash(this.password, 10);
        }
        this.updatedAt = new Date();
        mockDb.users.set(this._id.toString(), this);
        return this;
      },
    };
    mockDb.users.set(id.toString(), userDoc);
    return userDoc;
  };

  // --- 2. HACKATHON REGISTRATION INTERCEPTORS ---
  HackathonRegistration.findOne = function (query = {}) {
    return createMockQuery(() => {
      for (const reg of mockDb.registrations.values()) {
        if (query.userId && reg.userId.toString() === query.userId.toString()) {
          return reg;
        }
        if (query._id && reg._id.toString() === query._id.toString()) {
          return reg;
        }
      }
      return null;
    });
  };

  HackathonRegistration.findById = function (id) {
    return createMockQuery(() => {
      const idStr = id ? id.toString() : '';
      return mockDb.registrations.get(idStr) || null;
    });
  };

  HackathonRegistration.create = async function (data) {
    const id = new mongoose.Types.ObjectId();
    const regDoc = {
      _id: id,
      ...data,
      registrationStatus: data.registrationStatus || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () {
        this.updatedAt = new Date();
        mockDb.registrations.set(this._id.toString(), this);
        return this;
      },
    };
    mockDb.registrations.set(id.toString(), regDoc);
    return regDoc;
  };

  HackathonRegistration.find = function (filter = {}) {
    return createMockQuery(() => {
      let list = Array.from(mockDb.registrations.values());
      if (filter.domain) list = list.filter((r) => r.domain === filter.domain);
      if (filter.registrationStatus) {
        list = list.filter((r) => r.registrationStatus === filter.registrationStatus);
      }
      return list;
    });
  };

  HackathonRegistration.countDocuments = async function (filter = {}) {
    let list = Array.from(mockDb.registrations.values());
    if (filter.domain) list = list.filter((r) => r.domain === filter.domain);
    if (filter.registrationStatus) {
      list = list.filter((r) => r.registrationStatus === filter.registrationStatus);
    }
    return list.length;
  };

  HackathonRegistration.findByIdAndUpdate = async function (id, updates) {
    const idStr = id ? id.toString() : '';
    const reg = mockDb.registrations.get(idStr);
    if (!reg) return null;
    if (updates.registrationStatus) reg.registrationStatus = updates.registrationStatus;
    reg.updatedAt = new Date();
    mockDb.registrations.set(idStr, reg);
    return reg;
  };

  HackathonRegistration.findByIdAndDelete = async function (id) {
    const idStr = id ? id.toString() : '';
    const reg = mockDb.registrations.get(idStr);
    if (reg) mockDb.registrations.delete(idStr);
    return reg;
  };

  // --- 3. CONTACT MODEL INTERCEPTORS ---
  Contact.create = async function (data) {
    const id = new mongoose.Types.ObjectId();
    const doc = { _id: id, ...data, createdAt: new Date() };
    mockDb.contacts.set(id.toString(), doc);
    return doc;
  };

  Contact.find = function () {
    return createMockQuery(() => Array.from(mockDb.contacts.values()));
  };

  Contact.countDocuments = async function () {
    return mockDb.contacts.size;
  };

  // --- 4. ADMIN MODEL INTERCEPTORS ---
  Admin.findOne = function (query = {}) {
    return createMockQuery(() => {
      for (const admin of mockDb.admins.values()) {
        if (query.email && admin.email.toLowerCase() === query.email.toLowerCase()) return admin;
      }
      return null;
    });
  };

  Admin.findById = function (id) {
    return createMockQuery(() => {
      const idStr = id ? id.toString() : '';
      return mockDb.admins.get(idStr) || null;
    });
  };
}

export default setupMockDbEngine;

