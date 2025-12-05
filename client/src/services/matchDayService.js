import { leaderboardFormSchema, teamsArrayFormSchema } from '@SingleGameApp/shared';
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
    const params = {};

    if (seasonId) {
      params.season = seasonId;
    }

    params.fields = '_id,dayNumber,status,createdAt';

    const response = await axiosInstance.get('/match-day', { params });
    return response.data;
  } catch (error) {
    console.error('errore API lista giornate', error);
    throw error;
  }
};

//-----------AGGIUNGE SQUADRE

export const addTeamsService = async (matchDayId, teamsArray) => {
  const rawData = {
    teams: teamsArray,
  };

  console.log('DATI DA FRONTEND', rawData);
  const validatedData = teamsArrayFormSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error('Errore Validazione Frontend', validatedData.error.format);

    throw new Error('Dati delle squadre non validi. Controlla i campi');
  }

  try {
    const res = await axiosInstance.put(`/match-day/${matchDayId}/teams`, validatedData.data);
    return res.data;
  } catch (error) {
    console.error('Errore API addTeams', error);
    throw error;
  }
};

// ----------FIND MATCH BY ID

export const getMatchDayByIdService = async (matchDayId) => {
  try {
    const res = await axiosInstance.get(`/match-day/${matchDayId}`);
    return res.data;
  } catch (error) {
    console.error('Errore recupero giornata singola', error);
    throw error;
  }
};

//=========DELETE TEAM FROM MATCHDAY

export const deleteTeamService = async (matchDayId, teamId) => {
  try {
    const res = await axiosInstance.delete(`/match-day/${matchDayId}/teams/${teamId}`);
    return res.data;
  } catch (error) {
    console.error('Errore deleting team', error);
    throw error;
  }
};
