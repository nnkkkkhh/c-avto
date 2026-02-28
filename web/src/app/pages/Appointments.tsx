import { useState } from 'react';
import { useCrmStore, Appointment } from '../store/crmStore';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Calendar, Clock, User, Filter, X, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  scheduled: { label: 'Запланировано', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  completed: { label: 'Завершено', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { label: 'Отменено', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  'no-show': { label: 'Не пришёл', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
} as const;

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${cfg.bg} ${cfg.text}`} style={{ fontWeight: 500 }}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

function AppointmentModal({
  appointment,
  patients,
  onClose,
  onSave
}: {
  appointment: Appointment | null;
  patients: { id: string; fullName: string }[];
  onClose: () => void;
  onSave: (data: Omit<Appointment, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    patientName: appointment?.patientName || '',
    doctorId: appointment?.doctorId || '1',
    doctorName: appointment?.doctorName || 'Доктор Иванов А.П.',
    date: appointment?.date || '',
    time: appointment?.time || '',
    service: appointment?.service || '',
    status: appointment?.status || 'scheduled' as Appointment['status'],
    notes: appointment?.notes || ''
  });

  const doctors = [
    { id: '1', name: 'Доктор Иванов А.П.' },
    { id: '2', name: 'Доктор Смирнова Е.В.' },
    { id: '3', name: 'Доктор Козлов М.С.' }
  ];

  const services = [
    'Консультация', 'Лечение кариеса', 'Профессиональная чистка',
    'Отбеливание зубов', 'Удаление зуба', 'Установка брекетов',
    'Протезирование', 'Рентген', 'Пломбирование'
  ];

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData({ ...formData, patientId, patientName: patient?.fullName || '' });
  };

  const handleDoctorChange = (doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    setFormData({ ...formData, doctorId, doctorName: doc?.name || '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {appointment ? 'Редактировать запись' : 'Новая запись'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Пациент *</label>
            <select
              value={formData.patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              required
            >
              <option value="">Выберите пациента</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Врач *</label>
            <select
              value={formData.doctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Дата *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Время *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Услуга *</label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              required
            >
              <option value="">Выберите услугу</option>
              {services.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Статус</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            >
              <option value="scheduled">Запланировано</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
              <option value="no-show">Не пришёл</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Заметки</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm resize-none"
              placeholder="Дополнительная информация..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              style={{ fontWeight: 500 }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
              style={{ fontWeight: 500 }}
            >
              {appointment ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Appointments() {
  const { appointments, patients, addAppointment, updateAppointment, deleteAppointment } = useCrmStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalAppointment, setModalAppointment] = useState<Appointment | null | 'new'>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  // TanStack Query
  const { isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return appointments;
    },
    initialData: appointments
  });

  const filtered = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSave = (data: Omit<Appointment, 'id'>) => {
    if (modalAppointment === 'new') {
      addAppointment(data);
      toast.success('Запись создана');
    } else if (modalAppointment) {
      updateAppointment(modalAppointment.id, data);
      toast.success('Запись обновлена');
    }
    setModalAppointment(null);
  };

  const handleComplete = (id: string) => {
    updateAppointment(id, { status: 'completed' });
    toast.success('Запись отмечена как завершённая');
  };

  const handleCancel = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
    toast.info('Запись отменена');
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту запись?')) {
      deleteAppointment(id);
      toast.success('Запись удалена');
    }
  };

  const statusCounts = {
    all: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  if (isLoading && appointments.length === 0) {
    return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Записи на приём</h1>
          <p className="text-gray-500 text-sm mt-0.5">Управление расписанием приёмов</p>
        </div>
        <button
          onClick={() => setModalAppointment('new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
          style={{ fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" />
          Создать запись
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Все' },
          { key: 'scheduled', label: 'Запланировано' },
          { key: 'completed', label: 'Завершено' },
          { key: 'cancelled', label: 'Отменено' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
              statusFilter === tab.key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            style={{ fontWeight: 500 }}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {statusCounts[tab.key as keyof typeof statusCounts]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по пациенту, услуге, врачу..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Appointments list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">
              {searchQuery ? `Ничего не найдено по запросу «${searchQuery}»` : 'Нет записей'}
            </p>
          </div>
        )}

        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Date/time block */}
              <div className="flex-shrink-0 w-20 text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-blue-600 text-sm" style={{ fontWeight: 700 }}>
                  {format(parseISO(apt.date), 'd', { locale: ru })}
                </p>
                <p className="text-blue-400 text-xs">
                  {format(parseISO(apt.date), 'MMM', { locale: ru })}
                </p>
                <p className="text-blue-700 text-xs mt-1" style={{ fontWeight: 600 }}>{apt.time}</p>
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{apt.patientName}</h3>
                      <StatusBadge status={apt.status} />
                    </div>
                    <p className="text-gray-500 text-sm">{apt.service}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-gray-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{apt.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{apt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(parseISO(apt.date), 'd MMMM yyyy', { locale: ru })}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-gray-400 text-xs mt-2 bg-gray-50 px-3 py-2 rounded-lg">
                    {apt.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {apt.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleComplete(apt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Завершить
                    </button>
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Отменить
                    </button>
                    <button
                      onClick={() => setModalAppointment(apt)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(apt.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalAppointment !== null && (
        <AppointmentModal
          appointment={modalAppointment === 'new' ? null : modalAppointment}
          patients={patients}
          onClose={() => setModalAppointment(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
