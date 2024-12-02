import { formatDate } from '@monorepo/shared';
import { Job } from 'bullmq';
import { JobData, JobResult } from '@monorepo/shared';

export async function processJob(job: Job<JobData>): Promise<JobResult> {
  console.log(`Processing job ${job.id} at ${formatDate(new Date())}`);
  console.log('Task ID:', job.data.taskId);
  console.log('Payload:', job.data.payload);

  // Add your job processing logic here
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work

  return {
    completed: true,
    processedAt: formatDate(new Date())
  };
}