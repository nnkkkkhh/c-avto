import { create } from 'zustand';

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  birthDate: string;
  lastVisit?: string;
  nextAppointment?: string;
  notes?: string;
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
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface DentalService {
  id: string;
  name: string;
  category: string;
  duration: number; // in minutes
  price: number;
  description?: string;
}

interface CrmState {
  patients: Patient[];
  appointments: Appointment[];
  services: DentalService[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addService: (service: Omit<DentalService, 'id'>) => void;
  updateService: (id: string, data: Partial<DentalService>) => void;
  deleteService: (id: string) => void;
}

// Mock данные - пациенты
const mockPatients: Patient[] = [
  {
    id: '1',
    fullName: 'Петров Иван Сергеевич',
    phone: '+7 (999) 123-45-67',
    email: 'petrov@example.com',
    birthDate: '1985-03-15',
    lastVisit: '2026-02-20',
    nextAppointment: '2026-03-05',
    notes: 'Аллергия на пенициллин'
  },
  {
    id: '2',
    fullName: 'Сидорова Мария Александровна',
    phone: '+7 (999) 234-56-78',
    email: 'sidorova@example.com',
    birthDate: '1990-07-22',
    lastVisit: '2026-02-15',
    notes: 'Регулярный пациент'
  },
  {
    id: '3',
    fullName: 'Козлов Алексей Дмитриевич',
    phone: '+7 (999) 345-67-89',
    birthDate: '1978-11-30',
    lastVisit: '2026-02-25',
    nextAppointment: '2026-03-10'
  },
  {
    id: '4',
    fullName: 'Новикова Екатерина Владимировна',
    phone: '+7 (999) 456-78-90',
    email: 'novikova@example.com',
    birthDate: '1995-05-18',
    lastVisit: '2026-01-30',
    nextAppointment: '2026-03-15'
  },
  {
    id: '5',
    fullName: 'Смирнов Дмитрий Павлович',
    phone: '+7 (999) 567-89-01',
    birthDate: '1982-09-25',
    lastVisit: '2026-02-10'
  },
  {
    id: '6',
    fullName: 'Лебедева Анна Николаевна',
    phone: '+7 (999) 678-90-12',
    email: 'lebedeva@example.com',
    birthDate: '1988-12-03',
    lastVisit: '2026-02-22',
    nextAppointment: '2026-03-20',
    notes: 'Страх перед бормашиной'
  },
  {
    id: '7',
    fullName: 'Волков Андрей Игоревич',
    phone: '+7 (999) 789-01-23',
    birthDate: '1975-04-11',
    lastVisit: '2026-02-05',
    nextAppointment: '2026-03-08'
  }
];

// Mock данные - записи
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Петров Иван Сергеевич',
    doctorId: '1',
    doctorName: 'Доктор Иванов А.П.',
    date: '2026-03-05',
    time: '10:00',
    service: 'Лечение кариеса',
    status: 'scheduled',
    notes: 'Кариес 2-го зуба нижней челюсти'
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Козлов Алексей Дмитриевич',
    doctorId: '1',
    doctorName: 'Доктор Иванов А.П.',
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
    doctorName: 'Доктор Смирнова Е.В.',
    date: '2026-02-28',
    time: '11:00',
    service: 'Консультация',
    status: 'completed'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Новикова Екатерина Владимировна',
    doctorId: '2',
    doctorName: 'Доктор Смирнова Е.В.',
    date: '2026-03-15',
    time: '09:30',
    service: 'Отбеливание зубов',
    status: 'scheduled'
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'Смирнов Дмитрий Павлович',
    doctorId: '1',
    doctorName: 'Доктор Иванов А.П.',
    date: '2026-02-25',
    time: '16:00',
    service: 'Удаление зуба',
    status: 'completed'
  },
  {
    id: '6',
    patientId: '6',
    patientName: 'Лебедева Анна Николаевна',
    doctorId: '3',
    doctorName: 'Доктор Козлов М.С.',
    date: '2026-03-20',
    time: '12:00',
    service: 'Установка брекетов',
    status: 'scheduled',
    notes: 'Первичный прием, требуется обезболивание'
  },
  {
    id: '7',
    patientId: '7',
    patientName: 'Волков Андрей Игоревич',
    doctorId: '1',
    doctorName: 'Доктор Иванов А.П.',
    date: '2026-03-08',
    time: '13:00',
    service: 'Протезирование',
    status: 'scheduled'
  },
  {
    id: '8',
    patientId: '1',
    patientName: 'Петров Иван Сергеевич',
    doctorId: '2',
    doctorName: 'Доктор Смирнова Е.В.',
    date: '2026-02-10',
    time: '10:30',
    service: 'Рентген',
    status: 'completed'
  }
];

