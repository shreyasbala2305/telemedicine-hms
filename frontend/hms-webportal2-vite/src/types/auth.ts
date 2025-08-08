// User Registration
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// User Login
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Token Response from backend
export interface AuthResponse {
  token: string;
  userId: number;
  role: string;
}
