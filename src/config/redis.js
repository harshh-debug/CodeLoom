
import { createClient } from 'redis';

export const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST || 'redis-16647.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: parseInt(process.env.REDIS_PORT) || 16647
    }
});

// Error handling for Redis connection
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

