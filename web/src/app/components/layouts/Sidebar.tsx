import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Stethoscope,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Главная', end: true },
  { to: '/patients', icon: Users, label: 'Пациенты', end: false },
  { to: '/appointments', icon: Calendar, label: 'Записи', end: false },
  { to: '/services', icon: Stethoscope, label: 'Услуги', end: false },
  { to: '/analytics', icon: BarChart3, label: 'Аналитика', end: false },
  { to: '/profile', icon: Settings, label: 'Профиль', end: false }
];

const roleLabels: Record<string, string> = {
  admin: 'Руководитель',
  doctor: 'Врач',
  receptionist: 'Администратор'
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { logout, user } = useAuthStore();

  return (
    <aside
      className={`bg-slate-900 text-white transition-all duration-300 flex-shrink-0 flex flex-col relative ${
        isOpen ? 'w-64' : 'w-[72px]'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700 ${!isOpen ? 'justify-center px-0' : ''}`}>
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🦷</span>
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <p className="text-white leading-tight" style={{ fontWeight: 700, fontSize: '1rem' }}>DentalCRM</p>
            <p className="text-slate-400" style={{ fontSize: '0.7rem' }}>Управление клиникой</p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-10"
      >
        {isOpen ? (
          <ChevronLeft className="w-3 h-3 text-white" />
        ) : (
          <ChevronRight className="w-3 h-3 text-white" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${!isOpen ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {isOpen && user && (
        <div className="px-4 py-3 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                {user.fullName.charAt(0)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate" style={{ fontWeight: 500 }}>{user.fullName}</p>
              <p className="text-slate-400" style={{ fontSize: '0.7rem' }}>{roleLabels[user.role]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className={`px-3 py-4 border-t border-slate-700 ${!isOpen ? 'flex justify-center' : ''}`}>
        <button
          onClick={logout}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors w-full ${
            !isOpen ? 'justify-center w-auto' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Выход</span>}
        </button>
      </div>
    </aside>
  );
}
