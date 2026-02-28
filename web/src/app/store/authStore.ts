import { create } from 'zustand';
import { AxiosError } from 'axios';
import { authApi, BackendAuthUser } from '../api/authApi';
import { AUTH_TOKEN_KEY } from '../api/httpClient';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'doctor' | 'receptionist';
  avatar?: string;
  phone?: string;
  specialization?: string;
  workSchedule?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    role: User['role'];
    organizationName: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  initAuth: () => Promise<void>;
}

function mapRole(role: BackendAuthUser['role']): User['role'] {
  if (role === 'DOCTOR') return 'doctor';
  return 'admin';
}

function mapUser(user: BackendAuthUser): User {
  return {
    id: user.id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    role: mapRole(user.role)
  };
}

function parseName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'User',
    lastName: parts.slice(1).join(' ') || 'Account'
  };
}

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      set({ user: mapUser(response.user), isAuthenticated: true });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Неверный email или пароль'));
    }
  },

  register: async (data) => {
    try {
      const { firstName, lastName } = parseName(data.fullName);
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        organizationName: data.organizationName
      });
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      set({ user: mapUser(response.user), isAuthenticated: true });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Ошибка регистрации'));
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null
    }));
  },

  initAuth: async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      set({ user: null, isAuthenticated: false, isInitialized: true });
      return;
    }

    try {
      const response = await authApi.me();
      set({ user: mapUser(response.user), isAuthenticated: true, isInitialized: true });
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  }
}));
