import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader } from 'lucide-react';

function AdminRoute() {
  const { authUser, isChechingAuth } = useAuthStore();

  if (isChechingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="size-10 animate-spin text-emerald-500" />
      </div>
    );
  }
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  if (authUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex-1 py-6 sm:px-4 lg:px-[25%]">
      <Outlet />
    </div>
  );
}

export default AdminRoute;
