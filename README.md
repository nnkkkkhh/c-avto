# c-avto (DentalCRM)

Монорепозиторий CRM-системы для стоматологической клиники.

Проект состоит из двух приложений:
- `backend` — REST API на Express + Prisma + PostgreSQL + JWT.
- `web` — клиент на React + Vite + TypeScript + Zustand.

## Возможности

- Регистрация и вход пользователей через backend (`/auth/register`, `/auth/login`, `/auth/me`).
- JWT-аутентификация и защищенные маршруты на клиенте.
- CRM-модули в интерфейсе: пациенты, записи, услуги, аналитика, профиль.
- Backend подключен к PostgreSQL через Prisma.

## Технологический стек

### Backend
- Node.js + TypeScript
- Express 5
- Prisma ORM
- PostgreSQL (через Docker Compose)
- JWT (`jsonwebtoken`), `bcrypt`
- `zod` валидация

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS 4
- Zustand
- TanStack Query
- Axios
- React Router 7

## Структура репозитория

```text
c-avto/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── docker-compose.yml
│   └── .env.example
├── web/
│   ├── src/
│   └── .env.example
└── README.md
```

## Требования

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Быстрый старт

### 1. Установите зависимости

```bash
cd backend && npm install
cd ../web && npm install
```

### 2. Поднимите PostgreSQL

```bash
cd backend
npm run db:up
```

### 3. Настройте переменные окружения backend

Создайте файл `backend/.env` на основе `backend/.env.example`:

```env
PORT=5050
JWT_SECRET=change_me
DATABASE_URL=postgresql://crm_user:crm_pass@localhost:5432/crm?schema=public
CORS_ORIGIN=http://localhost:5173
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change_me_strong
SEED_ORG_NAME=Default Org
```

### 4. Примените миграции и (опционально) сиды

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Запустите backend

```bash
cd backend
npm run dev
```

API будет доступен на `http://localhost:5050`.

### 6. Настройте и запустите frontend

Создайте `web/.env` на основе `web/.env.example`:

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_URL=http://localhost:5050
```

Запуск:

```bash
cd web
npm run dev
```

Frontend будет доступен на `http://localhost:5173`.

## Как фронтенд ходит в API

- Клиент использует `VITE_API_BASE_URL=/api`.
- Vite-прокси перенаправляет `/api/*` на `VITE_BACKEND_URL`.
- Пример: запрос `POST /api/auth/login` из браузера попадает на backend `POST /auth/login`.

## API (текущие маршруты)

### Public
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`

### Protected (Bearer token)
- `GET /auth/me`
- `GET /protected`

## Скрипты

### Backend (`backend/package.json`)
- `npm run dev` — запуск в dev-режиме
- `npm run build` — сборка TypeScript в `dist`
- `npm run start` — запуск собранного приложения
- `npm run db:up` / `npm run db:down` — поднять/остановить Postgres
- `npm run prisma:migrate` — миграции в dev
- `npm run prisma:deploy` — миграции для production
- `npm run prisma:seed` — сиды

### Frontend (`web/package.json`)
- `npm run dev` — запуск Vite
- `npm run build` — production сборка

## Текущее состояние данных в CRM-экранах

Важно: аутентификация уже работает через backend и PostgreSQL, но данные модулей CRM (пациенты/записи/услуги/аналитика) пока живут в Zustand (`web/src/app/store/crmStore.ts`) и являются демо-данными в памяти.

Это значит:
- после перезагрузки страницы изменения в этих данных сбрасываются;
- API для пациентов/записей/услуг пока не реализован на backend.

## Остановка

```bash
cd backend
npm run db:down
```

## Дальнейшее развитие

- Добавить backend-модули `patients`, `appointments`, `services`.
- Перевести frontend с Zustand demo-данных на реальные API-запросы.
- Добавить тесты (на текущий момент `backend` не содержит тестов).
