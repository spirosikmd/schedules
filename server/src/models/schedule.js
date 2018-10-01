const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  eventsCreatedOnce: {
    type: Boolean,
    required: true,
    default: false,
  },
  data: [],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  settings: {
    hourlyWage: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
