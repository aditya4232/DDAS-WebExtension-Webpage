const express = require('express');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your Google OAuth Client ID
const client = new OAuth2Client("853633666368-vqqq1itvst9tcm73fqv5ee28b8j6cgjs.apps.googleusercontent.com");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/FileManagementSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a schema and model for storing user data
const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  downloads: Array
});

const User = mongoose.model('User', userSchema);

// Middleware to parse incoming JSON
app.use(express.json());

// Google OAuth Login Route
app.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "853633666368-vqqq1itvst9tcm73fqv5ee28b8j6cgjs.apps.googleusercontent.com"
    });

    const { sub, email } = ticket.getPayload();

    // Check if user exists, if not create a new user
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({ googleId: sub, email: email, downloads: [] });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});

// Add Download to User's Download History
app.post('/addDownload', async (req, res) => {
  const { googleId, download } = req.body;

  try {
    const user = await User.findOne({ googleId });

    if (user) {
      user.downloads.push(download);
      await user.save();
      res.status(200).send("Download added.");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
