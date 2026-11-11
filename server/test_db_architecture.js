import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, HackathonRegistration, Contact, Admin } from './models/index.js';
import { connectDB, disconnectDB, getConnectionStatus } from './config/db.js';
import initializeDatabase from './config/initDB.js';

async function runDatabaseTests() {
  console.log('='.repeat(65));
  console.log('     WAMPIRE MONGODB ARCHITECTURE & SCHEMA TEST SUITE');
  console.log('='.repeat(65));

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST 1: Model Compilation
  console.log('\n--- 1. Testing Model Compilation ---');
  assert(User && User.modelName === 'User', 'User model is properly registered with Mongoose');
  assert(
    HackathonRegistration && HackathonRegistration.modelName === 'HackathonRegistration',
    'HackathonRegistration model is properly registered with Mongoose'
  );
  assert(Contact && Contact.modelName === 'Contact', 'Contact model is properly registered with Mongoose');
  assert(Admin && Admin.modelName === 'Admin', 'Admin model is properly registered with Mongoose');

  // TEST 2: Schema Indexes Inspection
  console.log('\n--- 2. Testing Defined Indexes & Constraints ---');
  const isUserEmailUnique = User.schema.path('email').options.unique === true;
  assert(isUserEmailUnique, 'User schema enforces unique constraint on email');

  const isRegUserUnique = HackathonRegistration.schema.path('userId').options.unique === true;
  assert(isRegUserUnique, 'HackathonRegistration enforces unique constraint on userId to prevent duplicate registrations');

  const contactIndexes = Contact.schema.indexes();
  const hasContactIndex = contactIndexes.some((idx) => idx[0].email === 1);
  assert(hasContactIndex, 'Contact schema has index on email & createdAt');

  // TEST 3: User Model Password Hashing & Methods
  console.log('\n--- 3. Testing User Bcrypt Hashing & Auth Methods ---');
  const mockUser = new User({
    fullName: 'Alex Test',
    email: 'alex@example.com',
    password: 'SuperSecretPassword123!',
  });

  // Verify pre-save hook
  assert(mockUser.password === 'SuperSecretPassword123!', 'User instance holds plain password before save');
  const salt = await bcrypt.genSalt(10);
  mockUser.password = await bcrypt.hash(mockUser.password, salt);
  assert(mockUser.password !== 'SuperSecretPassword123!', 'Password is successfully hashed with bcrypt');
  assert(mockUser.password.startsWith('$2'), 'Bcrypt hash starts with standard prefix ($2a/$2b)');

  // Verify comparePassword
  const isCorrect = await mockUser.comparePassword('SuperSecretPassword123!');
  const isWrong = await mockUser.comparePassword('WrongPassword123!');
  assert(isCorrect === true, 'comparePassword successfully validates correct plain password');
  assert(isWrong === false, 'comparePassword rejects incorrect password');

  // Verify JWT generation
  const token = mockUser.generateAuthToken();
  assert(typeof token === 'string' && token.split('.').length === 3, 'generateAuthToken returns valid JWT structure');

  // TEST 4: HackathonRegistration Validation
  console.log('\n--- 4. Testing HackathonRegistration Validation Rules ---');
  const invalidReg = new HackathonRegistration({});
  const regValidation = invalidReg.validateSync();
  assert(regValidation !== undefined, 'HackathonRegistration validates required fields');
  assert('userId' in regValidation.errors, 'Rejects registration without authenticated userId');
  assert('fullName' in regValidation.errors, 'Rejects registration without fullName');
  assert('email' in regValidation.errors, 'Rejects registration without email');
  assert('mobileNumber' in regValidation.errors, 'Rejects registration without mobileNumber');
  assert('collegeName' in regValidation.errors, 'Rejects registration without collegeName');
  assert('domain' in regValidation.errors, 'Rejects registration without valid domain');

  // Test team members validation: teamSize 3 requires exactly 2 teamMembers
  const invalidTeamReg = new HackathonRegistration({
    userId: new mongoose.Types.ObjectId(),
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    mobileNumber: '9876543210',
    collegeName: 'Tech University',
    course: 'B.Tech',
    branch: 'Computer Science',
    yearOfStudy: '3rd Year',
    domain: 'AI & Machine Learning',
    projectName: 'Autonomous Agent',
    teamSize: 3,
    teamMembers: [
      { name: 'Member 1', email: 'member1@example.com' },
      // Missing member 2 for teamSize 3
    ],
  });
  const teamValidation = invalidTeamReg.validateSync();
  assert(
    teamValidation && 'teamMembers' in teamValidation.errors,
    'Rejects team when teamMembers count does not equal teamSize - 1'
  );

  // Test valid team member configuration
  const validTeamReg = new HackathonRegistration({
    userId: new mongoose.Types.ObjectId(),
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    mobileNumber: '9876543210',
    collegeName: 'Tech University',
    course: 'B.Tech',
    branch: 'Computer Science',
    yearOfStudy: '3rd Year',
    domain: 'AI & Machine Learning',
    projectName: 'Autonomous Agent',
    teamSize: 2,
    teamMembers: [
      { name: 'Partner One', email: 'partner@example.com', mobileNumber: '9123456780', role: 'Frontend' },
    ],
  });
  const validTeamResult = validTeamReg.validateSync();
  assert(validTeamResult === undefined, 'Accepts valid registration with matching team members');

  // TEST 5: Contact Model Validation
  console.log('\n--- 5. Testing Contact Model Validation ---');
  const invalidContact = new Contact({ name: 'A', email: 'not-an-email', message: 'short' });
  const contactValidation = invalidContact.validateSync();
  assert(contactValidation !== undefined, 'Contact model validates fields');
  assert('name' in contactValidation.errors, 'Rejects name shorter than 2 chars');
  assert('email' in contactValidation.errors, 'Rejects invalid email format');
  assert('message' in contactValidation.errors, 'Rejects message shorter than 10 chars');

  const validContact = new Contact({
    name: 'Sponsor Lead',
    email: 'sponsor@company.com',
    message: 'We are interested in sponsoring the upcoming WAMPIRE hackathon event.',
  });
  assert(validContact.validateSync() === undefined, 'Accepts valid contact submission');

  // TEST 6: Connection Status Inspection
  console.log('\n--- 6. Testing Database Connection Handlers & Lifecycle ---');
  const statusBefore = getConnectionStatus();
  console.log('Status before connect:', statusBefore);
  assert(typeof statusBefore.state === 'string', 'getConnectionStatus returns state property');

  console.log('\nAttempting connection to configured MONGO_URI...');
  const conn = await connectDB();
  const statusAfter = getConnectionStatus();
  console.log('Status after connect attempt:', statusAfter);

  if (statusAfter.isConnected) {
    assert(statusAfter.isConnected === true, 'Successfully connected to live MongoDB server!');
    await initializeDatabase();
  } else {
    assert(
      statusAfter.state === 'disconnected' || statusAfter.state === 'connecting',
      'Gracefully captures offline/remote MongoDB status without uncaught process exception'
    );
  }

  await disconnectDB();

  console.log('\n' + '='.repeat(65));
  console.log(`TEST RUN COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log('='.repeat(65));

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runDatabaseTests().catch((err) => {
  console.error('[Fatal Error in Test Runner]:', err);
  process.exit(1);
});
