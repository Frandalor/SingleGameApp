import mongoose from 'mongoose';
import Player from './Player';

const matchDaySchema = new mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true,
  },
  dayNumber: { type: Number, required: true },
  type: { type: String, enum: ['regular', 'custom'], default: 'regular' },
  custom: { type: Number, max: 8, min: 2, default: null },
  teams: {
    type: [
      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true }],
    ],
    validate: {
      validator: function (value) {
        if (this.format === 'regular') return value.length <= 4;
        if (this.format === 'custom') return value.length <= this.custom;
        return true;
      },
      message: function () {
        if (this.format === 'regular')
          return 'Le partite regular possono avere massimo 4 squadre';
        if (this.format === 'custom')
          return `Le partite cup possono avere massimo ${this.custom} squadre`;
        return 'Numero di squadre non valido';
      },
    },
  },
  score: {
    type: [Number],
    validate: {
      validator: function (value) {
        return value.length === this.teams.length;
      },
      message:
        'Il numero dei punteggi deve corrispondere al numero delle squadre.',
    },
  },
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
          'absent',
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
