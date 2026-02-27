# Руководство по развертыванию DentalCRM

## 📦 Сборка проекта

### Production Build

```bash
npm run build
```

Это создаст оптимизированную сборку в папке `dist/`.

## 🚀 Развертывание

### Vercel

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Разверните проект:
```bash
vercel
```

3. Для production развертывания:
```bash
vercel --prod
```

### Netlify

1. Установите Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Разверните проект:
```bash
netlify deploy
```

3. Для production развертывания:
```bash
netlify deploy --prod
```

### Docker

Создайте `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Создайте `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-api-server:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Сборка и запуск:
```bash
docker build -t dentalcrm .
docker run -p 80:80 dentalcrm
```

## 🔧 Настройка окружения

### Переменные окружения

Создайте `.env` файл в корне проекта:

```env
# API Configuration
VITE_API_URL=https://api.yourapp.com
VITE_API_TIMEOUT=10000

# Auth Configuration
VITE_AUTH_TOKEN_KEY=dentalcrm_token
VITE_REFRESH_TOKEN_KEY=dentalcrm_refresh_token

# App Configuration
VITE_APP_NAME=DentalCRM
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

### Использование переменных окружения

```typescript
// src/app/config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  appName: import.meta.env.VITE_APP_NAME || 'DentalCRM',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true'
  }
};
```

## 🔌 Подключение к реальному API

### 1. Обновите конфигурацию Axios

```typescript
// src/app/api/client.ts
import axios from 'axios';
import { config } from '../config/env';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Активируйте TanStack Query хуки

В файлах `src/app/hooks/usePatients.ts` и `src/app/hooks/useAppointments.ts` измените `enabled: false` на `enabled: true`.

### 3. Переключитесь с Zustand на API

Замените использование Zustand store на TanStack Query хуки в компонентах:

```typescript
// Было (Zustand):
import { useCrmStore } from '../store/crmStore';
const { patients, addPatient } = useCrmStore();

// Стало (TanStack Query):
import { usePatients, useCreatePatient } from '../hooks/usePatients';
const { data: patients } = usePatients();
const { mutate: addPatient } = useCreatePatient();
```

## 📊 Мониторинг и аналитика

### Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

### Google Analytics

```bash
npm install react-ga4
```

```typescript
// src/app/utils/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('YOUR_GA_MEASUREMENT_ID');
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
```

## 🔒 Безопасность в Production

### 1. Content Security Policy

Добавьте в `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:;">
```

### 2. HTTPS Only

Убедитесь, что ваше приложение доступно только по HTTPS.

### 3. Secure Headers

Настройте заголовки безопасности на вашем сервере:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 🧪 Тестирование перед развертыванием

### 1. Проверьте сборку локально

```bash
npm run build
npm run preview
```

### 2. Проверьте размер bundle

```bash
npm run build -- --report
```

### 3. Lighthouse Audit

Откройте приложение в Chrome DevTools и запустите Lighthouse для проверки производительности, доступности и SEO.

## 📱 PWA (Progressive Web App)

Для превращения приложения в PWA:

1. Установите `vite-plugin-pwa`:
```bash
npm install -D vite-plugin-pwa
```

2. Обновите `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DentalCRM',
        short_name: 'DentalCRM',
        description: 'CRM система для стоматологических клиник',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 🔄 CI/CD

### GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📝 Чек-лист перед развертыванием

- [ ] Все переменные окружения настроены
- [ ] API endpoints корректны
- [ ] Сборка проходит без ошибок
- [ ] Все тесты проходят (если есть)
- [ ] Lighthouse score > 90
- [ ] Проверена работа на мобильных устройствах
- [ ] Настроены заголовки безопасности
- [ ] Настроен мониторинг ошибок
- [ ] Настроена аналитика
- [ ] Документация обновлена
- [ ] README содержит актуальную информацию

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи сборки
2. Убедитесь, что все зависимости установлены
3. Проверьте переменные окружения
4. Обратитесь к документации используемых инструментов
