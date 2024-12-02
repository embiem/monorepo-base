import { Worker, Job } from "bullmq";
import { Utils } from "@monorepo/shared";
import { processJob } from "../processors/job-processor";

export function createProcessWorker(): Worker {
  const connection = Utils.createRedisConnection();
  const worker = new Worker("process-queue", processJob, { connection });

  worker.on("completed", (job: Job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job: Job | undefined, error: Error) => {
    console.error(`Job ${job?.id} failed:`, error);
  });

  return worker;
}

