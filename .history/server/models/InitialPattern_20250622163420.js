// models/InitialPattern.js

const mongoose = require('mongoose');

// Define the schema for a saved pattern
const InitialPatternSchema = new mongoose.Schema({
  // Name of the pattern (must be unique)
  Name: {
    type: String,
    required: true,
    unique: true,
  },

  // The pattern itself as a 2D array of booleans
  Pattern: {
    type: [[Boolean]],
    required: true,
  },

  // Timestamp when the pattern was created (defaults to now)
  CreatedAt: {
    type: Date,
    default: Date.now,
  },

  // Reference to the user who created the pattern
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Create the model from the schema
const InitialPattern = mongoose.model('InitialPattern', InitialPatternSchema);

module.exports = InitialPattern;
