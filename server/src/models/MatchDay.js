import mongoose from 'mongoose';

const matchDaySchema = new mongoose.Schema(
  {
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
      required: true,
    },
    dayNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'pairing-pending', 'ready', 'confirmed', 'completed'],
      default: 'pending',
    },
    format: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Format',
      required: true,
    },
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
        },
      ],
      valiidate: {
        valifdator: function (v) {
          return v.length <= 4;
        },
      },
    },
    pairings: [
      {
        teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'teams' },
        teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'teams' },
        scoreA: Number,
        scoreB: Number,
        resultA: {
          type: String,
          enum: [
            'clearWin',
            'narrowWin',
            'goldenGoalWin',
            'loss',
            'narrowLoss',
            'draw',
          ],
        },
        resultB: {
          type: String,
          enum: [
            'clearWin',
            'narrowWin',
            'goldenGoalWin',
            'loss',
            'narrowLoss',
            'draw',
          ],
        },
        goldenGoal: { type: Boolean, default: false },
      },
    ],
    jollyPlayedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
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
            'pending',
          ],
          required: true,
        },
        points: { type: Number, required: true },
        usedJolly: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const MatchDay = mongoose.model('MatchDay', matchDaySchema);

export default MatchDay;
