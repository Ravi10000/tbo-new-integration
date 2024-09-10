import Airport from '../../models/airport.model';
import redisClient from '../../utils/redisClient'; // Import your Redis client

export const getAirportDetails = async (code: string) => {
  try {
    // Check Redis cache first
    const cachedAirport = await redisClient.get(code);
    if (cachedAirport) {
      return JSON.parse(cachedAirport);
    }

    // Fetch from database if not in cache
    const airport = await Airport.findOne({ code });
    if (!airport) {
      // Cache the empty result in Redis with expiration
      await redisClient.set(code, JSON.stringify(''), {
        EX: 3600 // Cache for 1 hour
      });
      return '';
    }

    // Cache the result in Redis with expiration
    await redisClient.set(code, JSON.stringify(airport), {
      EX: 3600 // Cache for 1 hour
    });

    return airport;
  } catch (error) {
    console.error('Error fetching airport details:', error);
    throw error;
  }
};
