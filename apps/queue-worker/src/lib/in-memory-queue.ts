import { EventEmitter } from 'events';
import { formatDate } from '@monorepo/shared';

interface Job<T = any> {
  id: string;
  data: T;
  timestamp: Date;
}

export class InMemoryQueue extends EventEmitter {
  private jobs: Job[] = [];
  private processing = false;
  private name: string;

  constructor(name: string) {
    super();
    this.name = name;
    console.log(`Created in-memory queue: ${name}`);
  }

  async add(name: string, data: any): Promise<Job> {
    const job: Job = {
      id: Math.random().toString(36).substring(7),
      data,
      timestamp: new Date()
    };
    
    this.jobs.push(job);
    console.log(`[${this.name}] Added job ${job.id} at ${formatDate(job.timestamp)}`);
    
    if (!this.processing) {
      this.processNext();
    }
    
    return job;
  }

  private async processNext(): Promise<void> {
    if (this.jobs.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const job = this.jobs.shift();

    if (job) {
      try {
        console.log(`[${this.name}] Processing job ${job.id}`);
        this.emit('active', job);
        
        // Simulate async processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.emit('completed', job);
        console.log(`[${this.name}] Completed job ${job.id}`);
      } catch (error) {
        this.emit('failed', job, error);
        console.error(`[${this.name}] Failed job ${job.id}:`, error);
      }
    }

    // Process next job
    this.processNext();
  }

  async close(): Promise<void> {
    this.jobs = [];
    this.processing = false;
    this.removeAllListeners();
    console.log(`[${this.name}] Queue closed`);
  }
}