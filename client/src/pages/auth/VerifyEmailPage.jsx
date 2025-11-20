import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();

  const token = searchParams.get('token');
  const verifyCalled = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast.error('Token mancante');
        return navigate('/login');
      }

      if (verifyCalled.current) return;
      verifyCalled.current = true;

      // Chiamiamo lo store
      const success = await verifyEmail(token);

      if (success) {
        toast.success('Email verificata con successo');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    };

    verify();
  }, [token, navigate, verifyEmail]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-myPrimary text-white">
      <h2 className="animate-pulse text-2xl font-bold">Verifica Email in corso...</h2>
    </div>
  );
};

export default VerifyEmailPage;
