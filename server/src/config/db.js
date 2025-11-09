import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/single-game-app');
    console.log('✅ Connessione MongoDB riuscita');
  } catch (err) {
    console.error('❌ Errore connessione MongoDB:', err);
    throw err;
  }
};
