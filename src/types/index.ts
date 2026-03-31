// Shared types for all services

export interface BackendResponse<T = unknown> {
  EC: number; // Error Code
  EM: string; // Error Message
  DT: T; // Data
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    username?: string;
    fullName?: string;
  };
}

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FilterOptions {
  skip?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}
