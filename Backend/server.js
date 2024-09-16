const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Mongoose Schema for download logs
const downloadSchema = new mongoose.Schema({
  filename: String,
  url: String,
  userEmail: String,
  downloadTime: { type: Date, default: Date.now }
});

// Mongoose Model for downloads
const Download = mongoose.model('Download', downloadSchema);

// Middleware to authenticate JWT tokens
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    req.user = decoded;
    next();
  });
};

// API Route to log a download and detect duplicates
app.post('/api/detect-duplicate', authenticate, async (req, res) => {
  const { filename, url } = req.body;
  const userEmail = req.user.email;

  // Check if a duplicate download exists
  const duplicateDownload = await Download.findOne({ filename, userEmail });
  if (duplicateDownload) {
    return res.status(409).json({ message: 'Duplicate download detected!' });
  }

  // Log the download
  const newDownload = new Download({ filename, url, userEmail });
  await newDownload.save();
  res.status(200).json({ message: 'Download logged successfully.' });
});

// API Route to fetch all download logs
app.get('/api/downloads', authenticate, async (req, res) => {
  const downloads = await Download.find({ userEmail: req.user.email });
  res.status(200).json({ downloads });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
