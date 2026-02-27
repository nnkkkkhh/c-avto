import { create } from 'zustand';

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
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; role: User['role'] }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 900));
    const mockUser: User = {
      id: '1',
      email,
      fullName: 'Иванов Алексей Петрович',
      role: 'doctor',
      phone: '+7 (999) 000-11-22',
      specialization: 'Терапевт-стоматолог',
      workSchedule: 'Пн-Пт, 09:00 – 18:00'
    };
    set({ user: mockUser, isAuthenticated: true });
  },

  register: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 900));
    const newUser: User = {
      id: Math.random().toString(36),
      email: data.email,
      fullName: data.fullName,
      role: data.role
    };
    set({ user: newUser, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null
    }));
  }
}));
