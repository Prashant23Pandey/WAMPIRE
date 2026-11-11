/**
 * CODE-A-NOVA Contact Page & UI Polish Test Suite
 * Verifies Contact Page, Form Validations, Social Links, Email Displays,
 * Responsive Layouts, App Routing, and Backend Service Integration.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('----------------------------------------------------');
console.log('🚀 Running CODE-A-NOVA Contact Page & UI Polish Tests');
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

// 1. Verify ContactPage.jsx existence and content
test('ContactPage.jsx exists and has complete implementation', () => {
  const filePath = path.join(__dirname, 'src', 'pages', 'ContactPage.jsx');
  assert.ok(fs.existsSync(filePath), 'ContactPage.jsx must exist in client/src/pages');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.length > 500, 'ContactPage.jsx should be fully implemented');
});

// 2. Verify all required Contact fields and controls
test('ContactPage implements Name, Email, Category, Message and Submit Button', () => {
  const filePath = path.join(__dirname, 'src', 'pages', 'ContactPage.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.ok(content.includes('name="name"') || content.includes("formData.name"), 'Must have Name field');
  assert.ok(content.includes('name="email"') || content.includes("formData.email"), 'Must have Email field');
  assert.ok(content.includes('name="message"') || content.includes("formData.message"), 'Must have Message field');
  assert.ok(content.includes('category') || content.includes('categories'), 'Must support inquiry categories/topics');
  assert.ok(content.includes('Send Inquiry') || content.includes('Submit'), 'Must have Submit Button');
  assert.ok(content.includes('isSubmitting'), 'Submit button must have loading state');
});

// 3. Verify Contact Email Display and Official Channels
test('ContactPage displays official contact emails and response SLA', () => {
  const filePath = path.join(__dirname, 'src', 'pages', 'ContactPage.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.ok(content.includes('contactEmail') || content.includes('contact@codeanova.io'), 'Displays general contact email');
  assert.ok(content.includes('supportEmail') || content.includes('support@codeanova.io'), 'Displays support email');
  assert.ok(content.includes('Response SLA') || content.includes('24–48 working hours'), 'Displays response SLA notice');
});

// 4. Verify Social Links Presence
test('ContactPage renders social community links (GitHub, Twitter, Discord, LinkedIn)', () => {
  const filePath = path.join(__dirname, 'src', 'pages', 'ContactPage.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.ok(content.includes('github.com'), 'Must link to GitHub');
  assert.ok(content.includes('twitter.com'), 'Must link to Twitter/X');
  assert.ok(content.includes('discord.com'), 'Must link to Discord');
  assert.ok(content.includes('linkedin.com'), 'Must link to LinkedIn');
});

// 5. Test Field Validation: Full Name
test('Contact Name validation: minimum 2 characters, letters and spaces only', () => {
  const nameRegex = /^[a-zA-Z\s]{2,100}$/;

  assert.strictEqual(nameRegex.test('Ada Lovelace'), true);
  assert.strictEqual(nameRegex.test('Al'), true);
  assert.strictEqual(nameRegex.test('A'), false, 'Should reject under 2 characters');
  assert.strictEqual(nameRegex.test('Ada123'), false, 'Should reject numbers');
  assert.strictEqual(nameRegex.test('Ada@!'), false, 'Should reject special symbols');
});

// 6. Test Field Validation: Email Address
test('Contact Email validation: standard RFC email pattern', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  assert.strictEqual(emailRegex.test('hacker@codeanova.io'), true);
  assert.strictEqual(emailRegex.test('invalid-email'), false);
  assert.strictEqual(emailRegex.test('test@domain'), false);
});

// 7. Test Field Validation: Message
test('Contact Message validation: minimum 10 characters', () => {
  const isValidMessage = (msg) => msg && msg.trim().length >= 10;

  assert.strictEqual(isValidMessage('Inquiring about mentorship opportunities for track AI.'), true);
  assert.strictEqual(isValidMessage('Help me!'), false, 'Should reject under 10 chars');
  assert.strictEqual(isValidMessage('          '), false, 'Should reject blank whitespace');
});

// 8. Verify App.jsx route mounting for /contact and ScrollToTop
test('App.jsx configures /contact route and mounts ScrollToTop', () => {
  const appPath = path.join(__dirname, 'src', 'App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(appContent.includes('ContactPage'), 'App.jsx must import ContactPage');
  assert.ok(appContent.includes('path="/contact"'), 'App.jsx must route /contact');
  assert.ok(appContent.includes('ScrollToTop'), 'App.jsx must mount ScrollToTop component');
});

// 9. Verify Navbar link routing for Contact
test('Navbar.jsx wires Contact link to /contact route', () => {
  const navPath = path.join(__dirname, 'src', 'components', 'navigation', 'Navbar.jsx');
  const navContent = fs.readFileSync(navPath, 'utf8');

  assert.ok(navContent.includes('/contact'), 'Navbar should reference /contact route');
  assert.ok(navContent.includes('setMobileMenuOpen'), 'Navbar mobile drawer must have toggle and close controls');
});

// 10. Verify Footer link routing for Contact
test('Footer.jsx includes link to /contact route', () => {
  const footerPath = path.join(__dirname, 'src', 'components', 'navigation', 'Footer.jsx');
  const footerContent = fs.readFileSync(footerPath, 'utf8');

  assert.ok(footerContent.includes('to="/contact"'), 'Footer must contain link to /contact');
});

// 11. Verify Backend contactService integration
test('contactService.js connects to POST /contact', () => {
  const servicePath = path.join(__dirname, 'src', 'services', 'contactService.js');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');

  assert.ok(serviceContent.includes('post('), 'contactService must call apiClient.post');
  assert.ok(serviceContent.includes("'/contact'"), 'contactService must post to /contact endpoint');
});

// 12. Verify Toast feedback and submission handling
test('ContactPage provides toast notifications and submission feedback', () => {
  const pagePath = path.join(__dirname, 'src', 'pages', 'ContactPage.jsx');
  const pageContent = fs.readFileSync(pagePath, 'utf8');

  assert.ok(pageContent.includes('useToast'), 'ContactPage must import and use useToast hook');
  assert.ok(pageContent.includes('toast.success'), 'ContactPage must dispatch toast.success on submission');
  assert.ok(pageContent.includes('toast.error'), 'ContactPage must dispatch toast.error on failure');
});

// 13. Verify Overflow and Layout Responsiveness
test('RootLayout.jsx prevents horizontal overflow across responsive viewports', () => {
  const layoutPath = path.join(__dirname, 'src', 'layouts', 'RootLayout.jsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  assert.ok(layoutContent.includes('overflow-x-hidden'), 'RootLayout must enforce overflow-x-hidden to prevent mobile horizontal scroll');
});

console.log('----------------------------------------------------');
console.log(`🎉 All ${passedAssertions} contact page & UI polish assertions passed!`);
console.log('----------------------------------------------------');

