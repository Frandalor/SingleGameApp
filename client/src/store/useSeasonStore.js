import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useSeasonStore = create((set, get) => ({
  seasons: [],
  activeSeason: null,

  isLoading: false,
  isCreating: false,
  isClosing: false,

  // ----------------------------------------------------------
  // -----------------------🟢 PUBLIC -----------------------
  // ----------------------------------------------------------
  getAllSeason: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/season');
      set({ seasons: res.data });
      console.log('risposta api stagioni', res.data);

      const current = res.data.find((s) => s.current === true);
      if (current) {
        set({ activeSeason: current });
      }
    } catch (error) {
      set({ seasons: [] });
      console.error('error fetching seasons', error);
      toast.error('Errore caricamento stagioni');
    } finally {
      set({ isLoading: false });
    }
  },

  // ----------------------------------------------------------
  // -------------🔴 ADMIN ACTIONS -----------------
  // ----------------------------------------------------------

  // Crea nuova stagione
  createSeason: async (seasonData) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post('/season/new', seasonData);

      toast.success('Nuova stagione creata!');

      const newSeason = res.data;
      set((state) => ({
        seasons: [newSeason, ...state.seasons],
        activeSeason: newSeason,
      }));

      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Errore creazione stagione';
      toast.error(msg);
      return false;
    } finally {
      set({ isCreating: false });
    }
  },

  closeSeason: async () => {
    set({ isClosing: true });
    try {
      const res = await axiosInstance.patch('/season/close');
      toast.success(res.data.message);

      //aggiorno localmente per non rifare fetch

      set((state) => ({
        activeSeason: null,
        seasons: state.seasons.map((s) =>
          s.current ? { ...s, current: false, endDate: new Date() } : s,
        ),
      }));
      return true;
    } catch (error) {
      const msg = error.response?.data.message || 'Errore chiusura stagione';
      toast.error(msg);
      return false;
    } finally {
      set({ isClosing: false });
    }
  },
}));
