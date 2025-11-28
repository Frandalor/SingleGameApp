import { create } from 'zustand';
import toast from 'react-hot-toast';
import {
  getMatchDayListService,
  addTeamsService,
  getMatchDayByIdService,
  deleteTeamService,
} from '../services/matchDayService';
import { axiosInstance } from '../lib/axios';

export const useMatchDayStore = create((set) => ({
  matchDays: [],
  selectedMatchDay: null,
  isLoading: false,
  isCreating: false,
  isAddingTeams: false,
  isDeletingTeam: false,

  // ------------------ALL MATCH DAYS-------------------------

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

  //-----------------SELECTED MATCHDAY---------------

  fetchMatchDayById: async (matchDayId) => {
    set({ isLoading: true });
    try {
      const data = await getMatchDayByIdService(matchDayId);
      set({ selectedMatchDay: data });
    } catch (error) {
      toast.error('Impossibile caricare la giornata');
    } finally {
      set({ isLoading: false });
    }
  },

  // --------------NEW MATCHDAY--------------------------

  newMatchDay: async (formatId) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post('/match-day/new', { formatId });
      const newMatch = res.data;

      if (newMatch) {
        set((state) => ({
          matchDays: [newMatch, ...state.matchDays],
        }));
        toast.success('Giornata creata con successo');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Errore creazione giornata';
      toast.error(msg);
    } finally {
      set({ isCreating: false });
    }
  },

  //-----------------INSERT TEAMS INTO MATCHDAY--------------------

  addTeams: async (matchDayId, teamsPayload) => {
    set({ isAddingTeams: true });

    try {
      const updatedMatchDay = await addTeamsService(matchDayId, teamsPayload);

      if (updatedMatchDay) {
        set((state) => ({
          matchDays: state.matchDays.map((day) =>
            day._id === updatedMatchDay._id ? updatedMatchDay : day,
          ),
          selectedMatchDay: updatedMatchDay,
        }));
        toast.success('Squadra salvata con successo!');
        return true;
      }
    } catch (error) {
      console.error('Errore addTeams:', error);
      const msg = error.response?.data?.message || error.message || 'Errore salvataggio squadre';
      toast.error(msg);
      return false;
    } finally {
      set({ isAddingTeams: false });
    }
  },

  clearSelectedMatchDay: () => set({ selectedMatchDay: null }),

  //=========DELETE TEAM FROM MATCHDAY

  deleteTeam: async (matchDayId, teamId) => {
    set({ isDeletingTeam: true });
    try {
      const updatedMatchDay = await deleteTeamService(matchDayId, teamId);
      if (updatedMatchDay) {
        set((state) => ({
          matchDays: state.matchDays.map((d) =>
            d._id === updatedMatchDay._id ? updatedMatchDay : d,
          ),
          selectedMatchDay: updatedMatchDay,
        }));
        toast.success('Squadra eliminata');
        return true;
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione");
      return false;
    } finally {
      set({ isDeletingTeam: false });
    }
  },

  //----------------END-------------------
}));
