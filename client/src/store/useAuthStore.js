import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isResettingPassword: false,
  isResendingVerification: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check-auth');
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success(
        'Registrazione avvenuta con successo! Controlla la tua email per verificare il tuo account.',
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Errore durante la registrazione.');
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data, isLoggedIn: true });
      toast.success('Bentornato!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login fallito');
    } finally {
      set({ isLoggingIn: false });
    }
  },
  // --- VERIFY EMAIL ---
  verifyEmail: async (token) => {
    try {
      // Backend aspetta POST con body: { token: "..." }
      await axiosInstance.post('/auth/verify-email', { token });
      toast.success('Email verificata! Ora puoi accedere.');
      return true; // Ritorna true per dire al componente di reindirizzare
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verifica fallita');
      return false;
    }
  },

  // --- FORGOT PASSWORD ---
  forgotPassword: async (email) => {
    set({ isResettingPassword: true });
    try {
      // Backend aspetta POST su /password-reset-req
      await axiosInstance.post('/auth/password-reset-req', { email });
      toast.success('Link di reset inviato alla tua email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Errore invio richiesta');
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // --- RESET PASSWORD ---
  resetPassword: async (token, newPassword) => {
    set({ isResettingPassword: true });
    try {
      // Backend aspetta POST su /password-reset/:token
      // E nel body aspetta { newPassword: "..." } <-- IMPORTANTE
      await axiosInstance.post(`/auth/password-reset/${token}`, { newPassword });
      toast.success('Password aggiornata con successo');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Errore reset password');
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },

  //----RESEND VERIFICATION EMAIL----
  resendVerificationEmail: async (email) => {
    try {
      await axiosInstance.post('/auth/resend-verification', { email });
      toast.success('Email di verifica inviata nuovamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Errore invio email di verifica');
    }
  },
}));
