import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function SignupPage() {
  const { signup, isSigningUp, authUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signup(data);
  };

  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  return (
    // SFONDO PRINCIPALE (myPrimary)
    <div className="flex min-h-screen items-center justify-center bg-myPrimary px-4 py-12 sm:px-6 lg:px-8">
      {/* CARD DEL FORM (mySecondary) */}
      <div className="w-full max-w-md space-y-8 rounded-xl border border-accent1 bg-mySecondary p-8 shadow-2xl">
        {/* TITOLO */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Crea il tuo account</h2>
          <p className="mt-2 text-sm text-gray-400">Entra subito nel Single Game</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* NOME E COGNOME */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Nome</label>
              <input
                type="text"
                className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-accent2"
                placeholder="Mario"
                {...register('firstName', { required: 'Nome obbligatorio' })}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Cognome</label>
              <input
                type="text"
                className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-accent2"
                placeholder="Rossi"
                {...register('lastName', { required: 'Cognome obbligatorio' })}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* USERNAME */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-accent2"
              placeholder="supermario99"
              {...register('userName', {
                required: 'Username obbligatorio',
                minLength: { value: 6, message: 'Minimo 6 caratteri' },
              })}
            />
            {errors.userName && (
              <p className="mt-1 text-xs text-red-400">{errors.userName.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-accent2"
              placeholder="mario@example.com"
              {...register('email', {
                required: 'Email obbligatoria',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email non valida',
                },
              })}
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
              {...register('password', {
                required: 'Password richiesta',
                minLength: { value: 8, message: 'Minimo 8 caratteri' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* BOTTONE (accent2) */}
          <div>
            <button
              type="submit"
              disabled={isSigningUp}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-accent2 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent2 focus:ring-offset-2 focus:ring-offset-mySecondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningUp ? 'Creazione in corso...' : 'REGISTRATI'}
            </button>
          </div>
        </form>

        {/* FOOTER LINK */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Hai già un account?{' '}
            <Link
              to="/login"
              className="font-medium text-accent2 underline decoration-accent2/50 transition-colors hover:text-white"
            >
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
