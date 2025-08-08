// src/api/authAPI.ts
export const login = (data) => axios.post('/api/auth/login', data);
export const register = (data) => axios.post('/api/auth/register', data);
