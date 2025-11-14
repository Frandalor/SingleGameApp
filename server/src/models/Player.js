import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  player: { type: String, required: true },
  category: { type: Number, required: true, min: 1, max: 4 },
  balance: { type: Number, default: 0 },
  jolly: { type: Number, default: 0 },
  diffidato: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
