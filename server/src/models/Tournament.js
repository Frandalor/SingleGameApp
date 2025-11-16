import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  format: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Format',
    required: true,
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    default: null,
  },
  current: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;
