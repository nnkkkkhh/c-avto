import { useState } from 'react';
import { useCrmStore, Patient } from '../store/crmStore';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Phone, Mail, Calendar, Edit, Trash2, Users, X, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const AVATAR_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-rose-500'];

function PatientModal({
  patient,
  onClose,
  onSave
}: {
  patient: Patient | null;
  onClose: () => void;
  onSave: (data: Omit<Patient, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: patient?.fullName || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    birthDate: patient?.birthDate || '',
    notes: patient?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {patient ? 'Редактировать пациента' : 'Новый пациент'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Полное имя *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Телефон *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="+7 (999) 000-00-00"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="ivan@mail.ru"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Дата рождения *
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Заметки / Анамнез
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              placeholder="Аллергии, особые пометки..."
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
              {patient ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Patients() {
  const { patients, addPatient, updatePatient, deletePatient } = useCrmStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit'>('name');
  const [modalPatient, setModalPatient] = useState<Patient | null | 'new'>(null);

  // TanStack Query for loading state simulation
  const { isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return patients;
    },
    initialData: patients
  });

  const filtered = patients
    .filter(p =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'lastVisit') {
        return new Date(b.lastVisit || '').getTime() - new Date(a.lastVisit || '').getTime();
      }
      return 0;
    });

  const handleSave = (data: Omit<Patient, 'id'>) => {
    if (modalPatient === 'new') {
      addPatient(data);
      toast.success('Пациент успешно добавлен');
    } else if (modalPatient) {
      updatePatient(modalPatient.id, data);
      toast.success('Данные пациента обновлены');
    }
    setModalPatient(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Удалить пациента ${name}?`)) {
      deletePatient(id);
      toast.success('Пациент удален');
    }
  };

  if (isLoading && patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Пациенты</h1>
          <p className="text-gray-500 text-sm mt-0.5">Всего в базе: <span style={{ fontWeight: 600 }}>{patients.length}</span></p>
        </div>
        <button
          onClick={() => setModalPatient('new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
          style={{ fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" />
          Добавить пациента
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, телефону, email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'lastVisit')}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm text-gray-700"
              style={{ fontWeight: 500 }}
            >
              <option value="name">По имени</option>
              <option value="lastVisit">По последнему визиту</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-4 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Пациент</th>
                <th className="text-left py-4 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Контакты</th>
                <th className="text-left py-4 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Дата рождения</th>
                <th className="text-left py-4 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Последний визит</th>
                <th className="text-left py-4 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Следующий приём</th>
                <th className="py-4 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((patient, idx) => {
                const initials = patient.fullName.split(' ').slice(0, 2).map(n => n[0]).join('');
                const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white text-xs" style={{ fontWeight: 600 }}>{initials}</span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm" style={{ fontWeight: 500 }}>{patient.fullName}</p>
                          {patient.notes && (
                            <p className="text-gray-400 text-xs truncate max-w-[180px]">{patient.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm">{patient.phone}</span>
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm">{patient.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-600 text-sm">
                      {format(parseISO(patient.birthDate), 'd MMMM yyyy', { locale: ru })}
                    </td>
                    <td className="py-4 px-5">
                      {patient.lastVisit ? (
                        <span className="text-gray-600 text-sm">
                          {format(parseISO(patient.lastVisit), 'd MMM yyyy', { locale: ru })}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {patient.nextAppointment ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs" style={{ fontWeight: 500 }}>
                          <Calendar className="w-3 h-3" />
                          {format(parseISO(patient.nextAppointment), 'd MMM', { locale: ru })}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModalPatient(patient)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id, patient.fullName)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">
                {searchQuery ? `По запросу «${searchQuery}» ничего не найдено` : 'Нет пациентов'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalPatient !== null && (
        <PatientModal
          patient={modalPatient === 'new' ? null : modalPatient}
          onClose={() => setModalPatient(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
