import { create } from 'zustand';
import toast from 'react-hot-toast';
import { getAllPlayerService } from '../services/playerService';

export const usePlayerStore = create((set, get) => ({
  players: [],
  isLoading: false,

  fetchAllPlayers: async () => {
    set({ isLoading: true });

    try {
      const data = await getAllPlayerService();
      set({ players: data });
    } catch (error) {
      toast.error('Impossibile caricare la lista giocatori');
    } finally {
      set({ isLoading: false });
    }
  },

  //================END=========================
}));
