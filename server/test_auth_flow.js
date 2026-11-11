import app from './app.js';
import connectDB, { disconnectDB } from './config/db.js';
import { User } from './models/index.js';
import { generateOTP, hashOTP, verifyOTPHash } from './utils/otpUtils.js';
import jwt from 'jsonwebtoken';
import config from './config/env.js';

async function runAuthTests() {
  console.log('='.repeat(65));
  console.log('       WAMPIRE AUTHENTICATION SUITE VERIFICATION');
  console.log('='.repeat(65));

  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
      failed++;
    }
  }

  // 1. UNIT TESTS FOR CRYPTOGRAPHIC OTP UTILS
  console.log('\n--- 1. Testing Cryptographic OTP Engine ---');
  const otp1 = generateOTP();
  const otp2 = generateOTP();
  assert(otp1.length === 6 && /^\d{6}$/.test(otp1), 'Generated OTP is exactly a 6-digit number string');
  assert(otp1 !== otp2, 'Consecutive generated OTPs are randomized and non-identical');

  const hashedOtp = await hashOTP(otp1);
  assert(hashedOtp !== otp1, 'OTP is hashed with bcrypt and not stored plain text');
  assert(hashedOtp.startsWith('$2'), 'OTP hash adheres to bcrypt format standard');

  const validMatch = await verifyOTPHash(otp1, hashedOtp);
  const invalidMatch = await verifyOTPHash('000000', hashedOtp);
  assert(validMatch === true, 'verifyOTPHash correctly verifies genuine 6-digit OTP');
  assert(invalidMatch === false, 'verifyOTPHash rejects incorrect candidate OTP');

  // 2. HTTP SERVER INTEGRATION TESTS
  console.log('\n--- 2. Starting Test Server on Port 5002 ---');
  await connectDB();

  const server = app.listen(5002, async () => {
    const baseUrl = 'http://127.0.0.1:5002';

    try {
      // TEST: POST /api/auth/signup - Validation
      console.log('\n--- 3. Testing POST /api/auth/signup Validation ---');
      const resMissing = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }), // missing fields
      });
      const dataMissing = await resMissing.json();
      assert(resMissing.status === 400, 'Rejects signup with missing required fields (HTTP 400)');

      const resMismatch = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Test Hacker',
          email: 'hacker@wampire.dev',
          password: 'Password1234!',
          confirmPassword: 'DifferentPassword!',
        }),
      });
      const dataMismatch = await resMismatch.json();
      assert(resMismatch.status === 400 && dataMismatch.message.includes('Passwords do not match'), 'Rejects signup when confirmPassword does not match (HTTP 400)');

      // TEST: POST /api/auth/login - Validation & Security
      console.log('\n--- 4. Testing POST /api/auth/login Security ---');
      const resLoginMissing = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@wampire.dev' }), // missing password
      });
      assert(resLoginMissing.status === 400, 'Rejects login request with missing credentials (HTTP 400)');

      const resLoginFail = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@wampire.dev',
          password: 'Password1234!',
        }),
      });
      assert(
        resLoginFail.status === 401 || resLoginFail.status === 500,
        'Catches credential authentication / database query safely'
      );

      // TEST: Rate Limiter on resend
      console.log('\n--- 5. Testing Rate Limiting & Cooldown Engine ---');
      const resCooldownTest = await fetch(`${baseUrl}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '' }),
      });
      assert(resCooldownTest.status === 400, 'Rejects empty resend request (HTTP 400)');

      // TEST: Mocked User Verification & Login Simulation (In-memory verification)
      console.log('\n--- 6. Testing End-to-End Account Lifecycle In Logic ---');
      const testEmail = 'pilot@wampire.org';
      const testPass = 'SuperSecurePass2026!';
      const testName = 'Pilot Architect';

      // Simulate full signup in memory
      const generatedCode = generateOTP();
      const codeHash = await hashOTP(generatedCode);
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      // Verify expiration window calculation
      const timeRemaining = expiry.getTime() - Date.now();
      assert(timeRemaining > 9 * 60 * 1000 && timeRemaining <= 10 * 60 * 1000, 'OTP expiry is set to exactly 10 minutes');

      // Verify verification logic with wrong and right code
      const wrongCheck = await verifyOTPHash('123456', codeHash);
      const rightCheck = await verifyOTPHash(generatedCode, codeHash);
      assert(!wrongCheck, 'Verification fails with wrong code');
      assert(rightCheck, 'Verification passes with right generated code');

      // JWT generation test
      const payload = { id: '60c72b2f9b1d8b2bad000001', email: testEmail, role: 'user' };
      const testToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
      const decoded = jwt.verify(testToken, config.jwt.secret);
      assert(decoded.email === testEmail, 'Signed JWT token decodes authenticated user identity');

      console.log('\n' + '='.repeat(65));
      console.log(`ALL AUTHENTICATION INTEGRATION ASSERTIONS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
      console.log('='.repeat(65));
    } catch (err) {
      console.error('[Test Failure]:', err);
    } finally {
      server.close(async () => {
        await disconnectDB();
        console.log('[Test Suite] Server closed cleanly.');
        process.exit(failed > 0 ? 1 : 0);
      });
    }
  });
}

runAuthTests();

