const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const PORT = 3000;

// Configure Redis client
const redisClient = redis.createClient({
  url: 'redis://localhost:6379' // Ensure this URL matches your Redis server
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

// Promisify the Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Middleware to parse JSON requests
app.use(express.json());

// Example route to fetch data with caching
app.get('/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check cache
    const cachedData = await getAsync(id);
    if (cachedData) {
      console.log(`Cache hit for ID: ${id}`);
      return res.json(JSON.parse(cachedData));
    }

    // Fetch data from Realm (placeholder logic)
    const dataFromRealm = await fetchDataFromRealm(id);

    // Store in cache
    await setAsync(id, JSON.stringify(dataFromRealm), 'EX', 3600); // Cache for 1 hour

    console.log(`Cache miss for ID: ${id}. Data fetched from database.`);
    res.json(dataFromRealm);
  } catch (error) {
    console.error('Failed to fetch data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Placeholder function to simulate fetching data from Realm
async function fetchDataFromRealm(id) {
  // Replace with actual Realm database query logic
  return { id, data: `Data for ${id}` };
}

// Start server only when Redis client is ready
redisClient.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to Redis', err);
});
