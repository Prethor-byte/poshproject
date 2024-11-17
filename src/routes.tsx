import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

// Pages
import { SharePage } from '@/pages/app/share';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { LandingPage } from '@/pages/landing';
import { AccountsPage } from '@/pages/app/accounts';
import { BlogPage } from '@/pages/blog';
import { BlogPostPage } from '@/pages/blog/[slug]';
import { SupportPage } from '@/pages/support';
import { DashboardPage } from '@/pages/app/dashboard';
import { SettingsPage } from '@/pages/app/settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/support',
    element: <SupportPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/blog/:slug',
    element: <BlogPostPage />,
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
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'share',
        element: <SharePage />,
      },
      {
        path: 'profile',
        element: <div>Profile Page</div>,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
    ],
  },
]);
