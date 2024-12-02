import IORedis from 'ioredis';

export function createRedisConnection(): IORedis {
  const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  connection.on('error', (error) => {
    console.error('Redis connection error:', error);
  });
  
  connection.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  return connection;
}