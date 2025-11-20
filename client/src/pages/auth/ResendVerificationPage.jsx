import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailFormSchema } from '@SingleGameApp/shared';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

function ResendVerificationPage() {
  const { resendVerificationEmail, isResendingVerification } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resendVerificationSchema) });

  const onSubmit = async (data) => {
    const success = await resendVerificationEmail(data.email);
    if (success) {
      toast.success('Email di verifica inviata con successo');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-myPrimary px-4">
      <div className="w-full max-w-md rounded-xl border border-accent1 bg-mySecondary p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Reinvia Email di Verifica
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="block w-full rounded-md border border-accent1 bg-myPrimary p-2.5 text-white outline-none focus:ring-2 focus:ring-accent2"
              placeholder="mario@example.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isResendingVerification}
            className="w-full rounded-md bg-accent2 px-4 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isResendingVerification ? 'Invio in corso...' : 'Invia Email'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResendVerificationPage;
