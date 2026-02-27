import { createBrowserRouter, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { RootLayout } from './components/layouts/RootLayout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Lazy loading страниц
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Services = lazy(() => import('./pages/Services'));
const Analytics = lazy(() => import('./pages/Analytics'));

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <LazyWrapper>
        <Login />
      </LazyWrapper>
    )
  },
  {
    path: '/register',
    element: (
      <LazyWrapper>
        <Register />
      </LazyWrapper>
    )
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Dashboard />
          </LazyWrapper>
        )
      },
      {
        path: 'patients',
        element: (
          <LazyWrapper>
            <Patients />
          </LazyWrapper>
        )
      },
      {
        path: 'appointments',
        element: (
          <LazyWrapper>
            <Appointments />
          </LazyWrapper>
        )
      },
      {
        path: 'services',
        element: (
          <LazyWrapper>
            <Services />
          </LazyWrapper>
        )
      },
      {
        path: 'analytics',
        element: (
          <LazyWrapper>
            <Analytics />
          </LazyWrapper>
        )
      },
      {
        path: 'profile',
        element: (
          <LazyWrapper>
            <Profile />
          </LazyWrapper>
        )
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
