const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/game-of-life', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import the InitialPattern model
const InitialPattern = require('./models/InitialPattern');

// API route to save pattern
app.post('/api/savePattern', async (req, res) => {
  try {
    const { Name, Pattern, CreatedAt } = req.body;

    if (!Name || !Pattern || !CreatedAt) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new pattern instance
    const newPattern = new InitialPattern({ Name, Pattern, CreatedAt });
    await newPattern.save();
    res.status(201).json({ message: 'Pattern created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
