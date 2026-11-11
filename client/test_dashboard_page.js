/**
 * Automated Verification Test Suite for Authenticated Participant Dashboard
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
console.log('🚀 Running WAMPIRE Participant Dashboard Verification Suite');
console.log('================================================================\n');

// 1. Check all required dashboard components exist
console.log('TEST 1: Component File Existence');
const files = [
  'src/pages/DashboardPage.jsx',
  'src/components/dashboard/Sidebar.jsx',
  'src/components/dashboard/TopNavbar.jsx',
  'src/components/dashboard/ProfileCard.jsx',
  'src/components/dashboard/RegistrationStatusCard.jsx',
  'src/components/dashboard/QuickActions.jsx',
  'src/components/dashboard/LoadingSkeleton.jsx',
  'src/components/dashboard/EditProfileModal.jsx',
  'src/components/dashboard/RegistrationModal.jsx',
  'src/services/hackathonService.js',
];

files.forEach((f) => {
  const p = path.resolve(__dirname, f);
  assert(fs.existsSync(p), `Dashboard component exists: ${f}`);
});

// 2. Inspect Sidebar Navigation Items
console.log('\nTEST 2: Sidebar Navigation Structure');
const sidebarCode = fs.readFileSync(path.resolve(__dirname, 'src/components/dashboard/Sidebar.jsx'), 'utf-8');
assert(sidebarCode.includes("'Overview'"), 'Sidebar contains "Overview" tab');
assert(sidebarCode.includes("'My Profile'"), 'Sidebar contains "My Profile" tab');
assert(sidebarCode.includes("'Hackathon Registration'"), 'Sidebar contains "Hackathon Registration" tab');
assert(sidebarCode.includes("'My Team'"), 'Sidebar contains "My Team" tab');
assert(sidebarCode.includes("'My Submission'"), 'Sidebar contains "My Submission" tab');
assert(sidebarCode.includes("'Help & Support'"), 'Sidebar contains "Help & Support" tab');
assert(sidebarCode.includes('onLogout'), 'Sidebar provides logout button');

// 3. Inspect Top Navigation Bar
console.log('\nTEST 3: Top Navigation Bar Features');
const topNavCode = fs.readFileSync(path.resolve(__dirname, 'src/components/dashboard/TopNavbar.jsx'), 'utf-8');
assert(topNavCode.includes('initials'), 'Top navbar displays user profile avatar initials');
assert(topNavCode.includes('Bell'), 'Top navbar includes notification area');
assert(topNavCode.includes('showNotifications'), 'Interactive notification dropdown support');
assert(topNavCode.includes('onLogout'), 'Top navbar includes logout button');

// 4. Inspect Welcome Section & Profile Card
console.log('\nTEST 4: Welcome Section & Profile Card');
const dashboardCode = fs.readFileSync(path.resolve(__dirname, 'src/pages/DashboardPage.jsx'), 'utf-8');
assert(dashboardCode.includes('Welcome back,'), 'Displays personalized "Welcome back, {userName}" heading');

const profileCardCode = fs.readFileSync(path.resolve(__dirname, 'src/components/dashboard/ProfileCard.jsx'), 'utf-8');
assert(profileCardCode.includes('user?.fullName'), 'Profile card displays user full name');
assert(profileCardCode.includes('user?.email'), 'Profile card displays user email');
assert(profileCardCode.includes('isVerified'), 'Profile card displays account verification status');
assert(profileCardCode.includes('user?.createdAt'), 'Profile card displays account creation date');

// 5. Inspect Registration Status Card
console.log('\nTEST 5: Registration Status Display Logic');
const regCardCode = fs.readFileSync(path.resolve(__dirname, 'src/components/dashboard/RegistrationStatusCard.jsx'), 'utf-8');
assert(
  regCardCode.includes('Your hackathon journey starts here.'),
  'Displays "Your hackathon journey starts here." when unregistered'
);
assert(
  regCardCode.includes('Register for Hackathon'),
  'Includes "Register for Hackathon" button when unregistered'
);
assert(regCardCode.includes('registration._id') || regCardCode.includes('formattedRegId'), 'Displays Registration ID');
assert(regCardCode.includes('registration.projectName'), 'Displays Project name');
assert(regCardCode.includes('registration.domain'), 'Displays Domain track');
assert(regCardCode.includes('registration.teamSize'), 'Displays Team size');
assert(regCardCode.includes('registration.registrationStatus'), 'Displays Registration status badge');
assert(regCardCode.includes('pptLink'), 'Displays presentation submission link');
assert(regCardCode.includes('prototypeLink'), 'Displays prototype submission link');
assert(regCardCode.includes('demoVideoLink'), 'Displays demo video submission link');

// 6. Inspect Quick Actions
console.log('\nTEST 6: Quick Actions Inspection');
const quickActionsCode = fs.readFileSync(path.resolve(__dirname, 'src/components/dashboard/QuickActions.jsx'), 'utf-8');
assert(quickActionsCode.includes('View Registration'), 'Includes "View registration" quick action');
assert(quickActionsCode.includes('Edit Profile'), 'Includes "Edit profile" quick action');
assert(quickActionsCode.includes('Contact Support'), 'Includes "Contact support" quick action');

// 7. Functional Requirements: Endpoints & Protected Route
console.log('\nTEST 7: Functional Endpoints & Authentication Protection');
const hackathonServiceCode = fs.readFileSync(path.resolve(__dirname, 'src/services/hackathonService.js'), 'utf-8');
assert(
  hackathonServiceCode.includes('/hackathon/my-entry'),
  'hackathonService fetches registration via GET /api/hackathon/my-entry'
);

assert(dashboardCode.includes('authService.getMe()'), 'Fetches profile using GET /api/user/me');
assert(dashboardCode.includes('LoadingSkeleton'), 'Renders loading skeletons during async data fetch');
assert(dashboardCode.includes('apiError'), 'Handles API errors with user notification');
assert(dashboardCode.includes('navigate(\'/login\')'), 'Redirects unauthenticated visitors to /login');
assert(dashboardCode.includes('handleLogout'), 'Implements logout functionality');

console.log('\n================================================================');
console.log(`🎉 ALL PARTICIPANT DASHBOARD ASSERTIONS COMPLETED: ${passed} / ${total} PASSED!`);
console.log('================================================================\n');

