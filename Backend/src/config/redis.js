
import { createClient } from 'redis';

export const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST ,
        port: parseInt(process.env.REDIS_PORT) 
    }
});

// Error handling for Redis connection
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

