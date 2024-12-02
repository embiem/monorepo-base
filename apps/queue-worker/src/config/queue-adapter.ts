import { Queue, QueueOptions } from "bullmq";
import { Utils } from "@monorepo/shared";
import { InMemoryQueue } from "../lib/in-memory-queue";

const isLocalDev = process.env.NODE_ENV !== "production";

export function createQueue(
  name: string,
  options?: Partial<QueueOptions>,
): Queue | InMemoryQueue {
  if (isLocalDev) {
    return new InMemoryQueue(name);
  }

  const connection = Utils.createRedisConnection();
  return new Queue(name, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
    ...options,
  });
}

