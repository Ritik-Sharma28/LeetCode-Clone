import { createClient } from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-12758.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 12758
    }
});
