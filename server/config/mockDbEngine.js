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
    email: 'admin@codeanova.io',
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
  User.findOne = function (query) {
    const findUser = () => {
      for (const u of mockDb.users.values()) {
        if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return u;
        if (query._id && u._id.toString() === query._id.toString()) return u;
      }
      return null;
    };

    return {
      select: function (fields) {
        const u = findUser();
        if (!u) return Promise.resolve(null);
        return Promise.resolve(u);
      },
      then: function (resolve) {
        return resolve(findUser());
      },
    };
  };

  User.findById = function (id) {
    const idStr = id ? id.toString() : '';
    const found = mockDb.users.get(idStr) || null;
    return {
      select: function (fields) {
        if (!found) return Promise.resolve(null);
        const copy = { ...found };
        if (fields && fields.includes('-password')) {
          delete copy.password;
          delete copy.otpHash;
          delete copy.otpExpiresAt;
        }
        return Promise.resolve(copy);
      },
      then: function (resolve) {
        return resolve(found);
      },
    };
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
  HackathonRegistration.findOne = function (query) {
    let match = null;
    for (const reg of mockDb.registrations.values()) {
      if (query.userId && reg.userId.toString() === query.userId.toString()) {
        match = reg;
        break;
      }
      if (query._id && reg._id.toString() === query._id.toString()) {
        match = reg;
        break;
      }
    }
    return Promise.resolve(match);
  };

  HackathonRegistration.findById = function (id) {
    const idStr = id ? id.toString() : '';
    const reg = mockDb.registrations.get(idStr) || null;
    return {
      populate: function () {
        if (!reg) return Promise.resolve(null);
        const owner = mockDb.users.get(reg.userId.toString());
        const copy = { ...reg, userId: owner || reg.userId };
        return Promise.resolve(copy);
      },
      then: function (resolve) {
        return resolve(reg);
      },
    };
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
    let list = Array.from(mockDb.registrations.values());
    if (filter.domain) list = list.filter((r) => r.domain === filter.domain);
    if (filter.registrationStatus) list = list.filter((r) => r.registrationStatus === filter.registrationStatus);

    return {
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(list),
          }),
        }),
      }),
      sort: () => ({
        skip: () => ({
          limit: () => Promise.resolve(list),
        }),
      }),
    };
  };

  HackathonRegistration.countDocuments = async function () {
    return mockDb.registrations.size;
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

  Contact.countDocuments = async function () {
    return mockDb.contacts.size;
  };

  // --- 4. ADMIN MODEL INTERCEPTORS ---
  Admin.findOne = function (query) {
    return {
      select: function () {
        for (const admin of mockDb.admins.values()) {
          if (query.email && admin.email.toLowerCase() === query.email.toLowerCase()) return Promise.resolve(admin);
        }
        return Promise.resolve(null);
      },
    };
  };

  Admin.findById = function (id) {
    const idStr = id ? id.toString() : '';
    const admin = mockDb.admins.get(idStr) || null;
    return {
      select: function () {
        return Promise.resolve(admin);
      },
    };
  };
}

export default setupMockDbEngine;
