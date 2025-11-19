import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

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
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login fallito');
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
