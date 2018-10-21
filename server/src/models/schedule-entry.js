const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const scheduleEntrySchema = mongoose.Schema(
  {
    date: Date,
    location: String,
    hours: Number,
    startTime: Date,
    endTime: Date,
    workWith: [String],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule' },
  },
  {
    collection: 'schedule-entries',
  }
);

scheduleEntrySchema.plugin(timestamps);

module.exports = mongoose.model('ScheduleEntry', scheduleEntrySchema);
