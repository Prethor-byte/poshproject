import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

// Pages
import { HomePage } from '@/pages/home';
import { SharePage } from '@/pages/share';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'share',
        element: (
          <ProtectedRoute>
            <SharePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);
