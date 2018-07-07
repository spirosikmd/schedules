const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingsSchema = mongoose.Schema({
  hourlyWage: { type: Number, default: 0 },
  person: { type: String, default: '' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Settings', settingsSchema);
