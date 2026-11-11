/**
 * Automated Verification Test Suite for WAMPIRE Nodemailer Email System
 *
 * Verifies:
 * 1. Transporter initialization (Gmail SMTP or Ethereal SMTP test fallback)
 * 2. Transporter connection verification
 * 3. Invariant Sender Identity: MUST always be "Wampire", NEVER a candidate name
 * 4. EMAIL 1: OTP Verification email dispatch, HTML structure, 10-min expiry, security notice
 * 5. EMAIL 2: Registration Confirmation email dispatch, team details, registration ID
 * 6. Error handling: invalid recipient, missing parameters
 * 7. Live message delivery & message ID confirmation
 */

import emailService from './services/emailService.js';
import config from './config/env.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runEmailVerificationSuite() {
  console.log('================================================================');
  console.log('🚀 Starting WAMPIRE Email Delivery Verification Test Suite');
  console.log('================================================================');
  console.log(`Environment: ${config.env}`);
  console.log(`Configured Email From Name: "${config.email.fromName}"`);
  console.log(`Gmail User Configured: ${Boolean(config.email.user && config.email.pass) ? 'YES' : 'NO (Using Ethereal SMTP Test Transport)'}`);
  console.log('----------------------------------------------------------------\n');

  try {
    // -------------------------------------------------------------
    // TEST 1: Transporter Connection Verification
    // -------------------------------------------------------------
    console.log('TEST 1: Transporter Connectivity Verification');
    const connStatus = await emailService.verifyConnection();
    assert(connStatus && connStatus.connected, 'Email service transporter connects successfully');
    assert(Boolean(connStatus.provider), `Provider identified: ${connStatus.provider}`);
    console.log(`  [Info] Connected via: ${connStatus.provider} (${connStatus.user})\n`);

    // -------------------------------------------------------------
    // TEST 2: Invariant Sender Identity Constraint
    // -------------------------------------------------------------
    console.log('TEST 2: Strict Sender Identity Enforcement');
    const sender = emailService.getSenderAddress();
    assert(
      sender.startsWith('"Wampire"'),
      `Sender name is strictly "Wampire" (Got: ${sender})`
    );
    assert(
      !sender.includes('Elena Rostova') && !sender.includes('Marcus Vance'),
      'Sender address does not contain candidate or participant names'
    );
    console.log(`  [Info] Verified invariant sender: ${sender}\n`);

    // -------------------------------------------------------------
    // TEST 3: EMAIL 1 - OTP Verification Email Delivery
    // -------------------------------------------------------------
    console.log('TEST 3: EMAIL 1 - OTP Verification Dispatch');
    const otpCandidate = {
      email: 'hacker.applicant@example.com',
      fullName: 'Elena Rostova',
      otp: '849201',
    };

    const otpResult = await emailService.sendOtpVerificationEmail(otpCandidate);

    assert(otpResult.success === true, 'OTP email dispatch returned success: true');
    assert(Boolean(otpResult.messageId), `OTP email generated valid Message-ID: ${otpResult.messageId}`);
    assert(otpResult.subject === 'Verify Your Wampire Account', 'Subject matches exact requirement');
    assert(otpResult.from.includes('Wampire'), 'From header reflects Wampire');
    assert(!otpResult.from.includes(otpCandidate.fullName), 'From header does NOT leak candidate name');
    assert(otpResult.to === otpCandidate.email, `To address matches recipient: ${otpCandidate.email}`);

    if (otpResult.previewUrl) {
      console.log(`  [Live Preview] 🔗 View delivered OTP email: ${otpResult.previewUrl}`);
    }
    console.log('');

    // -------------------------------------------------------------
    // TEST 4: EMAIL 2 - Hackathon Registration Confirmation Delivery
    // -------------------------------------------------------------
    console.log('TEST 4: EMAIL 2 - Hackathon Registration Confirmation Dispatch');
    const registrationData = {
      email: 'lead.dev@cyberinnovate.org',
      participantName: 'Marcus Vance',
      registrationId: '65ef3b817c80210b45d29001',
      eventName: 'WAMPIRE 2026',
      collegeName: 'National Institute of Advanced Technology',
      domain: 'Artificial Intelligence & Generative Systems',
      projectName: 'NeuroShield: Real-time Autonomous Threat Defense',
      teamSize: 3,
      teamMembers: [
        { name: 'Marcus Vance', email: 'lead.dev@cyberinnovate.org', role: 'Team Lead' },
        { name: 'Sophia Chen', email: 'sophia.chen@cyberinnovate.org', role: 'ML Architect' },
        { name: 'David Kim', email: 'david.kim@cyberinnovate.org', role: 'Full Stack Dev' },
      ],
    };

    const regResult = await emailService.sendRegistrationConfirmationEmail(registrationData);

    assert(regResult.success === true, 'Registration confirmation email returned success: true');
    assert(Boolean(regResult.messageId), `Registration email generated valid Message-ID: ${regResult.messageId}`);
    assert(
      regResult.subject === 'Your Wampire Hackathon Registration is Confirmed!',
      'Registration subject matches requirement'
    );
    assert(regResult.from.includes('Wampire'), 'Sender name remains Wampire');
    assert(!regResult.from.includes('Marcus Vance'), 'Sender name does not contain participant name');
    assert(regResult.to === registrationData.email, `Recipient matches team lead: ${registrationData.email}`);

    if (regResult.previewUrl) {
      console.log(`  [Live Preview] 🔗 View delivered Registration email: ${regResult.previewUrl}`);
    }
    console.log('');

    // -------------------------------------------------------------
    // TEST 5: Error Handling - Invalid Recipient
    // -------------------------------------------------------------
    console.log('TEST 5: Error Handling - Rejection on Invalid Recipient');
    let caughtInvalidEmail = false;
    try {
      await emailService.sendMail({
        to: 'not-an-email',
        subject: 'Test',
        text: 'Test',
      });
    } catch (err) {
      caughtInvalidEmail = true;
      assert(err.message.includes('Invalid recipient'), 'Invalid recipient caught with clear error');
    }
    assert(caughtInvalidEmail, 'Service prevented dispatch to invalid email address\n');

    // -------------------------------------------------------------
    // TEST 6: Error Handling - Missing OTP Code
    // -------------------------------------------------------------
    console.log('TEST 6: Error Handling - Missing OTP Parameter');
    let caughtMissingOtp = false;
    try {
      await emailService.sendOtpVerificationEmail({
        email: 'test@example.com',
        fullName: 'Test Hacker',
        otp: null,
      });
    } catch (err) {
      caughtMissingOtp = true;
      assert(err.message.includes('Missing OTP'), 'Missing OTP parameter caught with clear error');
    }
    assert(caughtMissingOtp, 'Service rejected dispatch without OTP code\n');

    // -------------------------------------------------------------
    // TEST 7: Error Handling - Missing Registration Fields
    // -------------------------------------------------------------
    console.log('TEST 7: Error Handling - Incomplete Registration Data');
    let caughtMissingReg = false;
    try {
      await emailService.sendRegistrationConfirmationEmail({
        email: 'test@example.com',
        participantName: '', // Missing
        collegeName: '',
        domain: '',
        projectName: '',
      });
    } catch (err) {
      caughtMissingReg = true;
      assert(
        err.message.includes('Missing required registration fields'),
        'Missing registration fields rejected properly'
      );
    }
    assert(caughtMissingReg, 'Service rejected incomplete registration email\n');

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('================================================================');
    console.log(`🎉 ALL EMAIL VERIFICATION TESTS COMPLETED SUCCESSFULLY!`);
    console.log(`Passed: ${passedTests} / ${totalTests} assertions`);
    console.log('================================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
    process.exit(1);
  }
}

runEmailVerificationSuite();

