import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RankingPage from '../pages/RankingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import NotFound from '../pages/NotFound';
import HomePage from '../pages/HomePage';
import AuthLayout from '../layouts/AuthLayout.jsx';
import VerifyEmailPage from '../pages/VerifyEmailPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'classifiche', element: <RankingPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
