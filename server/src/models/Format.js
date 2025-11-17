import mongoose from 'mongoose';

const FormatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, default: 'regular' },
    maxTeams: { type: Number, required: true, default: 4 },
    maxPlayersPerTeam: { type: Number, required: true, default: 8 },
  },
  { timestamps: true }
);

const Format = mongoose.model('Format', FormatSchema);

export default Format;
