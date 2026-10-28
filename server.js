require('dotenv').config();

const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/hello', (req, res) => {
    res.send('Hello route works!');
});
app.get('/api/test', (req, res) => {
  res.json({ message: 'iMovies server is working!' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    await client.db('imovies').command({ ping: 1 });
    await client.close();

    res.json({ message: 'MongoDB connected successfully!' });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ message: 'MongoDB connection failed. Check the server terminal.' });
  }
});

console.log('DB TEST ROUTE LOADED');

app.listen(PORT, () => {
  console.log(`iMovies server running at http://localhost:${PORT}`);
});