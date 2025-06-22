// models/User.js

const mongoose = require('mongoose');

// Define schema for users
const UserSchema = new mongoose.Schema({
  // Unique username for login
  username: {
    type: String,
    required: true,
    unique: true,
  },

  // Hashed password for authentication
  password: {
    type: String,
    required: true,
  },

  // Date when the user registered (default is now)
  joindate: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
