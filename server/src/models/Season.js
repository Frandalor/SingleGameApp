import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
});

const Season = mongoose.model('Season', seasonSchema);

export default Season;
