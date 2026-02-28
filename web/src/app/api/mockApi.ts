import axios from 'axios';
import { Patient, Appointment } from '../store/crmStore';

// Настройка axios
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor для добавления токена авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mockDelay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Mock данные (используются с TanStack Query)
const mockPatientsData: Patient[] = [
  {
    id: '1',
    fullName: 'Петров Иван Сергеевич',
    phone: '+7 (999) 123-45-67',
    email: 'petrov@example.com',
    birthDate: '1985-03-15',
    lastVisit: '2026-02-20',
    nextAppointment: '2026-03-05'
  },
  {
    id: '2',
    fullName: 'Сидорова Мария Александровна',
    phone: '+7 (999) 234-56-78',
    email: 'sidorova@example.com',
    birthDate: '1990-07-22',
    lastVisit: '2026-02-15'
  },
  {
    id: '3',
    fullName: 'Козлов Алексей Дмитриевич',
    phone: '+7 (999) 345-67-89',
    birthDate: '1978-11-30',
    lastVisit: '2026-02-25',
    nextAppointment: '2026-03-10'
  }
];

const mockAppointmentsData: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Петров Иван Сергеевич',
    doctorId: '1',
    doctorName: 'Доктор Иванов',
    date: '2026-03-05',
    time: '10:00',
    service: 'Лечение кариеса',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Козлов Алексей Дмитриевич',
    doctorId: '1',
    doctorName: 'Доктор Иванов',
    date: '2026-03-10',
    time: '14:30',
    service: 'Профессиональная чистка',
    status: 'scheduled'
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Сидорова Мария Александровна',
    doctorId: '2',
    doctorName: 'Доктор Смирнова',
    date: '2026-02-28',
    time: '11:00',
    service: 'Консультация',
    status: 'completed'
  }
];

// API методы для пациентов (с TanStack Query)
export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    await mockDelay();
    return mockPatientsData;
  },

  getById: async (id: string): Promise<Patient | undefined> => {
    await mockDelay();
    return mockPatientsData.find(p => p.id === id);
  },

  create: async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    await mockDelay();
    return { ...patient, id: Math.random().toString(36).substring(7) };
  },

  update: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    await mockDelay();
    const patient = mockPatientsData.find(p => p.id === id);
    return { ...patient!, ...data };
  },

  delete: async (id: string): Promise<void> => {
    await mockDelay();
    console.log(`Deleted patient ${id}`);
  }
};

// API методы для записей (с TanStack Query)
export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    await mockDelay();
    return mockAppointmentsData;
  },

  getById: async (id: string): Promise<Appointment | undefined> => {
    await mockDelay();
    return mockAppointmentsData.find(a => a.id === id);
  },

  create: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    await mockDelay();
    return { ...appointment, id: Math.random().toString(36).substring(7) };
  },

  update: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    await mockDelay();
    const appointment = mockAppointmentsData.find(a => a.id === id);
    return { ...appointment!, ...data };
  },

  delete: async (id: string): Promise<void> => {
    await mockDelay();
    console.log(`Deleted appointment ${id}`);
  }
};

// API методы для аутентификации
export const authApi = {
  login: async (email: string, _password: string) => {
    await mockDelay(800);
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email,
        fullName: 'Доктор Иванов Алексей',
        role: 'doctor' as const,
        avatar: undefined
      }
    };
  },

  register: async (data: { email: string; password: string; fullName: string; role: string }) => {
    await mockDelay(800);
    return {
      token: 'mock-jwt-token',
      user: {
        id: Math.random().toString(36),
        email: data.email,
        fullName: data.fullName,
        role: data.role as 'admin' | 'doctor' | 'receptionist'
      }
    };
  },

  logout: async () => {
    await mockDelay(200);
    localStorage.removeItem('authToken');
  }
};

export default api;
