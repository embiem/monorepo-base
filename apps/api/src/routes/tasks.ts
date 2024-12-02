import { Router } from "express";
import { QueueTypes, ApiTypes } from "@monorepo/shared";
import { createQueue } from "../config/queue";

const router = Router();
const taskQueue = createQueue("process-queue");

router.post("/tasks", async (req, res) => {
  try {
    const jobData: QueueTypes.JobData = {
      taskId: Date.now().toString(),
      payload: req.body,
    };

    const job = await taskQueue.add("process-task", jobData);

    const response: ApiTypes.ApiResponse<{ jobId: string }> = {
      data: { jobId: job.id ?? "" },
      status: 200,
      message: "Task queued successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiTypes.ApiResponse<null> = {
      data: null,
      status: 500,
      message: "Failed to queue task",
    };
    res.status(500).json(response);
  }
});

router.get("/tasks/:jobId", async (req, res) => {
  try {
    const job = await taskQueue.getJob(req.params.jobId);

    if (!job) {
      const response: ApiTypes.ApiResponse<null> = {
        data: null,
        status: 404,
        message: "Job not found",
      };
      return res.status(404).json(response);
    }

    const state = await job.getState();
    const response: ApiTypes.ApiResponse<{ jobId: string; state: string }> = {
      data: {
        jobId: job.id ?? "",
        state,
      },
      status: 200,
      message: "Job status retrieved",
    };

    res.json(response);
  } catch (error) {
    const response: ApiTypes.ApiResponse<null> = {
      data: null,
      status: 500,
      message: "Failed to get job status",
    };
    res.status(500).json(response);
  }
});

export default router;

