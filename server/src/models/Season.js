import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: true },
});

const Season = mongoose.model('Season', seasonSchema);

export default Season;
