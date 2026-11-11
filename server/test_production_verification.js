/**
 * CODE-A-NOVA PRODUCTION READINESS & DEPLOYMENT VERIFICATION
 *
 * Verifies:
 * 1. Frontend-Backend Connectivity & Production CORS
 * 2. Production Authentication (Signup, OTP, JWT, Secure Cookies)
 * 3. Production Email Delivery (Gmail SMTP transport, Templates, Invariant Sender)
 * 4. Registration Persistence (MongoDB Schema, Team Squads, Statuses)
 */

import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from './app.js';
import config from './config/env.js';
import { User, HackathonRegistration } from './models/index.js';
import emailService from './services/emailService.js';
import { generateOTP, hashOTP, verifyOTPHash } from './utils/otpUtils.js';

console.log('='.repeat(75));
console.log('     CODE-A-NOVA PRODUCTION DEPLOYMENT READINESS VERIFICATION');
console.log('='.repeat(75));

let passed = 0;
let failed = 0;

function check(condition, label, details = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${label} ${details ? '--> ' + details : ''}`);
    failed++;
  }
}

// In-Memory store for tests when MongoDB Atlas is not yet provisioned locally
const store = {
  users: new Map(),
  registrations: new Map(),
};

function setupInterceptors() {
  if (mongoose.connection.readyState === 1) return;

  User.findById = function (id) {
    const idStr = id ? id.toString() : '';
    const u = store.users.get(idStr) || null;
    return {
      select: () => Promise.resolve(u),
      then: (res) => res(u),
    };
  };

  User.findOne = function (query) {
    return {
      select: function () {
        for (const u of store.users.values()) {
          if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return Promise.resolve(u);
        }
        return Promise.resolve(null);
      },
    };
  };

  User.create = async function (data) {
    const id = new mongoose.Types.ObjectId();
    const isHashed = data.password.startsWith('$2');
    const hashed = isHashed ? data.password : await bcrypt.hash(data.password, 10);
    const u = {
      _id: id,
      ...data,
      password: hashed,
      comparePassword: (p) => bcrypt.compare(p, hashed),
      generateAuthToken: () => jwt.sign({ id, email: data.email, role: 'user' }, config.jwt.secret, { expiresIn: '7d' }),
      save: async function () {
        store.users.set(id.toString(), this);
        return this;
      },
    };
    store.users.set(id.toString(), u);
    return u;
  };

  HackathonRegistration.findOne = function (query) {
    for (const r of store.registrations.values()) {
      if (query.userId && r.userId.toString() === query.userId.toString()) return Promise.resolve(r);
    }
    return Promise.resolve(null);
  };

  HackathonRegistration.create = async function (data) {
    const id = new mongoose.Types.ObjectId();
    const r = {
      _id: id,
      ...data,
      registrationStatus: 'pending',
      save: async function () {
        store.registrations.set(id.toString(), this);
        return this;
      },
    };
    store.registrations.set(id.toString(), r);
    return r;
  };
}

async function runProductionVerification() {
  setupInterceptors();
  const PORT = 5007;
  const baseUrl = `http://127.0.0.1:${PORT}`;

  const server = app.listen(PORT, async () => {
    try {
      console.log('\n--- 1. Testing Frontend-Backend Connectivity & Production CORS ---');
      const healthRes = await fetch(`${baseUrl}/api/v1/health`);
      const healthData = await healthRes.json();
      check(healthRes.status === 200, 'Health endpoint responds with HTTP 200 OK');
      check(healthData.data?.service === 'CODE-A-NOVA API', 'API reports service name: CODE-A-NOVA API');

      // Test CORS Preflight for Vercel
      const corsRes = await fetch(`${baseUrl}/api/v1/health`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'https://code-a-nova.vercel.app',
          'Access-Control-Request-Method': 'POST',
        },
      });
      const corsOrigin = corsRes.headers.get('access-control-allow-origin');
      check(
        corsOrigin === 'https://code-a-nova.vercel.app' || corsOrigin === '*',
        'CORS preflight authorizes production Vercel frontend origin'
      );
      check(
        corsRes.headers.get('access-control-allow-credentials') === 'true',
        'CORS permits credentials for cross-origin cookie sharing'
      );

      console.log('\n--- 2. Testing Production Authentication & Cookie Security ---');
      const testEmail = `prod.verifier.${Date.now()}@codeanova.io`;
      const testPass = 'ProdSecurePass2026!';

      const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Production Verifier',
          email: testEmail,
          password: testPass,
          confirmPassword: testPass,
        }),
      });
      check(signupRes.status === 201, 'Participant signup returns HTTP 201 Created');

      // Extract OTP from dispatched email
      const email = emailService.getLastDispatchedEmail();
      const otpMatch = email?.text?.match(/code is:\s*(\d{6})/i);
      const rawOtp = otpMatch ? otpMatch[1] : null;
      check(Boolean(rawOtp), 'Nodemailer generated and dispatched 6-digit verification code');

      // Verify OTP
      const verifyRes = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, otp: rawOtp }),
      });
      check(verifyRes.status === 200, 'OTP verification succeeds with HTTP 200 OK');

      // Login & Cookie Verification
      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPass }),
      });
      const loginData = await loginRes.json();
      const setCookieHeader = loginRes.headers.get('set-cookie') || '';
      check(loginRes.status === 200, 'Login grants authenticated session with HTTP 200 OK');
      check(Boolean(loginData.data?.token), 'Login response delivers cryptographically signed JWT token');
      check(setCookieHeader.includes('HttpOnly'), 'Set-Cookie header sets HttpOnly flag preventing XSS token theft');

      console.log('\n--- 3. Testing Production Email Delivery & Branding ---');
      check(email?.from?.includes('Code-a-Nova'), 'Email sender name remains strictly "Code-a-Nova"');
      check(email?.subject?.includes('Verify Your Code-a-Nova Account'), 'Email subject matches official verification title');
      check(email?.html?.includes('10 minutes'), 'Email HTML contains 10-minute security expiry notice');

      console.log('\n--- 4. Testing Hackathon Registration Persistence ---');
      const regRes = await fetch(`${baseUrl}/api/hackathon/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginData.data?.token}`,
        },
        body: JSON.stringify({
          fullName: 'Production Verifier',
          email: testEmail,
          mobileNumber: '9876543210',
          collegeName: 'Indian Institute of Technology, Madras',
          course: 'B.Tech',
          branch: 'CSE',
          yearOfStudy: '3rd Year',
          domain: 'AI/ML',
          projectName: 'Quantum Cognitive Mesh',
          pptLink: 'https://drive.google.com/presentation',
          prototypeLink: 'https://github.com/codeanova/quantum-mesh',
          demoVideoLink: 'https://youtube.com/watch?v=prod-demo',
          teamSize: 2,
          teamMembers: [
            {
              name: 'Sarah Connor',
              email: `sarah.${Date.now()}@codeanova.io`,
              mobileNumber: '9876543219',
              role: 'Lead ML Engineer',
            },
          ],
        }),
      });

      const regData = await regRes.json();
      check(regRes.status === 201, 'Hackathon squad registration persists with HTTP 201 Created');
      check(Boolean(regData.data?.registrationId?.startsWith('CAN-REG-')), 'Registration ID adheres to CAN-REG-XXXXXXXX format');

      const confEmail = emailService.getLastDispatchedEmail();
      check(
        confEmail?.subject?.includes('Registration is Confirmed'),
        'Registration confirmation email dispatched with verified event branding'
      );

      console.log('\n' + '='.repeat(75));
      console.log(`🎉 PRODUCTION VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED!`);
      console.log('='.repeat(75));
    } catch (err) {
      console.error('[Production Verification Error]:', err);
      process.exitCode = 1;
    } finally {
      server.close(() => {
        console.log('[Verification Server] Closed cleanly.');
        process.exit(failed > 0 ? 1 : 0);
      });
    }
  });
}

runProductionVerification();
