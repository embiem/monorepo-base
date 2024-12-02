export interface JobData {
  taskId: string;
  payload: unknown;
}

export interface JobResult {
  completed: boolean;
  processedAt: string;
}