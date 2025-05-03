const mongoose = require('mongoose');

const ChartDataSchema = new mongoose.Schema({
  key: String,      // e.g. 'charge-time' or 'cycle-life'
  data: Array       // array of { x: <label|number>, y: <number> }
});

module.exports = mongoose.model('ChartData', ChartDataSchema);
