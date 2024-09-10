import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://127.0.0.1:6379' // Adjust as necessary
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().catch(console.error); // Connect the client

export default redisClient;