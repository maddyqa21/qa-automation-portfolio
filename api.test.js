// ============================================================
// REST API Test Suite - Portfolio Project
// Tool: Node.js + node-fetch (no framework dependency)
// Target API: https://reqres.in (free public REST API)
// Author: My Portfolio
// Covers: CRUD operations, status codes, schema validation,
//         negative tests, response time checks
// ============================================================

const BASE_URL = 'https://reqres.in/api';

// ─── Utility: Lightweight Test Runner ────────────────────────
let passed = 0;
let failed = 0;
const results = [];

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
    results.push({ status: 'PASS', label });
  } else {
    console.error(`  ❌ FAIL: ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
    results.push({ status: 'FAIL', label, detail });
  }
}

async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const start = Date.now();
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const duration = Date.now() - start;

  let json = null;
  try { json = await response.json(); } catch (_) {}

  return { status: response.status, json, duration };
}

// ─── Test Suite 1: GET Users ──────────────────────────────────
async function testGetUsers() {
  console.log('\n📋 Suite 1: GET Users');
  const { status, json, duration } = await apiRequest('GET', '/users?page=1');

  assert('Status is 200', status === 200);
  assert('Response time < 2000ms', duration < 2000, `${duration}ms`);
  assert('Response has data array', Array.isArray(json?.data));
  assert('Data has at least 1 user', json?.data?.length > 0);
  assert('First user has id field', json?.data[0]?.id !== undefined);
  assert('First user has valid email', json?.data[0]?.email?.includes('@'));
  assert('Pagination info present', json?.total !== undefined && json?.per_page !== undefined);

  return json?.data[0]?.id; // Return for chaining
}

// ─── Test Suite 2: GET Single User ───────────────────────────
async function testGetSingleUser(userId) {
  console.log(`\n👤 Suite 2: GET Single User (ID: ${userId})`);
  const { status, json } = await apiRequest('GET', `/users/${userId}`);

  assert('Status is 200', status === 200);
  assert('Data object is present', json?.data !== undefined);
  assert('User ID matches request', json?.data?.id === userId);
  assert('Avatar URL is a string', typeof json?.data?.avatar === 'string');
  assert('Support URL is present', json?.support?.url !== undefined);
}

// ─── Test Suite 3: GET Non-Existent User (404) ───────────────
async function testUserNotFound() {
  console.log('\n🔍 Suite 3: GET Non-Existent User');
  const { status, json } = await apiRequest('GET', '/users/9999');

  assert('Status is 404', status === 404);
  assert('Response body is empty object', JSON.stringify(json) === '{}');
}

// ─── Test Suite 4: POST Create User ──────────────────────────
async function testCreateUser() {
  console.log('\n➕ Suite 4: POST Create User');
  const payload = { name: 'QA Engineer', job: 'Automation Tester' };
  const { status, json, duration } = await apiRequest('POST', '/users', payload);

  assert('Status is 201 Created', status === 201);
  assert('Response time < 2000ms', duration < 2000, `${duration}ms`);
  assert('Name matches payload', json?.name === payload.name);
  assert('Job matches payload', json?.job === payload.job);
  assert('ID is generated', json?.id !== undefined);
  assert('createdAt is present', json?.createdAt !== undefined);
  assert('createdAt is valid date', !isNaN(new Date(json?.createdAt).getTime()));

  return json?.id;
}

// ─── Test Suite 5: PUT Update User ───────────────────────────
async function testUpdateUser(userId) {
  console.log(`\n✏️  Suite 5: PUT Update User (ID: ${userId})`);
  const payload = { name: 'Senior QA Engineer', job: 'Lead Tester' };
  const { status, json } = await apiRequest('PUT', `/users/${userId}`, payload);

  assert('Status is 200', status === 200);
  assert('Name is updated', json?.name === payload.name);
  assert('Job is updated', json?.job === payload.job);
  assert('updatedAt timestamp present', json?.updatedAt !== undefined);
}

// ─── Test Suite 6: PATCH Partial Update ──────────────────────
async function testPatchUser(userId) {
  console.log(`\n🔧 Suite 6: PATCH Partial Update (ID: ${userId})`);
  const payload = { job: 'SDET' };
  const { status, json } = await apiRequest('PATCH', `/users/${userId}`, payload);

  assert('Status is 200', status === 200);
  assert('Job field is updated', json?.job === 'SDET');
  assert('updatedAt is present', json?.updatedAt !== undefined);
}

// ─── Test Suite 7: DELETE User ───────────────────────────────
async function testDeleteUser(userId) {
  console.log(`\n🗑️  Suite 7: DELETE User (ID: ${userId})`);
  const { status } = await apiRequest('DELETE', `/users/${userId}`);

  assert('Status is 204 No Content', status === 204);
}

// ─── Test Suite 8: Negative - Register Without Password ──────
async function testRegisterMissingPassword() {
  console.log('\n🚫 Suite 8: Negative - Register Without Password');
  const { status, json } = await apiRequest('POST', '/register', { email: 'sydney@fife' });

  assert('Status is 400 Bad Request', status === 400);
  assert('Error field is present', json?.error !== undefined);
  assert('Error message is correct', json?.error === 'Missing password');
}

// ─── Test Suite 9: Negative - Login With Wrong Credentials ───
async function testLoginFail() {
  console.log('\n🚫 Suite 9: Negative - Login with Wrong Password');
  const { status, json } = await apiRequest('POST', '/login', {
    email: 'peter@klaven',
    password: 'wrongpassword'
  });

  assert('Status is 400', status === 400);
  assert('Error message returned', json?.error !== undefined);
}

// ─── Test Suite 10: Delayed Response Test ────────────────────
async function testDelayedResponse() {
  console.log('\n⏱️  Suite 10: Delayed Response (3s delay endpoint)');
  const { status, json, duration } = await apiRequest('GET', '/users?delay=2');

  assert('Status is 200', status === 200);
  assert('Response came back (within 10s)', duration < 10000, `${duration}ms`);
  assert('Data is still valid', Array.isArray(json?.data));
  console.log(`  ℹ️  Actual response time: ${duration}ms`);
}

// ─── Main Runner ──────────────────────────────────────────────
async function runAll() {
  console.log('='.repeat(60));
  console.log('  REST API TEST SUITE — My Portfolio');
  console.log('  Target: https://reqres.in/api');
  console.log('='.repeat(60));

  const firstUserId = await testGetUsers();
  await testGetSingleUser(firstUserId);
  await testUserNotFound();
  const newUserId = await testCreateUser();
  await testUpdateUser(newUserId ?? 2);
  await testPatchUser(newUserId ?? 2);
  await testDeleteUser(newUserId ?? 2);
  await testRegisterMissingPassword();
  await testLoginFail();
  await testDelayedResponse();

  console.log('\n' + '='.repeat(60));
  console.log(`  TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60));

  if (failed > 0) process.exit(1);
}

runAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
