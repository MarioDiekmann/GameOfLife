const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); 
const User = require('./models/User'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');


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

const hashPassword = async (password)=>{
	const saltRounds = 10; 
	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(password, salt);
	return hash;
	}

// API route to save pattern
app.post('/api/savePattern', async (req, res) => {
  try {
    const { Name, Pattern, CreatedAt, User} = req.body;

    if (!Name || !Pattern || !CreatedAt || !User) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new pattern instance
    const newPattern = new InitialPattern({ Name, Pattern, CreatedAt, User});
    await newPattern.save();
    res.status(201).json({ message: 'Pattern created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/displayPatterns/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Accessing user ID from the URL
    const patterns = await InitialPattern.find({ User: userId });

    if (patterns) {
      res.status(200).json(patterns);  // Send the found pattern as JSON with status 200
    } else {
      res.status(404).json({ error: 'Pattern not found' });  // Return 404 if pattern not found
    }
  } catch (error) {
    console.error('Error finding patterns:', error);
    res.status(500).json({ error: 'Server error' });  // Return server error in case of failure
  }
});


app.get('/api/displayPattern/:name/:userId', async (req, res) => {
  try {
    const name = req.params.name
	const userId = req.params.userId; // Accessing user ID from the URL
    const pattern = await InitialPattern.findOne({ Name: name, User: userId });

    if (pattern) {
      res.status(200).json(pattern);  // Send the found pattern as JSON with status 200
    } else {
      res.status(404).json({ error: 'Pattern not found' });  // Return 404 if pattern not found
    }
  } catch (error) {
    console.error('Error finding patterns:', error);
    res.status(500).json({ error: 'Server error' });  // Return server error in case of failure
  }
});



app.post('/api/register', async (req, res) => { // Add the leading slash in the route path
  try {
    const plainPassword = req.body.password ;
	const hashedPassword = await hashPassword(plainPassword);
	const { username, joindate } = req.body; // Use req.body instead of req.params

    // Check if the user already exists
    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      // Create a new user
      const newUser = new User({ username, password:hashedPassword, joindate });
      await newUser.save();

      return res.status(201).json({ message: 'User created successfully' });
    } else {
      return res.status(409).json({ error: 'User already exists' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { username, password: plainPassword } = req.body;

    if (!username || !plainPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid Username or Password' });
    }

    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Username or Password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      'bullshit-key',
      { expiresIn: '3m' }
    );

    res.status(200).json({ message: 'Login successful', token: token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});






// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
