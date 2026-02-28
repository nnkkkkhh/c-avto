// Общие типы для приложения

export type UserRole = 'admin' | 'doctor' | 'receptionist';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  birthDate: string;
  lastVisit?: string;
  nextAppointment?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  service: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Statistics {
  totalPatients: number;
  todayAppointments: number;
  activeAppointments: number;
  completedServices: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
