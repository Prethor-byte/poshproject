import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Landing } from '@/pages/landing';
import { Login } from '@/pages/auth/login';
import { SignUp } from '@/pages/auth/signup';
import { AuthCallback } from '@/pages/auth/callback';
import { Dashboard } from '@/pages/dashboard';
import { ShareManager } from '@/pages/share';
import { FollowManager } from '@/pages/follow';
import { Settings } from '@/pages/settings';
import { ProtectedRoute } from '@/components/auth/protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'share',
        element: <ShareManager />,
      },
      {
        path: 'follow',
        element: <FollowManager />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);