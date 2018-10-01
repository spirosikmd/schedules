const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

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

scheduleSchema.plugin(timestamps);

module.exports = mongoose.model('Schedule', scheduleSchema);
