import express from "express";
import cors from "cors";
import { Express } from "express";

export function setupCors(app: Express): void {
  const allowedOrigins = (
    process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001"
  ).split(",");

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
  );

  app.use(express.json());
}

