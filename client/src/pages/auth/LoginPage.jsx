import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '@SingleGameApp/shared';

const LoginPage = () => {
  const { login, isLoggingIn, authUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.unverified) {
      navigate('/resend-verification', { state: { email: data.email } });
      return;
    }
    if (result.success) {
      navigate('/');
      return;
    }
  };

  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-myPrimary px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-accent1 bg-mySecondary p-8 shadow-2xl">
        {/* TITOLO */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Bentornato</h2>
          <p className="mt-2 text-sm text-gray-400">Inserisci le tue credenziali per accedere</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-accent2"
              placeholder="mario@example.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-accent2"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}

            {/* --- password dimenticata --- */}
            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-accent2 transition-colors hover:text-white"
              >
                Password dimenticata?
              </Link>
            </div>
            {/* --------------------------------------- */}
          </div>

          {/* BOTTONE LOGIN */}
          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-accent2 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent2 focus:ring-offset-2 focus:ring-offset-mySecondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingIn ? 'Accesso in corso...' : 'ACCEDI'}
            </button>
          </div>
        </form>

        {/* FOOTER LINK */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Non hai ancora un account?{' '}
            <Link
              to="/signup"
              className="font-medium text-accent2 underline decoration-accent2/50 transition-colors hover:text-white"
            >
              Registrati qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
