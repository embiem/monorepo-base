import express from 'express';
import cors from 'cors';
import { Express } from 'express';

export function setupCors(app: Express): void {
  app.use(cors());
  app.use(express.json());
}