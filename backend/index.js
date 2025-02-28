// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
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

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/insights', async (req, res) => {
  const { episodeTitle, episodeDescription, podcastId } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: `Summarize this podcast: ${episodeTitle} - ${episodeDescription}` }],
    });

    const insight = response.choices[0].message.content;

    const { data, error } = await supabase
      .from('insights')
      .insert([{ podcast_id: podcastId, episode_title: episodeTitle, insight }]);

    if (error) {
      throw error;
    }

    res.json({ insight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI Insights Failed' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.send('Backend is running...');
  });
  