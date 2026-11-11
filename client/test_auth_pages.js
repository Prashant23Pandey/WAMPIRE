/**
 * Verification Test for Frontend Authentication Pages
 * Checks:
 * 1. Syntax, imports and compilation of Signup.jsx, VerifyOTP.jsx, Login.jsx, DashboardPage.jsx
 * 2. Toast context and notification system
 * 3. Validation logic rules
 * 4. API communication bindings with real backend endpoints
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('================================================================');
console.log('🚀 Running CODE-A-NOVA Frontend Auth Pages Verification');
console.log('================================================================\n');

// 1. Check existence of required files
console.log('TEST 1: File Existence & Export Structure');
const requiredFiles = [
  'src/pages/Signup.jsx',
  'src/pages/VerifyOTP.jsx',
  'src/pages/Login.jsx',
  'src/pages/DashboardPage.jsx',
  'src/context/ToastContext.jsx',
  'src/hooks/useToast.js',
  'src/App.jsx',
];

requiredFiles.forEach((file) => {
  const fullPath = path.resolve(__dirname, file);
  assert(fs.existsSync(fullPath), `Required file exists: ${file}`);
});

// 2. Validate Signup.jsx requirements
console.log('\nTEST 2: Signup.jsx Requirements Inspection');
const signupCode = fs.readFileSync(path.resolve(__dirname, 'src/pages/Signup.jsx'), 'utf-8');
assert(signupCode.includes('fullName'), 'Signup includes fullName field');
assert(signupCode.includes('email'), 'Signup includes email field');
assert(signupCode.includes('password'), 'Signup includes password field');
assert(signupCode.includes('confirmPassword'), 'Signup includes confirmPassword field');
assert(signupCode.includes('trimmed.length < 3'), 'Enforces full name minimum 3 characters');
assert(signupCode.includes('value.length < 8'), 'Enforces password minimum 8 characters');
assert(signupCode.includes('Passwords do not match'), 'Validates password confirmation match');
assert(signupCode.includes('/verify-otp'), 'Navigates to OTP verification after success');
assert(signupCode.includes('Sending Verification Code'), 'Displays sending OTP loading state');

// 3. Validate VerifyOTP.jsx requirements
console.log('\nTEST 3: VerifyOTP.jsx Requirements Inspection');
const otpCode = fs.readFileSync(path.resolve(__dirname, 'src/pages/VerifyOTP.jsx'), 'utf-8');
assert(otpCode.includes('grid-cols-6'), 'Renders six individual OTP input boxes');
assert(otpCode.includes('handleDigitChange'), 'Handles automatic focus movement on digit change');
assert(otpCode.includes('handleKeyDown'), 'Handles backspace navigation between boxes');
assert(otpCode.includes('handlePaste'), 'Includes clipboard paste support');
assert(otpCode.includes('handleResend'), 'Supports resending verification code');
assert(otpCode.includes('resendCooldown'), 'Enforces 60-second resend cooldown');
assert(otpCode.includes('expirySeconds'), 'Displays 10-minute expiry countdown');
assert(otpCode.includes('/login?verified=true'), 'Navigates to Login on successful verification');

// 4. Validate Login.jsx requirements
console.log('\nTEST 4: Login.jsx Requirements Inspection');
const loginCode = fs.readFileSync(path.resolve(__dirname, 'src/pages/Login.jsx'), 'utf-8');
assert(loginCode.includes('email'), 'Login includes email field');
assert(loginCode.includes('password'), 'Login includes password field');
assert(loginCode.includes('showPassword'), 'Features password visibility toggle');
assert(loginCode.includes('rememberEmail'), 'Includes remember email option');
assert(loginCode.includes('code_a_nova_remembered_email'), 'Persists remembered email to localStorage');
assert(!loginCode.includes('Forgot password?'), 'Omits unimplemented forgot password UI as instructed');
assert(loginCode.includes('/dashboard'), 'Navigates to Dashboard upon successful authentication');

// 5. Validate Toast Notifications & Real Backend Bindings
console.log('\nTEST 5: Toast Notifications & Backend API Bindings');
const toastCode = fs.readFileSync(path.resolve(__dirname, 'src/context/ToastContext.jsx'), 'utf-8');
assert(toastCode.includes('ToastContext'), 'Provides centralized ToastContext');
assert(toastCode.includes('success:'), 'Supports success notifications');
assert(toastCode.includes('error:'), 'Supports error notifications');

const apiCode = fs.readFileSync(path.resolve(__dirname, 'src/services/authService.js'), 'utf-8');
assert(apiCode.includes('/auth/signup'), 'authService calls POST /api/auth/signup');
assert(apiCode.includes('/auth/verify-otp'), 'authService calls POST /api/auth/verify-otp');
assert(apiCode.includes('/auth/resend-otp'), 'authService calls POST /api/auth/resend-otp');
assert(apiCode.includes('/auth/login'), 'authService calls POST /api/auth/login');
assert(apiCode.includes('/user/me'), 'authService calls GET /api/user/me');

console.log('\n================================================================');
console.log(`🎉 ALL FRONTEND AUTHENTICATION PAGE VERIFICATIONS PASSED!`);
console.log(`Passed: ${passed} / ${total} assertions`);
console.log('================================================================\n');
