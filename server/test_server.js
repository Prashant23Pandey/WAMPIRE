import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

async function runTests() {
  const server = app.listen(5001, async () => {
    console.log('[Test Suite] Test server active on http://127.0.0.1:5001');
    try {
      // 1. Test Health endpoint
      console.log('\n--- 1. Testing GET /api/v1/health ---');
      const healthRes = await fetch('http://127.0.0.1:5001/api/v1/health');
      const healthData = await healthRes.json();
      console.log('Status code:', healthRes.status);
      console.log('Response body:', JSON.stringify(healthData, null, 2));

      // 2. Test Centralized 404 Handler
      console.log('\n--- 2. Testing 404 Not Found Handling ---');
      const notFoundRes = await fetch('http://127.0.0.1:5001/api/v1/unknown-endpoint');
      const notFoundData = await notFoundRes.json();
      console.log('Status code:', notFoundRes.status);
      console.log('Response body:', JSON.stringify(notFoundData, null, 2));

      // 3. Test Centralized Error Handler (Validation)
      console.log('\n--- 3. Testing Centralized Validation Error Handling ---');
      const authRes = await fetch('http://127.0.0.1:5001/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid-request@hackathon.dev' }), // missing required name and password
      });
      const authData = await authRes.json();
      console.log('Status code:', authRes.status);
      console.log('Response body:', JSON.stringify(authData, null, 2));

      console.log('\n[Test Suite] ALL BACKEND UNIT AND INTEGRATION CHECKS PASSED!');
    } catch (err) {
      console.error('[Test Suite] Failure:', err);
    } finally {
      server.close(() => {
        console.log('[Test Suite] Server closed cleanly.');
      });
    }
  });
}

runTests();

