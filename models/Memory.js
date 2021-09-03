const mongoose = require('mongoose');

// create the Schema
const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Memory = mongoose.model('Memorie', memorySchema);

module.exports = Memory;