const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appUsageSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  pid: { type: Number, required: true },
  name: { type: String, required: true },
  macAddress: { type: String, required: true }
});

const AppUsage = mongoose.model('AppUsage', appUsageSchema);

module.exports = AppUsage;
