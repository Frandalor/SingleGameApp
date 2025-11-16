import mongoose from 'mongoose';

const matchDaySchema = new mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true,
  },
  dayNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'ready', 'completed'],
    default: 'pending',
  },
  format: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Format',
    required: true,
  },
  custom: { type: Number, max: 8, min: 2, default: null },
  maxTeams: { type: Number },
  teams: {
    type: [
      {
        name: { type: String, required: true },
        players: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: true,
          },
        ],
        score: { type: Number, default: undefined },
        goldenGoal: { type: Boolean, default: false },
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
          default: undefined,
        },
      },
    ],
    validate: {
      validator: function (value) {
        if (!value) return true;
        if (this.format === 'regular') return value.length <= 4;
        if (this.format === 'custom') return value.length <= (this.custom || 8);
        return true;
      },
      message: function () {
        if (this.format === 'regular')
          return 'Le partite regular possono avere massimo 4 squadre';
        if (this.format === 'custom')
          return `Le partite custom possono avere massimo ${this.custom} squadre`;
        return 'Numero di squadre non valido';
      },
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
