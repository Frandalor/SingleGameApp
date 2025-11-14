import mongoose from 'mongoose';
import Player from './Player';

const matchDaySchema = new mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true,
  },
  dayNumber: { type: Number, required: true },
  type: { type: String, enum: ['regular', 'cup'], default: 'regular' },

  matches: [
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  ],
  score: [Number],
  playerResult: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
      },
      result: {
        type: String,
        enum: [
          'clearWin',
          'narrowWin',
          'goldenGoalWin',
          'loss',
          'narrowLoss',
          'draw',
        ],
        required: true,
      },
      points: { type: Number, required: true },
      usedJolly: { type: Boolean, default: false },
    },
  ],
});

const MatchDay = mongoose.model('MatchDay', matchDaySchema);

export default MatchDay;
