import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordFormSchema } from '@SingleGameApp/shared';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Prende il token dall'URL
  const { resetPassword, isResettingPassword } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordFormSchema) });

  const onSubmit = async (data) => {
    // Il form ha il campo "password", ma lo store si aspetta "newPassword"
    const success = await resetPassword(token, data.newPassword);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-myPrimary px-4">
      <div className="w-full max-w-md rounded-xl border border-accent1 bg-mySecondary p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Nuova Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Nuova Password</label>
            <input
              type="password"
              className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none focus:ring-2 focus:ring-accent2"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.newPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isResettingPassword}
            className="w-full rounded-md bg-accent2 px-4 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isResettingPassword ? 'Aggiornamento...' : 'Salva Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
