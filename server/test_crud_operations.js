/**
 * CODE-A-NOVA Comprehensive CRUD & Security Integration Test Suite
 * Acts as an automated API Client (like Postman) testing all routes:
 * AUTH, USER, HACKATHON, CONTACT, ADMIN, OWNERSHIP & SECURITY POLICIES.
 */

import assert from 'node:assert';
import http from 'node:http';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from './app.js';
import config from './config/env.js';
import { User, HackathonRegistration, Contact, Admin } from './models/index.js';

console.log('='.repeat(70));
console.log('       CODE-A-NOVA COMPREHENSIVE CRUD & SECURITY TEST SUITE');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

function testAssert(condition, name, details = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

// In-Memory Test State
const mockDb = {
  users: new Map(),
  registrations: new Map(),
  contacts: new Map(),
  admins: new Map(),
};

function setupMockInterceptors() {
  // If MongoDB is not connected, route queries to in-memory store
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    console.log('[Test Setup] Active MongoDB connection detected. Using real database.');
    return;
  }

  console.log('[Test Setup] MongoDB is offline. Enabling in-memory query interceptors for test isolation.');

  // Pre-populate an admin user
  const adminId = new mongoose.Types.ObjectId();
  const adminHashedPass = bcrypt.hashSync('AdminSecure2026!', 10);
  const testAdmin = {
    _id: adminId,
    fullName: 'System Administrator',
    email: 'admin@codeanova.io',
    password: adminHashedPass,
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

  // User intercepts
  User.findOne = function (query) {
    return {
      select: function () {
        for (const user of mockDb.users.values()) {
          if (query.email && user.email === query.email.toLowerCase()) return Promise.resolve(user);
        }
        return Promise.resolve(null);
      },
      then: function (resolve) {
        for (const user of mockDb.users.values()) {
          if (query.email && user.email === query.email.toLowerCase()) return resolve(user);
        }
        return resolve(null);
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
    const hashedPass = await bcrypt.hash(data.password, 10);
    const userDoc = {
      _id: id,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      password: hashedPass,
      isVerified: Boolean(data.isVerified),
      otpHash: data.otpHash || null,
      otpExpiresAt: data.otpExpiresAt || null,
      otpAttempts: 0,
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
        mockDb.users.set(this._id.toString(), this);
        return this;
      },
    };
    mockDb.users.set(id.toString(), userDoc);
    return userDoc;
  };

  // HackathonRegistration intercepts
  HackathonRegistration.findOne = function (query) {
    let match = null;
    for (const reg of mockDb.registrations.values()) {
      if (query.userId && reg.userId.toString() === query.userId.toString()) {
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
        return Promise.resolve(reg);
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
        mockDb.registrations.set(this._id.toString(), this);
        return this;
      },
    };
    mockDb.registrations.set(id.toString(), regDoc);
    return regDoc;
  };

  HackathonRegistration.findByIdAndUpdate = async function (id, updates) {
    const reg = mockDb.registrations.get(id.toString());
    if (!reg) return null;
    if (updates.registrationStatus) reg.registrationStatus = updates.registrationStatus;
    mockDb.registrations.set(id.toString(), reg);
    return reg;
  };

  HackathonRegistration.findByIdAndDelete = async function (id) {
    const reg = mockDb.registrations.get(id.toString());
    if (reg) mockDb.registrations.delete(id.toString());
    return reg;
  };

  HackathonRegistration.find = function () {
    const list = Array.from(mockDb.registrations.values());
    return {
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(list),
          }),
        }),
      }),
    };
  };

  HackathonRegistration.countDocuments = async function () {
    return mockDb.registrations.size;
  };

  // Contact intercepts
  Contact.create = async function (data) {
    const id = new mongoose.Types.ObjectId();
    const contactDoc = { _id: id, ...data, createdAt: new Date() };
    mockDb.contacts.set(id.toString(), contactDoc);
    return contactDoc;
  };

  Contact.find = function () {
    const list = Array.from(mockDb.contacts.values());
    return {
      sort: () => ({
        skip: () => ({
          limit: () => Promise.resolve(list),
        }),
      }),
    };
  };

  Contact.countDocuments = async function () {
    return mockDb.contacts.size;
  };

  // Admin intercepts
  Admin.findOne = function (query) {
    return {
      select: function () {
        for (const admin of mockDb.admins.values()) {
          if (query.email && admin.email === query.email.toLowerCase()) return Promise.resolve(admin);
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

// Helper to make HTTP requests
async function request(baseUrl, endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { status: response.status, data };
}

async function runAllCrudTests() {
  setupMockInterceptors();

  const PORT = 5005;
  const baseUrl = `http://127.0.0.1:${PORT}`;

  const server = app.listen(PORT, async () => {
    console.log(`[Test Client] API server live on ${baseUrl}`);

    try {
      // =========================================================================
      // 1. PUBLIC ROOT DISCOVERY & API INFO
      // =========================================================================
      console.log('\n--- 1. Testing GET / Root API Discovery ---');
      const rootRes = await request(baseUrl, '/');
      testAssert(rootRes.status === 200, 'GET / returns 200 OK');
      testAssert(rootRes.data.endpoints.auth.signup === 'POST /api/auth/signup', 'Root discovery lists Auth signup endpoint');
      testAssert(rootRes.data.endpoints.hackathon.deleteById === 'DELETE /api/hackathon/:id', 'Root discovery lists Hackathon delete endpoint');

      // =========================================================================
      // 2. AUTH CRUD: SIGNUP, OTP VERIFY, LOGIN
      // =========================================================================
      console.log('\n--- 2. Testing AUTH CRUD Operations ---');

      // 2.1 Rejects incomplete signup
      const badSignup = await request(baseUrl, '/api/auth/signup', {
        method: 'POST',
        body: { email: 'incomplete@codeanova.dev' },
      });
      testAssert(badSignup.status === 400, 'POST /api/auth/signup rejects missing required fields (HTTP 400)');

      // 2.2 Rejects mismatched passwords
      const mismatchSignup = await request(baseUrl, '/api/auth/signup', {
        method: 'POST',
        body: {
          fullName: 'Ada Lovelace',
          email: 'ada@codeanova.dev',
          password: 'Password123!',
          confirmPassword: 'MismatchPassword123!',
        },
      });
      testAssert(mismatchSignup.status === 400, 'POST /api/auth/signup rejects password mismatch (HTTP 400)');

      // 2.3 Successful Signup
      const validSignup = await request(baseUrl, '/api/auth/signup', {
        method: 'POST',
        body: {
          fullName: 'Ada Lovelace',
          email: 'ada@codeanova.dev',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        },
      });
      testAssert(validSignup.status === 201, 'POST /api/auth/signup creates unverified participant account (HTTP 201)');

      // 2.4 Verify OTP with incorrect code
      const badOtp = await request(baseUrl, '/api/auth/verify-otp', {
        method: 'POST',
        body: { email: 'ada@codeanova.dev', otp: '000000' },
      });
      testAssert(badOtp.status === 400, 'POST /api/auth/verify-otp rejects invalid 6-digit OTP (HTTP 400)');

      // Manually verify user in mock state to test login
      let userAda = null;
      for (const u of mockDb.users.values()) {
        if (u.email === 'ada@codeanova.dev') {
          u.isVerified = true;
          userAda = u;
          break;
        }
      }

      // 2.5 Login with invalid credentials
      const badLogin = await request(baseUrl, '/api/auth/login', {
        method: 'POST',
        body: { email: 'ada@codeanova.dev', password: 'WrongPassword!' },
      });
      testAssert(badLogin.status === 401, 'POST /api/auth/login rejects incorrect password (HTTP 401)');

      // 2.6 Login with correct credentials
      const validLogin = await request(baseUrl, '/api/auth/login', {
        method: 'POST',
        body: { email: 'ada@codeanova.dev', password: 'Password123!' },
      });
      testAssert(validLogin.status === 200, 'POST /api/auth/login succeeds with valid credentials (HTTP 200)');
      testAssert(Boolean(validLogin.data?.data?.token), 'POST /api/auth/login returns cryptographic JWT token');

      const adaToken = validLogin.data?.data?.token || userAda?.generateAuthToken();

      // Create a second user (User B) for security and ownership verification
      const userBId = new mongoose.Types.ObjectId();
      const userBDoc = {
        _id: userBId,
        fullName: 'Charles Babbage',
        email: 'charles@codeanova.dev',
        password: await bcrypt.hash('Password123!', 10),
        isVerified: true,
        role: 'user',
        generateAuthToken: function () {
          return jwt.sign(
            { id: this._id, email: this.email, role: this.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
          );
        },
        save: async function () { return this; },
      };
      mockDb.users.set(userBId.toString(), userBDoc);
      const charlesToken = userBDoc.generateAuthToken();

      // =========================================================================
      // 3. USER CRUD: READ PROFILE, UPDATE PROFILE & SECURITY
      // =========================================================================
      console.log('\n--- 3. Testing USER CRUD Operations ---');

      // 3.1 Rejects unauthenticated request
      const unauthMe = await request(baseUrl, '/api/user/me');
      testAssert(unauthMe.status === 401, 'GET /api/user/me rejects unauthenticated request (HTTP 401)');

      // 3.2 Fetch profile with valid Bearer token
      const meRes = await request(baseUrl, '/api/user/me', { token: adaToken });
      testAssert(meRes.status === 200, 'GET /api/user/me returns 200 OK for authenticated user');
      testAssert(meRes.data?.data?.user?.email === 'ada@codeanova.dev', 'GET /api/user/me returns correct user data');
      testAssert(meRes.data?.data?.user?.password === undefined, 'GET /api/user/me strips sensitive password field');

      // 3.3 Update profile with invalid name (< 3 chars)
      const badNameUpdate = await request(baseUrl, '/api/user/update', {
        method: 'PUT',
        token: adaToken,
        body: { fullName: 'Al' },
      });
      testAssert(badNameUpdate.status === 400, 'PUT /api/user/update rejects name under 3 characters (HTTP 400)');

      // 3.4 Update profile with valid full name
      const goodNameUpdate = await request(baseUrl, '/api/user/update', {
        method: 'PUT',
        token: adaToken,
        body: { fullName: 'Augusta Ada King' },
      });
      testAssert(goodNameUpdate.status === 200, 'PUT /api/user/update successfully updates fullName (HTTP 200)');
      testAssert(goodNameUpdate.data?.data?.user?.fullName === 'Augusta Ada King', 'Updated fullName is persisted');

      // 3.5 Password change with incorrect current password
      const badPassChange = await request(baseUrl, '/api/user/update', {
        method: 'PUT',
        token: adaToken,
        body: {
          currentPassword: 'WrongPassword!',
          newPassword: 'BrandNewPassword123!',
          confirmNewPassword: 'BrandNewPassword123!',
        },
      });
      testAssert(badPassChange.status === 400, 'PUT /api/user/update rejects incorrect current password (HTTP 400)');

      // =========================================================================
      // 4. HACKATHON CRUD: CREATE, READ, UPDATE, DELETE & POLICY SECURITY
      // =========================================================================
      console.log('\n--- 4. Testing HACKATHON CRUD Operations & Ownership Security ---');

      // 4.1 Rejects registration without authentication
      const unauthReg = await request(baseUrl, '/api/hackathon/register', {
        method: 'POST',
        body: { fullName: 'Ada Lovelace' },
      });
      testAssert(unauthReg.status === 401, 'POST /api/hackathon/register rejects unauthenticated visitor (HTTP 401)');

      // 4.2 Rejects registration with invalid Indian mobile number
      const badMobileReg = await request(baseUrl, '/api/hackathon/register', {
        method: 'POST',
        token: adaToken,
        body: {
          fullName: 'Augusta Ada King',
          email: 'ada@codeanova.dev',
          mobileNumber: '1234567890', // invalid start digit
          collegeName: 'BITS Pilani',
          course: 'B.Tech',
          branch: 'CSE',
          yearOfStudy: '3rd Year',
          domain: 'AI/ML',
          projectName: 'Analytical Engine Neural Network',
          pptLink: 'https://drive.google.com/file/d/test/view',
          prototypeLink: 'https://github.com/adalovelace/neural-engine',
          teamSize: 1,
          teamMembers: [],
        },
      });
      testAssert(badMobileReg.status === 400, 'POST /api/hackathon/register validates 10-digit Indian mobile (HTTP 400)');

      // 4.3 Successful Hackathon Registration (CREATE)
      const validReg = await request(baseUrl, '/api/hackathon/register', {
        method: 'POST',
        token: adaToken,
        body: {
          fullName: 'Augusta Ada King',
          email: 'ada@codeanova.dev',
          mobileNumber: '9876543210',
          collegeName: 'BITS Pilani',
          course: 'B.Tech',
          branch: 'CSE',
          yearOfStudy: '3rd Year',
          domain: 'AI/ML',
          projectName: 'Analytical Engine Neural Network',
          pptLink: 'https://drive.google.com/file/d/sample-deck/view',
          prototypeLink: 'https://github.com/adalovelace/neural-engine',
          demoVideoLink: 'https://youtube.com/watch?v=sample123',
          teamSize: 2,
          teamMembers: [
            { name: 'Charles Babbage', email: 'babbage@cambridge.ac.uk' },
          ],
        },
      });
      testAssert(validReg.status === 201, 'POST /api/hackathon/register creates new entry (HTTP 201)');
      testAssert(Boolean(validReg.data?.data?.registrationId), 'POST /api/hackathon/register returns CAN-REG formatted ID');

      const createdRegId = validReg.data?.data?.registration?._id;

      // 4.4 Prevent duplicate registration for the same account
      const duplicateReg = await request(baseUrl, '/api/hackathon/register', {
        method: 'POST',
        token: adaToken,
        body: {
          fullName: 'Augusta Ada King',
          email: 'ada@codeanova.dev',
          mobileNumber: '9876543210',
          collegeName: 'BITS Pilani',
          course: 'B.Tech',
          branch: 'CSE',
          yearOfStudy: '3rd Year',
          domain: 'AI/ML',
          projectName: 'Duplicate Engine Submission',
          pptLink: 'https://drive.google.com/file/d/sample-deck/view',
          prototypeLink: 'https://github.com/adalovelace/neural-engine',
          teamSize: 1,
        },
      });
      testAssert(duplicateReg.status === 409, 'POST /api/hackathon/register prevents duplicate submissions (HTTP 409 Conflict)');

      // 4.5 Fetch own entry: GET /api/hackathon/my-entry (READ)
      const myEntryRes = await request(baseUrl, '/api/hackathon/my-entry', { token: adaToken });
      testAssert(myEntryRes.status === 200, 'GET /api/hackathon/my-entry returns 200 OK');
      testAssert(myEntryRes.data?.data?.isRegistered === true, 'my-entry reports isRegistered: true');
      testAssert(myEntryRes.data?.data?.registration?.projectName === 'Analytical Engine Neural Network', 'my-entry returns correct registration');

      // 4.6 Fetch registration by ID: GET /api/hackathon/:id as owner
      const byIdOwner = await request(baseUrl, `/api/hackathon/${createdRegId}`, { token: adaToken });
      testAssert(byIdOwner.status === 200, 'GET /api/hackathon/:id permits owner inspection (HTTP 200)');

      // 4.7 SECURITY: Unauthorized user (Charles) attempting to read Ada's registration
      const byIdAttacker = await request(baseUrl, `/api/hackathon/${createdRegId}`, { token: charlesToken });
      testAssert(byIdAttacker.status === 403, 'GET /api/hackathon/:id rejects unauthorized third-party user (HTTP 403 Forbidden)');

      // 4.8 SECURITY: Unauthorized user (Charles) attempting to update Ada's registration
      const updateAttacker = await request(baseUrl, `/api/hackathon/${createdRegId}`, {
        method: 'PATCH',
        token: charlesToken,
        body: { projectName: 'Hacked Project Name' },
      });
      testAssert(updateAttacker.status === 403, 'PATCH /api/hackathon/:id rejects unauthorized modification (HTTP 403 Forbidden)');

      // 4.9 Authorized owner updating project details: PATCH /api/hackathon/:id (UPDATE)
      const updateOwner = await request(baseUrl, `/api/hackathon/${createdRegId}`, {
        method: 'PATCH',
        token: adaToken,
        body: { projectName: 'Analytical Quantum Neural Engine v2' },
      });
      testAssert(updateOwner.status === 200, 'PATCH /api/hackathon/:id permits owner to update allowed fields (HTTP 200)');
      testAssert(updateOwner.data?.data?.registration?.projectName === 'Analytical Quantum Neural Engine v2', 'Updated project name persisted');

      // 4.10 SECURITY: Unauthorized user attempting to delete Ada's registration
      const deleteAttacker = await request(baseUrl, `/api/hackathon/${createdRegId}`, {
        method: 'DELETE',
        token: charlesToken,
      });
      testAssert(deleteAttacker.status === 403, 'DELETE /api/hackathon/:id rejects unauthorized deletion attempt (HTTP 403 Forbidden)');

      // 4.11 REGISTRATION POLICY: Attempting to delete an 'approved' registration as participant
      const adaRegDoc = mockDb.registrations.get(createdRegId.toString());
      if (adaRegDoc) adaRegDoc.registrationStatus = 'approved';

      const deleteApproved = await request(baseUrl, `/api/hackathon/${createdRegId}`, {
        method: 'DELETE',
        token: adaToken,
      });
      testAssert(deleteApproved.status === 403, 'DELETE /api/hackathon/:id blocks participant from deleting approved registration (HTTP 403 Policy)');

      // Reset status to 'pending' to test permitted self-deletion
      if (adaRegDoc) adaRegDoc.registrationStatus = 'pending';

      // 4.12 REGISTRATION POLICY: Permitted self-deletion when status is 'pending' (DELETE)
      const deletePending = await request(baseUrl, `/api/hackathon/${createdRegId}`, {
        method: 'DELETE',
        token: adaToken,
      });
      testAssert(deletePending.status === 200, 'DELETE /api/hackathon/:id allows participant to delete pending registration (HTTP 200)');

      // 4.13 Verify registration is removed
      const postDeleteCheck = await request(baseUrl, '/api/hackathon/my-entry', { token: adaToken });
      testAssert(postDeleteCheck.data?.data?.isRegistered === false, 'Registration is confirmed deleted from database');

      // =========================================================================
      // 5. CONTACT CRUD: SUBMIT INQUIRY
      // =========================================================================
      console.log('\n--- 5. Testing CONTACT CRUD Operations ---');

      // 5.1 Rejects short message (< 10 chars)
      const badContact = await request(baseUrl, '/api/contact', {
        method: 'POST',
        body: { name: 'Hacker', email: 'hacker@dev.io', message: 'Help' },
      });
      testAssert(badContact.status === 400, 'POST /api/contact rejects message under 10 characters (HTTP 400)');

      // 5.2 Successful contact inquiry submission (CREATE)
      const goodContact = await request(baseUrl, '/api/contact', {
        method: 'POST',
        body: {
          name: 'Ada Lovelace',
          email: 'ada@codeanova.dev',
          message: 'Inquiring regarding track mentors for the AI/ML challenge category.',
        },
      });
      testAssert(goodContact.status === 201, 'POST /api/contact successfully receives inquiry (HTTP 201)');

      // =========================================================================
      // 6. ADMIN GOVERNANCE & MANAGEMENT CRUD
      // =========================================================================
      console.log('\n--- 6. Testing ADMIN Management & Review Operations ---');

      // 6.1 Admin Login with invalid credentials
      const badAdminLogin = await request(baseUrl, '/api/admin/login', {
        method: 'POST',
        body: { email: 'admin@codeanova.io', password: 'WrongPassword!' },
      });
      testAssert(badAdminLogin.status === 401, 'POST /api/admin/login rejects invalid admin password (HTTP 401)');

      // 6.2 Admin Login with valid credentials
      const goodAdminLogin = await request(baseUrl, '/api/admin/login', {
        method: 'POST',
        body: { email: 'admin@codeanova.io', password: 'AdminSecure2026!' },
      });
      testAssert(goodAdminLogin.status === 200, 'POST /api/admin/login grants administrator authorization (HTTP 200)');
      const adminToken = goodAdminLogin.data?.data?.token;

      // Seed a fresh registration to test admin controls
      const seededRegId = new mongoose.Types.ObjectId();
      const seededReg = {
        _id: seededRegId,
        userId: userBId,
        fullName: 'Charles Babbage',
        email: 'charles@codeanova.dev',
        mobileNumber: '8765432109',
        collegeName: 'Cambridge University',
        course: 'B.Tech',
        branch: 'ME',
        yearOfStudy: '4th Year',
        domain: 'IoT',
        projectName: 'Difference Engine Telemetry',
        pptLink: 'https://onedrive.live.com/view/diff-engine',
        prototypeLink: 'https://github.com/babbage/diff-telemetry',
        teamSize: 1,
        teamMembers: [],
        registrationStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        save: async function () { return this; },
      };
      mockDb.registrations.set(seededRegId.toString(), seededReg);

      // 6.3 Regular user blocked from admin registrations list
      const userBlockedFromAdmin = await request(baseUrl, '/api/admin/registrations', { token: adaToken });
      testAssert(userBlockedFromAdmin.status === 403, 'GET /api/admin/registrations blocks non-admin users (HTTP 403)');

      // 6.4 Admin viewing all registrations (READ ALL)
      const adminListRes = await request(baseUrl, '/api/admin/registrations', { token: adminToken });
      testAssert(adminListRes.status === 200, 'GET /api/admin/registrations allows administrator access (HTTP 200)');

      // 6.5 Admin updating registration status (ADMIN UPDATE)
      const updateStatusRes = await request(baseUrl, `/api/admin/registrations/${seededRegId}/status`, {
        method: 'PATCH',
        token: adminToken,
        body: { status: 'approved' },
      });
      testAssert(updateStatusRes.status === 200, 'PATCH /api/admin/registrations/:id/status updates status to approved (HTTP 200)');
      testAssert(updateStatusRes.data?.data?.registration?.registrationStatus === 'approved', 'Status is approved in response');

      // 6.6 Admin deleting a registration (ADMIN DELETE)
      const adminDeleteRes = await request(baseUrl, `/api/admin/registrations/${seededRegId}`, {
        method: 'DELETE',
        token: adminToken,
      });
      testAssert(adminDeleteRes.status === 200, 'DELETE /api/admin/registrations/:id allows admin to delete record (HTTP 200)');
      testAssert(!mockDb.registrations.has(seededRegId.toString()), 'Registration is pruned from database');

      // 6.7 Admin fetching dashboard statistics
      const statsRes = await request(baseUrl, '/api/admin/stats', { token: adminToken });
      testAssert(statsRes.status === 200, 'GET /api/admin/stats retrieves system statistics (HTTP 200)');

      console.log('\n' + '='.repeat(70));
      console.log(`🎉 ALL CRUD & SECURITY TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
      console.log('='.repeat(70));
    } catch (err) {
      console.error('[Test Execution Error]:', err);
      process.exitCode = 1;
    } finally {
      server.close(() => {
        console.log('[Test Suite] Server closed cleanly.');
      });
      setTimeout(() => {
        process.exit(failed > 0 ? 1 : 0);
      }, 100);
    }
  });
}

runAllCrudTests();
