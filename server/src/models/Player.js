import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  player: { type: String, required: true },
  clearWins: { type: Number, default: 0 },
  narrowWins: { type: Number, default: 0 },
  goldenGoalWins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  narrowLosses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  category: { type: Number, required: true, min: 1, max: 4 },
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
