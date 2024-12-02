import { Queue } from 'bullmq';
import { createRedisConnection } from '@monorepo/shared';

const connection = createRedisConnection();

export function createQueue(name: string) {
  return new Queue(name, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  });
}