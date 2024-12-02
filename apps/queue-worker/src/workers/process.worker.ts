import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '@monorepo/shared';
import { processJob } from '../processors/job-processor';

export function createProcessWorker(): Worker {
  const connection = createRedisConnection();
  const worker = new Worker('process-queue', processJob, { connection });

  worker.on('completed', (job: Job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job: Job, error: Error) => {
    console.error(`Job ${job.id} failed:`, error);
  });

  return worker;
}