import { User } from './user';

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  profilePictureUrl?: string;
  bio?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}