// Mock данные - услуги
const mockServices: DentalService[] = [
  {
    id: '1',
    name: 'Консультация',
    category: 'Диагностика',
    duration: 30,
    price: 1500,
    description: 'Первичный осмотр и консультация стоматолога'
  },
  {
    id: '2',
    name: 'Лечение кариеса',
    category: 'Терапия',
    duration: 60,
    price: 4500,
    description: 'Лечение кариеса с установкой пломбы'
  },
  {
    id: '3',
    name: 'Профессиональная чистка',
    category: 'Гигиена',
    duration: 45,
    price: 3500,
    description: 'Ультразвуковая чистка и полировка зубов'
  },
  {
    id: '4',
    name: 'Отбеливание зубов',
    category: 'Эстетика',
    duration: 90,
    price: 12000,
    description: 'Профессиональное отбеливание системой Zoom'
  },
  {
    id: '5',
    name: 'Удаление зуба',
    category: 'Хирургия',
    duration: 45,
    price: 3000,
    description: 'Простое удаление зуба под анестезией'
  },
  {
    id: '6',
    name: 'Установка брекетов',
    category: 'Ортодонтия',
    duration: 120,
    price: 45000,
    description: 'Установка металлических или керамических брекетов'
  },
  {
    id: '7',
    name: 'Протезирование',
    category: 'Ортопедия',
    duration: 90,
    price: 25000,
    description: 'Изготовление и установка зубных протезов'
  },
  {
    id: '8',
    name: 'Рентген зуба',
    category: 'Диагностика',
    duration: 15,
    price: 800,
    description: 'Прицельный рентгеновский снимок'
  }
];

export const useCrmStore = create<CrmState>((set) => ({
  patients: mockPatients,
  appointments: mockAppointments,
  services: mockServices,

  addPatient: (patient) => {
    const newPatient: Patient = {
      ...patient,
      id: Math.random().toString(36).substring(7)
    };
    set((state) => ({ patients: [...state.patients, newPatient] }));
  },

  updatePatient: (id, data) => {
    set((state) => ({
      patients: state.patients.map(p =>
        p.id === id ? { ...p, ...data } : p
      )
    }));
  },

  deletePatient: (id) => {
    set((state) => ({
      patients: state.patients.filter(p => p.id !== id)
    }));
  },

  addAppointment: (appointment) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substring(7)
    };
    set((state) => ({ appointments: [...state.appointments, newAppointment] }));
  },

  updateAppointment: (id, data) => {
    set((state) => ({
      appointments: state.appointments.map(a =>
        a.id === id ? { ...a, ...data } : a
      )
    }));
  },

  deleteAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter(a => a.id !== id)
    }));
  },

  addService: (service) => {
    const newService: DentalService = {
      ...service,
      id: Math.random().toString(36).substring(7)
    };
    set((state) => ({ services: [...state.services, newService] }));
  },

  updateService: (id, data) => {
    set((state) => ({
      services: state.services.map(s =>
        s.id === id ? { ...s, ...data } : s
      )
    }));
  },

  deleteService: (id) => {
    set((state) => ({
      services: state.services.filter(s => s.id !== id)
    }));
  }
}));
