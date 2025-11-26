import { create } from 'zustand';
import toast from 'react-hot-toast';
import { getMatchDayListService } from '../services/matchDayService';

export const useMatchDayStore = create((set) => ({
  matchDays: [],
  isLoading: false,

  fetchMatchDays: async (seasonId) => {
    set({ isLoading: true });
    try {
      const data = await getMatchDayListService(seasonId);

      const sortedData = data.sort((a, b) => b.dayNumber - a.dayNumber);
      set({ matchDays: sortedData });
    } catch (error) {
      toast.error('Impossibile caricare le giornate');
    } finally {
      set({ isLoading: false });
    }
  },

  //----------------END-------------------
}));
