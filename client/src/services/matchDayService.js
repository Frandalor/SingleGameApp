import { leaderboardFormSchema } from '@SingleGameApp/shared';
import { axiosInstance } from '../lib/axios';

export const getLeaderboardService = async (seasonId, matchDayId) => {
  const rawParams = {
    season: seasonId || undefined,
    matchDayId: matchDayId || undefined,
  };

  const validatedData = leaderboardFormSchema.safeParse(rawParams);

  if (!validatedData.success) {
    console.error('Errore Validazione Frontend', validatedData.error.format());
  }

  try {
    const response = await axiosInstance.get('/match-day/leaderboard', {
      params: validatedData.data,
    });
    return response.data;
  } catch (error) {
    console.error('Errore API', error);
    throw error;
  }
};

export const getMatchDayListService = async (seasonId) => {
  try {
    const params = seasonId ? { season: seasonId } : {};

    const response = await axiosInstance.get('/match-day?light=true', { params });
    return response.data;
  } catch (error) {
    console.error('errore API lista giornate', error);
    throw error;
  }
};
