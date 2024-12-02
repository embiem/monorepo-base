import { createProcessWorker } from './workers/process.worker';

function startWorker() {
  const worker = createProcessWorker();
  
  process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    process.exit(0);
  });
  
  console.log('Queue worker is running');
}

startWorker();