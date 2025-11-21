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
    const response = await axiosInstance.get('/matchdays/leaderboard', {
      params: validatedData.data,
    });
    return response.data;
  } catch (error) {
    console.error('Errore API', error);
    throw error;
  }
};
