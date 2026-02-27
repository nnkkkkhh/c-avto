# 📝 Шпаргалка разработчика DentalCRM

## Быстрые команды

```bash
# Установка
npm install

# Разработка
npm run dev

# Сборка
npm run build

# Предпросмотр
npm run preview
```

## Структура папок

```
src/app/
├── api/              # API клиенты и конфигурация
├── components/
│   ├── features/     # Функциональные компоненты (StatCard, AppointmentCard)
│   ├── layouts/      # Макеты (Header, Sidebar, RootLayout)
│   └── ui/           # UI компоненты (Button, Card, Modal)
├── hooks/            # Кастомные React хуки
├── pages/            # Страницы (lazy loaded)
├── store/            # Zustand stores
├── types/            # TypeScript типы
├── utils/            # Утилиты и константы
├── routes.tsx        # Роутинг
└── App.tsx           # Главный компонент
```

## Создание новой страницы

```typescript
// 1. Создайте файл src/app/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>;
}

// 2. Добавьте в src/app/routes.tsx
const NewPage = lazy(() => import('./pages/NewPage'));

{
  path: 'new-page',
  element: (
    <LazyWrapper>
      <NewPage />
    </LazyWrapper>
  )
}

// 3. Добавьте в Sidebar (src/app/components/layouts/Sidebar.tsx)
{ to: '/new-page', icon: YourIcon, label: 'New Page' }
```

## Работа с Zustand Store

```typescript
// Использование auth store
import { useAuthStore } from '../store/authStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  return <div>{user?.fullName}</div>;
}

// Использование CRM store
import { useCrmStore } from '../store/crmStore';

function MyComponent() {
  const { patients, addPatient, updatePatient } = useCrmStore();
  
  const handleAdd = () => {
    addPatient({
      fullName: 'John Doe',
      phone: '+7 999 123-45-67',
      birthDate: '1990-01-01'
    });
  };
  
  return <button onClick={handleAdd}>Add</button>;
}
```

## TanStack Query хуки (для API)

```typescript
// Получение данных
import { usePatients } from '../hooks/usePatients';

function MyComponent() {
  const { data, isLoading, error } = usePatients();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return <div>{data?.length} patients</div>;
}

// Мутации
import { useCreatePatient } from '../hooks/usePatients';

function MyComponent() {
  const { mutate, isPending } = useCreatePatient();
  
  const handleSubmit = (patient) => {
    mutate(patient, {
      onSuccess: () => {
        toast.success('Patient created!');
      }
    });
  };
}
```

## UI компоненты

### Button
```typescript
import { Button } from '../components/ui/Button';

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
// variant: 'primary' | 'secondary' | 'danger' | 'ghost'
// size: 'sm' | 'md' | 'lg'
```

### Card
```typescript
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Badge
```typescript
import { Badge } from '../components/ui/Badge';

<Badge variant="blue">Status</Badge>
// variant: 'blue' | 'green' | 'red' | 'yellow' | 'gray'
```

### Modal
```typescript
import { Modal } from '../components/ui/Modal';

<Modal isOpen={isOpen} onClose={handleClose} title="My Modal" size="md">
  <div className="p-6">Content</div>
</Modal>
// size: 'sm' | 'md' | 'lg' | 'xl'
```

## Работа с датами

```typescript
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Форматирование даты
const formatted = format(new Date(), 'd MMMM yyyy', { locale: ru });
// "27 февраля 2026"

// Использование утилит
import { formatDate, calculateAge, isToday } from '../utils/helpers';

formatDate('2026-02-27', 'd MMM yyyy'); // "27 фев 2026"
calculateAge('1990-01-01'); // 36
isToday('2026-02-27'); // true
```

## Уведомления (Toasts)

```typescript
import { toast } from 'sonner';

toast.success('Успешно!');
toast.error('Ошибка!');
toast.info('Информация');
toast.warning('Предупреждение');

