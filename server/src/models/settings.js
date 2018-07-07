const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingsSchema = mongoose.Schema({
  hourlyWage: { type: Number, required: true, default: 0 },
  person: { type: String, required: true, default: '' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Settings', settingsSchema);
