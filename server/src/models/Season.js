import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    current: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Season = mongoose.model('Season', seasonSchema);

export default Season;
