import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

const allowedOrigin = process.env.CLIENT_URL || '*';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'To-Do API is running' });
});

app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
