import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCrmStore } from '../store/crmStore';
import { Camera, Mail, User as UserIcon, Briefcase, Save, Phone, Clock, Shield, X, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels: Record<string, string> = {
  admin: 'Руководитель',
  doctor: 'Врач-стоматолог',
  receptionist: 'Администратор'
};

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  doctor: 'bg-blue-100 text-blue-700',
  receptionist: 'bg-green-100 text-green-700'
};

export default function Profile() {
  const { user, updateProfile, logout } = useAuthStore();
  const { appointments } = useCrmStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '+7 (999) 000-11-22',
    specialization: user?.specialization || 'Терапевт-стоматолог',
    workSchedule: user?.workSchedule || 'Пн-Пт, 09:00 – 18:00'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    toast.success('Профиль обновлён');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      specialization: user?.specialization || '',
      workSchedule: user?.workSchedule || ''
    });
  };

  const myAppointments = appointments.filter(a => a.doctorId === user?.id || a.doctorId === '1');
  const completedCount = myAppointments.filter(a => a.status === 'completed').length;
  const scheduledCount = myAppointments.filter(a => a.status === 'scheduled').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Профиль</h1>
        <p className="text-gray-500 text-sm mt-0.5">Управление учётной записью</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%)' }}
          ></div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-white" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
                  style={{ fontWeight: 500 }}
                >
                  <Edit2 className="w-4 h-4" />
                  Редактировать
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  style={{ fontWeight: 500 }}
                >
                  <X className="w-4 h-4" />
                  Отмена
                </button>
              )}
            </div>
          </div>

          {/* Name & Role */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-gray-900" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.fullName}</h2>
              <span className={`px-3 py-1 rounded-full text-xs ${roleColors[user?.role || 'doctor']}`} style={{ fontWeight: 600 }}>
                {roleLabels[user?.role || 'doctor']}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{formData.specialization}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4" />
                  Полное имя
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-50 disabled:text-gray-700 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-50 disabled:text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-50 disabled:text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  Специализация
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-50 disabled:text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  График работы
                </label>
                <input
                  type="text"
                  value={formData.workSchedule}
                  onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-50 disabled:text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  ID пользователя
                </label>
                <input
                  type="text"
                  value={user?.id || ''}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
                  style={{ fontWeight: 500 }}
                >
                  <Save className="w-4 h-4" />
                  Сохранить изменения
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-900" style={{ fontSize: '2rem', fontWeight: 700 }}>{myAppointments.length}</p>
          <p className="text-gray-500 text-sm mt-1">Всего приёмов</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Save className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-gray-900" style={{ fontSize: '2rem', fontWeight: 700 }}>{completedCount}</p>
          <p className="text-gray-500 text-sm mt-1">Завершено</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-gray-900" style={{ fontSize: '2rem', fontWeight: 700 }}>{scheduledCount}</p>
          <p className="text-gray-500 text-sm mt-1">Запланировано</p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Выход из системы</h3>
        <p className="text-gray-500 text-sm mb-4">После выхода вам потребуется повторно войти в систему</p>
        <button
          onClick={logout}
          className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm"
          style={{ fontWeight: 500 }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
