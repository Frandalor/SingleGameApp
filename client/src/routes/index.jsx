import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RankingPageA from '../pages/RankingPageA';
import RankingPageB from '../pages/RankingPageB';
import RankingPageC from '../pages/RankingPageC';
import RankingPageD from '../pages/RankingPageD';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'serie-a', element: <RankingPageA /> },
      { path: 'serie-b', element: <RankingPageB /> },
      { path: 'serie-c', element: <RankingPageC /> },
      { path: 'serie-d', element: <RankingPageD /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
