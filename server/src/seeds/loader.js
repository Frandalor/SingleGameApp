// seed.js
import mongoose from 'mongoose';
import Player from '../models/Player.js';
import allPlayers from './players.js';

const newPlayers = allPlayers.map((p) => ({
  player: p.player,
  category: p.category,
}));

const seedPlayers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/single-game-app');
    console.log('MongoDB connected');

    await Player.deleteMany({});
    console.log('Old data removed');

    await Player.insertMany(newPlayers);
    console.log('All players inserted');
    console.log('player length', newPlayers.length);

    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error(error);
    mongoose.disconnect();
  }
};

seedPlayers();
