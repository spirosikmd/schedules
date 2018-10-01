const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const settingsSchema = mongoose.Schema({
  person: { type: String, default: '' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

settingsSchema.plugin(timestamps);

module.exports = mongoose.model('Settings', settingsSchema);
