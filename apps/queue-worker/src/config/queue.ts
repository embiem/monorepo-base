import { Queue, QueueOptions } from "bullmq";

import { Utils } from "@monorepo/shared";

const connection = Utils.createRedisConnection();

export function createQueue(
  name: string,
  options?: Partial<QueueOptions>,
): Queue {
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

