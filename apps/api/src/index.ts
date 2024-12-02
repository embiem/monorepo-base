import express from 'express';
import cookieParser from 'cookie-parser';
import { setupCors } from './middleware/cors';
import healthRoutes from './routes/health';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';

const app = express();
const port = process.env.PORT || 4000;

// Setup middleware
setupCors(app);
app.use(cookieParser());
app.use(express.json());

// Setup routes
app.use('/', healthRoutes);
app.use('/api', taskRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});