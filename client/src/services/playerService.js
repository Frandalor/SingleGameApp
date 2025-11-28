import { axiosInstance } from '../lib/axios';

export const getAllPlayerService = async () => {
  try {
    const res = await axiosInstance.get('/player');
    return res.data;
  } catch (error) {
    console.error('Errore recupero giocatori:', error);
    throw error;
  }
};
