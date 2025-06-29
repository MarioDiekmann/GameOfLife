const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const InitialPattern = require('./models/InitialPattern');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: "https://gameoflife-frontend.onrender.com/",  // <- hier deine tatsächliche Frontend-URL
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/game-of-life', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Helper to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, joindate } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, password: hashedPassword, joindate });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login and token creation
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid Username or Password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save a pattern
app.post('/api/savePattern', async (req, res) => {
  try {
    const { Name, Pattern, CreatedAt, User } = req.body;

    if (!Name || !Pattern || !CreatedAt || !User) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPattern = new InitialPattern({ Name, Pattern, CreatedAt, User });
    await newPattern.save();

    res.status(201).json({ message: 'Pattern created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all patterns for a user
app.get('/api/displayPatterns/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const patterns = await InitialPattern.find({ User: userId });

    if (patterns) {
      res.status(200).json(patterns);
    } else {
      res.status(404).json({ error: 'Pattern not found' });
    }
  } catch (error) {
    console.error('Error finding patterns:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific pattern by name and user
app.get('/api/displayPattern/:name/:userId', async (req, res) => {
  try {
    const { name, userId } = req.params;
    const pattern = await InitialPattern.findOne({ Name: name, User: userId });

    if (pattern) {
      res.status(200).json(pattern);
    } else {
      res.status(404).json({ error: 'Pattern not found' });
    }
  } catch (error) {
    console.error('Error finding pattern:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
