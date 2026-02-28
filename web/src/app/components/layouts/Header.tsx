import { useState } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router';
import { useCrmStore } from '../../store/crmStore';

interface HeaderProps {
  onMenuClick: () => void;
}

const roleLabels: Record<string, string> = {
  admin: 'Руководитель',
  doctor: 'Врач',
  receptionist: 'Администратор'
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { patients, appointments } = useCrmStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const searchResults = searchQuery.length > 1 ? [
    ...patients
      .filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
      )
      .slice(0, 3)
      .map(p => ({ type: 'patient' as const, label: p.fullName, sub: p.phone })),
    ...appointments
      .filter(a =>
        a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.service.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 2)
      .map(a => ({ type: 'appointment' as const, label: a.patientName, sub: a.service + ' · ' + a.date }))
  ] : [];

  const upcomingCount = appointments.filter(a => a.status === 'scheduled').length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Global Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              placeholder="Поиск пациентов, записей..."
              className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}

            {/* Search Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                {searchResults.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      navigate(item.type === 'patient' ? '/patients' : '/appointments');
                      setShowResults(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      item.type === 'patient' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {item.type === 'patient' ? '👤' : '📅'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{item.label}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {upcomingCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1">
                <span className="text-white" style={{ fontSize: '0.6rem', fontWeight: 700 }}>{upcomingCount}</span>
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm text-gray-900" style={{ fontWeight: 500, lineHeight: 1.2 }}>{user?.fullName}</p>
              <p className="text-xs text-gray-500" style={{ lineHeight: 1.2 }}>{roleLabels[user?.role || 'doctor']}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
