import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.route.jsx';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <Loader className="size-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
