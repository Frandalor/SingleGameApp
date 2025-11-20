import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailFormSchema } from '@SingleGameApp/shared';

const ForgotPasswordPage = () => {
  // 1. Prendi la funzione e lo stato dallo store
  const { forgotPassword, isResettingPassword } = useAuthStore();

  // 2. Inizializza il form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(emailFormSchema) });

  // 3. Invio
  const onSubmit = (data) => {
    // data.email viene passato alla funzione dello store
    forgotPassword(data.email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-myPrimary px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-accent1 bg-mySecondary p-8 shadow-2xl">
        {/* ICONA E TITOLO */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent1">
            <Mail className="h-6 w-6 text-accent2" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white">Password dimenticata?</h2>
          <p className="mt-2 text-sm text-gray-400">
            Nessun problema. Inserisci la tua email e ti invieremo un link per reimpostarla.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* INPUT EMAIL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Indirizzo Email</label>
            <input
              type="email"
              className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-accent2"
              placeholder="mario@example.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* BOTTONE INVIO */}
          <button
            type="submit"
            disabled={isResettingPassword}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-accent2 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent2 focus:ring-offset-2 focus:ring-offset-mySecondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResettingPassword ? 'Invio in corso...' : 'Invia Link di Reset'}
          </button>
        </form>

        {/* LINK TORNA AL LOGIN */}
        <div className="flex justify-center">
          <Link
            to="/login"
            className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
