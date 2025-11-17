import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    player: { type: String, required: true },
    category: { type: Number, required: true, min: 1, max: 4 },
    balance: { type: Number, default: 0 },
    jolly: { type: Number, default: 0 },
    state: {
      type: String,
      enum: ['active', 'inactive', 'diffidato'],
      default: 'active',
    },
    turnOver: { type: Number, default: 0 },
    contacts: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

const Player = mongoose.model('Player', playerSchema);

export default Player;
