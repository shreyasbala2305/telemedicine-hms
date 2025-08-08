// // src/services/authService.ts

// import axios from 'axios';
// import { LoginRequest, AuthResponse } from '@/types/auth';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
//   const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials);
//   return response.data;
// };

// export const saveAuthToken = (token: string) => {
//   localStorage.setItem('auth_token', token);
// };

// export const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token');
// };

// export const logout = () => {
//   localStorage.removeItem('auth_token');
// };

import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/auth';

export const login = (email: string, password: string) => {
  return axios.post(`${API}/login`, { email, password });
};

export const register = (name: string, email: string, password: string) => {
  return axios.post(`${API}/register`, { name, email, password });
};
