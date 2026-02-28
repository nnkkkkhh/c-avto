import { useCrmStore } from '../store/crmStore';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const monthlyData = [
  { month: 'Сен', записи: 42, выручка: 168000, новыеПациенты: 8 },
  { month: 'Окт', записи: 55, выручка: 220000, новыеПациенты: 12 },
  { month: 'Ноя', записи: 48, выручка: 192000, новыеПациенты: 9 },
  { month: 'Дек', записи: 38, выручка: 152000, новыеПациенты: 6 },
  { month: 'Янв', записи: 51, выручка: 204000, новыеПациенты: 11 },
  { month: 'Фев', записи: 63, выручка: 252000, новыеПациенты: 15 }
];

const doctorLoad = [
  { name: 'Иванов А.П.', записи: 38, завершено: 32 },
  { name: 'Смирнова Е.В.', записи: 29, завершено: 25 },
  { name: 'Козлов М.С.', записи: 22, завершено: 18 }
];

const weekdayData = [
  { day: 'Пн', загрузка: 85 },
  { day: 'Вт', загрузка: 92 },
  { day: 'Ср', загрузка: 78 },
  { day: 'Чт', загрузка: 96 },
  { day: 'Пт', загрузка: 88 },
  { day: 'Сб', загрузка: 60 },
  { day: 'Вс', загрузка: 30 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
        <p className="text-gray-700 text-sm mb-2" style={{ fontWeight: 600 }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span style={{ fontWeight: 600 }}>{
              typeof entry.value === 'number' && entry.name === 'выручка'
                ? `${entry.value.toLocaleString('ru')} ₽`
                : entry.name === 'загрузка'
                  ? `${entry.value}%`
                  : entry.value
            }</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { patients, appointments, services } = useCrmStore();

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      return { totalRevenue: 1188000, growthRate: 18.5 };
    }
  });

  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');

  const completionRate = Math.round((completedAppointments.length / Math.max(appointments.length, 1)) * 100);

  // Service popularity from appointments
  const serviceCounts = appointments.reduce((acc, apt) => {
    acc[apt.service] = (acc[apt.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const servicePopularity = Object.entries(serviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const statusDistribution = [
    { name: 'Завершено', value: completedAppointments.length, color: '#10b981' },
    { name: 'Запланировано', value: scheduledAppointments.length, color: '#3b82f6' },
    { name: 'Отменено', value: cancelledAppointments.length, color: '#ef4444' },
    { name: 'Не пришёл', value: appointments.filter(a => a.status === 'no-show').length, color: '#94a3b8' }
  ].filter(d => d.value > 0);

  const summaryStats = [
    {
      label: 'Общая выручка',
      value: `${(analyticsData?.totalRevenue || 1188000).toLocaleString('ru')} ₽`,
      change: '+18.5%',
      up: true,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Всего пациентов',
      value: patients.length.toString(),
      change: '+23 за месяц',
      up: true,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Всего записей',
      value: appointments.length.toString(),
      change: `${completionRate}% выполнено`,
      up: completionRate >= 70,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Выручка за день',
      value: '42 300 ₽',
      change: '+12% к прошлой нед.',
      up: true,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-gray-900" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Аналитика</h1>
        <p className="text-gray-500 text-sm mt-0.5">Статистика и показатели клиники</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs ${stat.up ? 'text-emerald-600' : 'text-red-500'}`} style={{ fontWeight: 500 }}>
                {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.change}
              </div>
            </div>
            <p className="text-gray-900" style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly revenue */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-5">
            <h2 className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>Выручка по месяцам</h2>
            <p className="text-gray-400 text-sm mt-0.5">Последние 6 месяцев</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="выручка" stroke="#3b82f6" strokeWidth={2.5}
                fill="url(#revenueGrad)" name="выручка" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-gray-900 mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Статусы записей</h2>
          <p className="text-gray-400 text-sm mb-4">Распределение</p>
          <div className="flex justify-center">
            <PieChart width={160} height={160}>
              <Pie
                data={statusDistribution}
                cx={75}
                cy={75}
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                strokeWidth={0}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2.5 mt-2">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 text-xs">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 text-xs" style={{ fontWeight: 600 }}>{item.value}</span>
                  <span className="text-gray-400 text-xs">
                    ({Math.round(item.value / appointments.length * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor workload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-gray-900 mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Нагрузка врачей</h2>
          <p className="text-gray-400 text-sm mb-5">Записи и завершённые приёмы</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={doctorLoad} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="записи" fill="#bfdbfe" radius={[4, 4, 0, 0]} name="записи" />
              <Bar dataKey="завершено" fill="#3b82f6" radius={[4, 4, 0, 0]} name="завершено" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-200"></div>
              <span className="text-xs text-gray-500">Записи</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-xs text-gray-500">Завершено</span>
            </div>
          </div>
        </div>

        {/* Weekly load */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-gray-900 mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Загрузка по дням недели</h2>
          <p className="text-gray-400 text-sm mb-5">Средняя загруженность (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekdayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="загрузка" radius={[4, 4, 0, 0]} name="загрузка">
                {weekdayData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.загрузка >= 90 ? '#ef4444' : entry.загрузка >= 75 ? '#f59e0b' : '#10b981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-xs text-gray-500">Норма (&lt;75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span className="text-xs text-gray-500">Высокая (75-90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-xs text-gray-500">Пик (&gt;90%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service popularity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-gray-900 mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Популярность услуг</h2>
        <p className="text-gray-400 text-sm mb-6">По количеству записей</p>

        {servicePopularity.length > 0 ? (
          <div className="space-y-4">
            {servicePopularity.map((item, index) => {
              const max = servicePopularity[0].value;
              const pct = Math.round((item.value / max) * 100);
              return (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ backgroundColor: COLORS[index] + '20', color: COLORS[index], fontWeight: 700 }}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-700 text-sm" style={{ fontWeight: 500 }}>{item.name}</span>
                      <span className="text-gray-500 text-xs">{item.value} записей</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: COLORS[index] }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет данных</p>
          </div>
        )}
      </div>

      {/* Monthly appointments bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-gray-900 mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Динамика записей и новых пациентов</h2>
        <p className="text-gray-400 text-sm mb-5">По месяцам</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="записи" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} name="записи" />
            <Line type="monotone" dataKey="новыеПациенты" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="новыеПациенты" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-500">Записи</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-500">Новые пациенты</span>
          </div>
        </div>
      </div>
    </div>
  );
}
