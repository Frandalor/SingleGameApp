import mongoose from 'mongoose';

const playerPointAdjustmentSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    matchDay: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchDay' },
  },
  { timestamps: true }
);

const PlayerPointAdjustment = mongoose.model(
  'PlayerPointAdjustment',
  playerPointAdjustmentSchema
);

export default PlayerPointAdjustment;
