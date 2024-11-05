// models/InitialPattern.js
const mongoose = require('mongoose');

const InitialPatternSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true
  },
  Pattern: {
    type: [[Boolean]],
    required: true
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
  
  User: {
	  type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
  }
  
});

const InitialPattern = mongoose.model('InitialPattern', InitialPatternSchema);

module.exports = InitialPattern;