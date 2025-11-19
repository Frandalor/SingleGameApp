import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axios'; // o authService
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // useRef serve per evitare che React chiami l'API due volte in strict mode
  const verifyCalled = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error('Token mancante');
        return navigate('/login');
      }

      if (verifyCalled.current) return;
      verifyCalled.current = true;

      try {
        // Chiamiamo il backend per verificare davvero
        await axiosInstance.post('/auth/verify-email', { token });

        toast.success('Email verificata con successo! Effettua il login.');
        navigate('/login');
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Verifica fallita o token scaduto');
        navigate('/login');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-myPrimary text-white">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Verifica in corso...</h2>
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-accent2"></div>
        <p className="mt-4 text-gray-400">Stiamo confermando la tua email, attendi un attimo.</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
