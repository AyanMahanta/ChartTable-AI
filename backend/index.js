// backend/index.js
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { Pool } = require('pg');
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
});

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password]
    );
    res.json({ userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Podcasts Endpoint
app.get('/api/podcasts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM podcasts');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Podcast by RSS URL Endpoint
app.post('/api/podcasts', async (req, res) => {
  const { rssUrl } = req.body;
  const podcast = await fetchPodcastData(rssUrl);
  if (podcast) {
    res.json(podcast);
  } else {
    res.status(400).json({ error: 'Invalid RSS URL' });
  }
});


app.post("/api/insights", async (req, res) => {
  const { episodeTitle, episodeDescription, podcastId } = req.body;

  try {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST;

    if (!apiKey) {
      return res.status(400).json({ error: "API Key is missing!" });
    }

    const response = await axios.post(
      `https://${apiHost}/generate/by-text`,
      {
        text_prompt: `${episodeTitle} - ${episodeDescription}`,
        structure_transformation: 0.5,
        seed: 0,
        callback_url: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
      }
    );

    const insight = response.data;

    res.json({ insight });
  } catch (error) {
    console.error("API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
  res.send('Backend is running...');
});
