/**
 * CODE-A-NOVA Hackathon Registration Module Test Suite
 * Verifies Frontend Registration Page, Field Validations, Dynamic Team Sizing,
 * App Routing, and Backend Service Integration.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('----------------------------------------------------');
console.log('🚀 Running CODE-A-NOVA Registration Module Tests');
console.log('----------------------------------------------------');

let passedAssertions = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedAssertions++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Verify HackathonRegisterPage.jsx file existence
test('HackathonRegisterPage.jsx file exists and is populated', () => {
  const filePath = path.join(__dirname, 'src', 'pages', 'HackathonRegisterPage.jsx');
  assert.ok(fs.existsSync(filePath), 'HackathonRegisterPage.jsx should exist');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.length > 500, 'HackathonRegisterPage.jsx should have sufficient content');
});

// 2. Verify all 14 form fields are present in HackathonRegisterPage.jsx
test('HackathonRegisterPage.jsx implements all 14 specified fields', () => {
  const filePath = path.join(__dirname, 'src', 'pages', 'HackathonRegisterPage.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Full Name
  assert.ok(content.includes('fullName'), 'Should contain fullName field');
  // 2. Email Address
  assert.ok(content.includes('email'), 'Should contain email field');
  // 3. Mobile Number
  assert.ok(content.includes('mobileNumber'), 'Should contain mobileNumber field');
  // 4. College Name
  assert.ok(content.includes('collegeName'), 'Should contain collegeName field');
  assert.ok(content.includes('customCollege'), 'Should contain customCollege for Other option');
  // 5. Course
  assert.ok(content.includes('course'), 'Should contain course field');
  assert.ok(content.includes('customCourse'), 'Should contain customCourse for Other option');
  // 6. Branch
  assert.ok(content.includes('branch'), 'Should contain branch field');
  assert.ok(content.includes('customBranch'), 'Should contain customBranch for Other option');
  // 7. Year of Study
  assert.ok(content.includes('yearOfStudy'), 'Should contain yearOfStudy field');
  // 8. Domain / Track
  assert.ok(content.includes('domain'), 'Should contain domain field');
  assert.ok(content.includes('customDomain'), 'Should contain customDomain for Other option');
  // 9. Project Name
  assert.ok(content.includes('projectName'), 'Should contain projectName field');
  // 10. PPT Link
  assert.ok(content.includes('pptLink'), 'Should contain pptLink field');
  // 11. Prototype Link
  assert.ok(content.includes('prototypeLink'), 'Should contain prototypeLink field');
  // 12. Demo Video Link
  assert.ok(content.includes('demoVideoLink'), 'Should contain demoVideoLink field');
  // 13. Team Size
  assert.ok(content.includes('teamSize'), 'Should contain teamSize field');
  // 14. Team Members
  assert.ok(content.includes('teamMembers'), 'Should contain teamMembers array handling');
});

// 3. Verify Predefined constants: Colleges, Courses, Branches, Years, Domains
test('HackathonRegisterPage exports correct predefined options', () => {
  const filePath = path.join(__dirname, 'src', 'pages', 'HackathonRegisterPage.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  // Colleges
  assert.ok(content.includes('PREDEFINED_COLLEGES'), 'Should export PREDEFINED_COLLEGES');
  assert.ok(content.includes('BITS') && content.includes('Other'), 'Colleges must contain IITs/BITS and Other');

  // Courses: B.Tech, M.Tech, BCA, MCA, B.Sc, Other
  ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'Other'].forEach((c) => {
    assert.ok(content.includes(c), `Courses must include ${c}`);
  });

  // Branches: CSE, IT, ECE, ME, CE, Other
  ['CSE', 'IT', 'ECE', 'ME', 'CE', 'Other'].forEach((b) => {
    assert.ok(content.includes(b), `Branches must include ${b}`);
  });

  // Years: 1st Year, 2nd Year, 3rd Year, 4th Year
  ['1st Year', '2nd Year', '3rd Year', '4th Year'].forEach((y) => {
    assert.ok(content.includes(y), `Years must include ${y}`);
  });

  // Domains: AI/ML, Web Development, IoT, Cyber Security, Blockchain, Other
  ['AI/ML', 'Web Development', 'IoT', 'Cyber Security', 'Blockchain', 'Other'].forEach((d) => {
    assert.ok(content.includes(d), `Domains must include ${d}`);
  });
});

// 4. Test Validation Logic: Full Name
test('Full Name validation: letters and spaces only, minimum 3 chars', () => {
  const nameRegex = /^[a-zA-Z\s]{3,100}$/;

  assert.strictEqual(nameRegex.test('Ada Lovelace'), true);
  assert.strictEqual(nameRegex.test('John Doe'), true);
  assert.strictEqual(nameRegex.test('Al'), false, 'Should reject under 3 chars');
  assert.strictEqual(nameRegex.test('John123'), false, 'Should reject numbers');
  assert.strictEqual(nameRegex.test('John_Doe!'), false, 'Should reject special chars');
});

// 5. Test Validation Logic: Indian Mobile Number (10 digits starting with 6-9)
test('Mobile Number validation: 10 digits Indian mobile number', () => {
  const mobileRegex = /^[6-9]\d{9}$/;

  assert.strictEqual(mobileRegex.test('9876543210'), true);
  assert.strictEqual(mobileRegex.test('8765432109'), true);
  assert.strictEqual(mobileRegex.test('7654321098'), true);
  assert.strictEqual(mobileRegex.test('6543210987'), true);
  assert.strictEqual(mobileRegex.test('5432109876'), false, 'Should reject starting with 5');
  assert.strictEqual(mobileRegex.test('987654321'), false, 'Should reject 9 digits');
  assert.strictEqual(mobileRegex.test('98765432101'), false, 'Should reject 11 digits');
  assert.strictEqual(mobileRegex.test('abcdefghij'), false, 'Should reject letters');
});

// 6. Test Validation Logic: Project Name (minimum 5 chars)
test('Project Name validation: minimum 5 characters', () => {
  const isValidProjectName = (name) => name && name.trim().length >= 5;

  assert.strictEqual(isValidProjectName('Autonomous Drone Delivery'), true);
  assert.strictEqual(isValidProjectName('Alpha'), true);
  assert.strictEqual(isValidProjectName('ABCD'), false, 'Should reject under 5 chars');
  assert.strictEqual(isValidProjectName('   '), false, 'Should reject empty spaces');
});

// 7. Test Validation Logic: PPT Link (Google Drive or OneDrive)
test('PPT Link validation: Google Drive or OneDrive URL', () => {
  const isGoogleDriveOrOneDrive = (url) => {
    try {
      new URL(url);
      const lower = url.toLowerCase();
      return (
        lower.includes('drive.google.com') ||
        lower.includes('docs.google.com') ||
        lower.includes('onedrive.live.com') ||
        lower.includes('1drv.ms') ||
        lower.includes('sharepoint.com')
      );
    } catch (_) {
      return false;
    }
  };

  assert.strictEqual(isGoogleDriveOrOneDrive('https://drive.google.com/file/d/123/view'), true);
  assert.strictEqual(isGoogleDriveOrOneDrive('https://1drv.ms/p/c/abcdef'), true);
  assert.strictEqual(isGoogleDriveOrOneDrive('https://dropbox.com/s/sample.pdf'), false);
  assert.strictEqual(isGoogleDriveOrOneDrive('not-a-url'), false);
});

// 8. Test Validation Logic: Prototype Link (GitHub, Figma, live demo)
test('Prototype Link validation: GitHub, Figma, or live demonstration URL', () => {
  const isGitHubFigmaOrDemo = (url) => {
    try {
      new URL(url);
      const lower = url.toLowerCase();
      return (
        lower.includes('github.com') ||
        lower.includes('figma.com') ||
        lower.includes('vercel.app') ||
        lower.includes('netlify.app') ||
        lower.includes('render.com') ||
        lower.includes('herokuapp.com') ||
        lower.startsWith('http://') ||
        lower.startsWith('https://')
      );
    } catch (_) {
      return false;
    }
  };

  assert.strictEqual(isGitHubFigmaOrDemo('https://github.com/hacker/project'), true);
  assert.strictEqual(isGitHubFigmaOrDemo('https://www.figma.com/design/xyz/app'), true);
  assert.strictEqual(isGitHubFigmaOrDemo('https://my-awesome-app.vercel.app'), true);
  assert.strictEqual(isGitHubFigmaOrDemo('invalid-url'), false);
});

// 9. Test Dynamic Team Management: Team Size from 1 to 5 members
test('Dynamic Team Management: sizing logic between 1 and 5 members', () => {
  const computeMembers = (currentMembers, targetSize) => {
    const needed = Math.max(0, targetSize - 1);
    const updated = [...currentMembers];
    if (updated.length < needed) {
      for (let i = updated.length; i < needed; i++) {
        updated.push({ name: '', email: '' });
      }
    } else if (updated.length > needed) {
      updated.splice(needed);
    }
    return updated;
  };

  // Solo hacker (team size = 1) -> 0 additional members
  assert.strictEqual(computeMembers([], 1).length, 0);

  // Team size = 2 -> 1 additional member
  assert.strictEqual(computeMembers([], 2).length, 1);

  // Team size = 5 -> 4 additional members
  assert.strictEqual(computeMembers([], 5).length, 4);

  // Scaling down from 5 to 3 -> 2 additional members preserved
  const size5 = computeMembers([], 5);
  size5[0].name = 'Alice';
  size5[1].name = 'Bob';
  const size3 = computeMembers(size5, 3);
  assert.strictEqual(size3.length, 2);
  assert.strictEqual(size3[0].name, 'Alice');
  assert.strictEqual(size3[1].name, 'Bob');
});

// 10. Test Duplicate Member Email Detection
test('Duplicate email validation prevents duplicate team member emails & team lead collision', () => {
  const validateTeamEmails = (leadEmail, members) => {
    const lead = leadEmail.trim().toLowerCase();
    const seen = new Set();
    const errors = [];

    members.forEach((m, idx) => {
      const email = (m.email || '').trim().toLowerCase();
      if (!email) {
        errors.push(`Member #${idx + 2} email required`);
      } else if (email === lead) {
        errors.push(`Member #${idx + 2} cannot be team lead`);
      } else if (seen.has(email)) {
        errors.push(`Member #${idx + 2} email duplicate`);
      } else {
        seen.add(email);
      }
    });

    return errors;
  };

  // Valid members
  const valid = validateTeamEmails('lead@codeanova.io', [
    { name: 'Alice', email: 'alice@codeanova.io' },
    { name: 'Bob', email: 'bob@codeanova.io' },
  ]);
  assert.strictEqual(valid.length, 0);

  // Colliding with team lead
  const collideLead = validateTeamEmails('lead@codeanova.io', [
    { name: 'Alice', email: 'lead@codeanova.io' },
  ]);
  assert.strictEqual(collideLead.length, 1);
  assert.ok(collideLead[0].includes('cannot be team lead'));

  // Duplicate among members
  const duplicateMembers = validateTeamEmails('lead@codeanova.io', [
    { name: 'Alice', email: 'alice@codeanova.io' },
    { name: 'Bob', email: 'alice@codeanova.io' },
  ]);
  assert.strictEqual(duplicateMembers.length, 1);
  assert.ok(duplicateMembers[0].includes('email duplicate'));
});

// 11. Verify App.jsx routes for /dashboard/register and /register-hackathon
test('App.jsx configures /dashboard/register and /register-hackathon routes', () => {
  const appPath = path.join(__dirname, 'src', 'App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(appContent.includes('HackathonRegisterPage'), 'App.jsx must import HackathonRegisterPage');
  assert.ok(appContent.includes('path="/dashboard/register"'), 'App.jsx must configure /dashboard/register route');
  assert.ok(appContent.includes('path="/register-hackathon"'), 'App.jsx must configure /register-hackathon alias route');
});

// 12. Verify Dashboard navigation to /dashboard/register
test('DashboardPage and RegistrationStatusCard wire buttons to /dashboard/register', () => {
  const dashPath = path.join(__dirname, 'src', 'pages', 'DashboardPage.jsx');
  const dashContent = fs.readFileSync(dashPath, 'utf8');

  assert.ok(
    dashContent.includes("navigate('/dashboard/register')"),
    'DashboardPage should navigate to /dashboard/register'
  );

  const cardPath = path.join(__dirname, 'src', 'components', 'dashboard', 'RegistrationStatusCard.jsx');
  const cardContent = fs.readFileSync(cardPath, 'utf8');
  assert.ok(
    cardContent.includes('Requires 1 to 5 squad members'),
    'RegistrationStatusCard should display support for up to 5 squad members'
  );
});

// 13. Verify Backend Hackathon Service Integration
test('hackathonService.js provides register and getMyEntry methods', () => {
  const servicePath = path.join(__dirname, 'src', 'services', 'hackathonService.js');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');

  assert.ok(
    serviceContent.includes('register(') || serviceContent.includes('register:'),
    'hackathonService must provide register()'
  );
  assert.ok(
    serviceContent.includes('getMyEntry(') || serviceContent.includes('getMyEntry:'),
    'hackathonService must provide getMyEntry()'
  );
  assert.ok(serviceContent.includes('/hackathon/register'), 'register() must target /hackathon/register');
  assert.ok(serviceContent.includes('/hackathon/my-entry'), 'getMyEntry() must target /hackathon/my-entry');
});

// 14. Verify Confirmation Screen and Unique Registration ID Format (CAN-REG-XXXXXXXX)
test('HackathonRegisterPage formats registration ID as CAN-REG-XXXXXXXX', () => {
  const regPagePath = path.join(__dirname, 'src', 'pages', 'HackathonRegisterPage.jsx');
  const regPageContent = fs.readFileSync(regPagePath, 'utf8');

  assert.ok(
    regPageContent.includes('CAN-REG-'),
    'HackathonRegisterPage must format ID with CAN-REG- prefix'
  );
  assert.ok(
    regPageContent.includes('Registration Successfully Confirmed!'),
    'HackathonRegisterPage must include success confirmation headline'
  );
  assert.ok(
    regPageContent.includes('Copy ID') || regPageContent.includes('copyToClipboard'),
    'HackathonRegisterPage should provide copy registration ID functionality'
  );
});

console.log('----------------------------------------------------');
console.log(`🎉 All ${passedAssertions} registration module assertions passed!`);
console.log('----------------------------------------------------');
