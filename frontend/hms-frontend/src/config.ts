// src/config.ts
export const MOCK_MODE = true; // set to true to test UI without backend

// Small helper to generate a fake token for mock login
export function makeFakeToken(role: 'ADMIN'|'DOCTOR'|'PATIENT' = 'ADMIN') {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'mock-user', role, exp: Date.now() + 1000 * 60 * 60 }));
  return `${header}.${payload}.signature`;
}
