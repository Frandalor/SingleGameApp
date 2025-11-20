import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import RankingPage from '../pages/RankingPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import NotFound from '../pages/NotFound.jsx';
import HomePage from '../pages/HomePage.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';

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
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
