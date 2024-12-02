import { Utils, QueueTypes } from "@monorepo/shared";
import { Job } from "bullmq";

export async function processJob(
  job: Job<QueueTypes.JobData>,
): Promise<QueueTypes.JobResult> {
  console.log(`Processing job ${job.id} at ${Utils.formatDate(new Date())}`);
  console.log("Task ID:", job.data.taskId);
  console.log("Payload:", job.data.payload);

  // Add your job processing logic here
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate work

  return {
    completed: true,
    processedAt: Utils.formatDate(new Date()),
  };
}

