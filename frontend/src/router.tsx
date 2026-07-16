import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PageLoader } from './components/ui/PageLoader';

// Lazy-load pages so heavy deps (Recharts, Framer Motion) split out of the initial bundle.
const Home = lazy(() => import('./pages/Home'));
const Recommend = lazy(() => import('./pages/Recommend'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Resources = lazy(() => import('./pages/Resources'));
const Projects = lazy(() => import('./pages/Projects'));
const Compare = lazy(() => import('./pages/Compare'));
const Chatbot = lazy(() => import('./pages/Chatbot'));
const NotFound = lazy(() => import('./pages/NotFound'));

const page = (node: ReactNode) => <Suspense fallback={<PageLoader />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: page(<Home />) },
      { path: 'recommend', element: page(<Recommend />) },
      { path: 'roadmap', element: page(<Roadmap />) },
      { path: 'roadmap/:id', element: page(<Roadmap />) },
      { path: 'dashboard', element: page(<Dashboard />) },
      { path: 'resources', element: page(<Resources />) },
      { path: 'projects', element: page(<Projects />) },
      { path: 'compare', element: page(<Compare />) },
      { path: 'chatbot', element: page(<Chatbot />) },
      { path: '*', element: page(<NotFound />) },
    ],
  },
]);
