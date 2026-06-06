import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users.routes.js';
import { missionsRouter } from './routes/missions.routes.js';
import { badgesRouter } from './routes/badges.routes.js';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'brainhack-backend', mock: process.env.MOCK_MODE === 'true' });
});

app.use('/api/users', usersRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/badges', badgesRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
