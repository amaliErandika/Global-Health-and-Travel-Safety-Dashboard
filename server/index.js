require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const axios = require('axios');

const authRoutes = require('./routes/auth'); // Import authentication routes

const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const PORT = process.env.PORT || 3001; // Server port

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/global-health")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Use auth routes
app.use('/auth', authRoutes);

// Protected route using JWT
app.get('/dashboard', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "JWT verified", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});


// Fetch COVID data from external API
app.get('/api/covid', async (req, res) => {
  try {
    const response = await axios.get("https://disease.sh/v3/covid-19/countries");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching COVID data:", error.message);
    res.status(500).json({ error: "Failed to fetch COVID data" });
  }
});

// Fetch Travel Advisory data from external API
app.get('/api/advisory', async (req, res) => {
  try {
    const response = await axios.get("https://www.travel-advisory.info/api");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching advisory data:", error.message);
    res.status(500).json({ error: "Failed to fetch travel advisory data" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
