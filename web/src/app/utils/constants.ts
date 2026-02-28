// Константы приложения

export const APP_NAME = 'DentalCRM';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  PROFILE: '/profile'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist'
} as const;

export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show'
} as const;

export const SERVICES = [
  'Консультация',
  'Лечение кариеса',
  'Удаление зуба',
  'Чистка зубов',
  'Отбеливание',
  'Протезирование',
  'Имплантация',
  'Ортодонтия',
  'Пародонтология'
] as const;

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00'
] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
} as const;

export const DATE_FORMAT = {
  FULL: 'd MMMM yyyy',
  SHORT: 'd MMM yyyy',
  COMPACT: 'dd.MM.yyyy',
  TIME: 'HH:mm'
} as const;