// С настройками
toast.success('Пациент добавлен', {
  description: 'Иван Иванов успешно добавлен в базу',
  duration: 3000,
});
```

## React Router навигация

```typescript
import { useNavigate, Link } from 'react-router';

// Программная навигация
function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/patients');
    // или
    navigate(-1); // назад
  };
}

// Декларативная навигация
<Link to="/patients" className="...">
  Пациенты
</Link>
```

## TypeScript типы

```typescript
import type { User, Patient, Appointment } from '../types';

// Или из store
import type { User } from '../store/authStore';
import type { Patient, Appointment } from '../store/crmStore';

// Использование
const patient: Patient = {
  id: '1',
  fullName: 'John Doe',
  phone: '+7 999 123-45-67',
  birthDate: '1990-01-01'
};
```

## Константы

```typescript
import { APP_NAME, ROUTES, SERVICES, TIME_SLOTS } from '../utils/constants';

// Использование
navigate(ROUTES.DASHBOARD);

const services = SERVICES; // ['Консультация', 'Лечение кариеса', ...]
const timeSlots = TIME_SLOTS; // ['09:00', '09:30', ...]
```

## Утилиты

```typescript
import {
  formatPhone,
  getInitials,
  isValidEmail,
  isValidPhone,
  generateId,
  debounce
} from '../utils/helpers';

formatPhone('+79991234567'); // "+7 (999) 123-45-67"
getInitials('Иван Иванов'); // "ИИ"
isValidEmail('test@example.com'); // true
generateId(); // "abc123xyz"

// Дебаунс
const debouncedSearch = debounce((query) => {
  console.log('Search:', query);
}, 300);
```

## Иконки (Lucide React)

```typescript
import { Users, Calendar, Phone, Mail, Search } from 'lucide-react';

<Users className="w-5 h-5 text-blue-600" />
<Calendar className="w-4 h-4" />
```

[Полный список иконок](https://lucide.dev/icons/)

## Tailwind CSS классы (часто используемые)

```css
/* Контейнеры */
.container, .max-w-7xl, .mx-auto, .px-4

/* Flexbox */
.flex, .items-center, .justify-between, .gap-4

/* Grid */
.grid, .grid-cols-1, .md:grid-cols-2, .lg:grid-cols-4

/* Отступы */
.p-6, .px-4, .py-3, .m-4, .mt-2, .mb-6

/* Размеры */
.w-full, .h-screen, .min-h-screen

/* Цвета */
.bg-blue-600, .text-white, .border-gray-200

/* Скругления */
.rounded-lg, .rounded-xl, .rounded-full

/* Тени */
.shadow-sm, .shadow-md, .shadow-xl

/* Переходы */
.transition-colors, .hover:bg-gray-50
```

## Защищенные маршруты

```typescript
import { ProtectedRoute } from '../components/features/ProtectedRoute';

// С проверкой роли
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>

// Только проверка авторизации
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

## Поиск и фильтрация

```typescript
// Пример из Patients.tsx
const [searchQuery, setSearchQuery] = useState('');

const filteredPatients = patients.filter(patient =>
  patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  patient.phone.includes(searchQuery) ||
  patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
);

// Компонент поиска
import { SearchInput } from '../components/features/SearchInput';

<SearchInput
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Поиск..."
/>
```

## Отладка

```typescript
// React DevTools
console.log('Debug:', variable);

// Zustand DevTools (установите расширение)
import { devtools } from 'zustand/middleware';

create(
  devtools((set) => ({
    // ... ваш store
  }))
);
```

## Оптимизация производительности

```typescript
import { memo, useMemo, useCallback } from 'react';

// Мемоизация компонента
const MemoizedComponent = memo(MyComponent);

// Мемоизация значений
const filteredData = useMemo(
  () => data.filter(item => item.active),
  [data]
);

// Мемоизация функций
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

## Переменные окружения

```typescript
// Доступ к переменным окружения
const apiUrl = import.meta.env.VITE_API_URL;

// Проверка режима
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

## Полезные ссылки

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)
