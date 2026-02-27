import { Users, Calendar, TrendingUp, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCrmStore } from '../store/crmStore';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link } from 'react-router';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const weeklyData = [
  { day: 'Пн', записи: 5, выполнено: 4 },
  { day: 'Вт', записи: 8, выполнено: 7 },
  { day: 'Ср', записи: 6, выполнено: 5 },
  { day: 'Чт', записи: 10, выполнено: 9 },
  { day: 'Пт', записи: 7, выполнено: 6 },
  { day: 'Сб', записи: 4, выполнено: 4 },
  { day: 'Вс', записи: 2, выполнено: 2 }
];

const servicesPieData = [
  { name: 'Лечение', value: 35, color: '#3b82f6' },
  { name: 'Гигиена', value: 25, color: '#10b981' },
  { name: 'Эстетика', value: 20, color: '#f59e0b' },
  { name: 'Ортодонтия', value: 12, color: '#8b5cf6' },
  { name: 'Хирургия', value: 8, color: '#ef4444' }
];

function getDateLabel(dateStr: string) {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Сегодня';
  if (isTomorrow(date)) return 'Завтра';
  return format(date, 'd MMM', { locale: ru });
}

export default function Dashboard() {
  const { patients, appointments } = useCrmStore();
  const { user } = useAuthStore();

  // TanStack Query для загрузки данных (с моком)
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return {
        revenue: 284500,
        revenueGrowth: '+12.5%',
        newPatients: 23
      };
    }
  });

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(apt => apt.date === todayStr);
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  const completedThisMonth = appointments.filter(a => a.status === 'completed').length;
  const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;

  const stats = [
    {
      label: 'Всего пациентов',
      value: patients.length,
      sub: `+${statsData?.newPatients || 23} за месяц`,
      icon: Users,
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      trend: 'up'
    },
    {
      label: 'Записей сегодня',
      value: todayAppointments.length || 3,
      sub: `${todayAppointments.filter(a => a.status === 'completed').length} завершено`,
      icon: Calendar,
      bg: 'bg-emerald-500',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      trend: 'up'
    },
    {
      label: 'Активных записей',
      value: scheduledCount,
      sub: 'На эту неделю',
      icon: Clock,
      bg: 'bg-orange-500',
      light: 'bg-orange-50',
      text: 'text-orange-600',
      trend: 'neutral'
    },
    {
      label: 'Выполнено услуг',
      value: completedThisMonth,
      sub: '+8% за неделю',
      icon: TrendingUp,
      bg: 'bg-purple-500',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      trend: 'up'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">Запланировано</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs"><CheckCircle2 className="w-3 h-3" />Завершено</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs"><AlertCircle className="w-3 h-3" />Отменено</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            Добро пожаловать, {user?.fullName?.split(' ')[1] || user?.fullName}! 👋
          </h1>
          <p className="text-gray-500 mt-1 capitalize">
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: ru })}
          </p>
        </div>
        <Link
          to="/appointments"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
          style={{ fontWeight: 500 }}
        >
          <Calendar className="w-4 h-4" />
          Создать запись
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${stat.light} ${stat.text}`} style={{ fontWeight: 500 }}>
                {stat.trend === 'up' ? '↑' : '→'} {stat.sub.split(' ')[0]}
              </span>
            </div>
            <p className="text-gray-900" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>Активность за неделю</h2>
              <p className="text-gray-400 text-sm mt-0.5">Записи и выполненные визиты</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="записи" stroke="#3b82f6" strokeWidth={2} fill="url(#colorScheduled)" name="Записи" />
              <Area type="monotone" dataKey="выполнено" stroke="#10b981" strokeWidth={2} fill="url(#colorCompleted)" name="Выполнено" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-500 text-xs">Записи</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-500 text-xs">Выполнено</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-gray-900 mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Услуги</h2>
          <p className="text-gray-400 text-sm mb-4">Распределение по типам</p>
          <div className="flex items-center justify-center">
            <PieChart width={150} height={150}>
              <Pie data={servicesPieData} cx={70} cy={70} innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {servicesPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2 mt-2">
            {servicesPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 text-xs">{item.name}</span>
                </div>
                <span className="text-gray-900 text-xs" style={{ fontWeight: 600 }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>Ближайшие записи</h2>
            <Link to="/appointments" className="text-blue-600 text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ fontWeight: 500 }}>
              Все записи <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Нет предстоящих записей</p>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm truncate" style={{ fontWeight: 500 }}>{apt.patientName}</p>
                    <p className="text-gray-400 text-xs truncate">{apt.service}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-900 text-xs" style={{ fontWeight: 600 }}>{getDateLabel(apt.date)}</p>
                    <p className="text-gray-400 text-xs">{apt.time}</p>
                  </div>
                  <div>{getStatusBadge(apt.status)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>Пациенты</h2>
            <Link to="/patients" className="text-blue-600 text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ fontWeight: 500 }}>
              Все пациенты <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {patients.slice(0, 6).map((patient) => {
              const initials = patient.fullName.split(' ').slice(0, 2).map(n => n[0]).join('');
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
              const colorIndex = parseInt(patient.id) % colors.length;
              return (
                <div key={patient.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 ${colors[colorIndex]} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs" style={{ fontWeight: 600 }}>{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm truncate" style={{ fontWeight: 500 }}>{patient.fullName}</p>
                    <p className="text-gray-400 text-xs">{patient.phone}</p>
                  </div>
                  {patient.nextAppointment && (
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                        {format(parseISO(patient.nextAppointment), 'd MMM', { locale: ru })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
