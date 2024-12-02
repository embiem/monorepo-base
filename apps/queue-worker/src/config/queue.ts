import { Queue, QueueOptions } from 'bullmq';
import { createRedisConnection } from './redis';

const connection = createRedisConnection();

export function createQueue(name: string, options?: Partial<QueueOptions>): Queue {
  return new Queue(name, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
    ...options,
  });
}