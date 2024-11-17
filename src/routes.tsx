import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

// Pages
import { HomePage } from '@/pages/home';
import { SharePage } from '@/pages/share';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { LandingPage } from '@/pages/landing';
import { AccountsPage } from '@/pages/app/accounts';
import { BlogPage } from '@/pages/blog';
import { BlogPostPage } from '@/pages/blog/[slug]';
import { SupportPage } from '@/pages/support';

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
        element: <HomePage />,
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
        element: <div>Settings Page</div>,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
    ],
  },
]);
