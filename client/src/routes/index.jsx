import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RankingPage from '../pages/RankingPage';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'classifiche', element: <RankingPage /> },
   
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
