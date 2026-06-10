import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users.routes.js';
import { missionsRouter } from './routes/missions.routes.js';
import { badgesRouter } from './routes/badges.routes.js';
import { scannerRouter } from './routes/scanner.routes.js';
import { leaderboardRouter } from './routes/leaderboard.routes.js';
import { squadsRouter } from './routes/squads.routes.js';
import { reportsRouter } from './routes/reports.routes.js';
import { scenariosRouter } from './routes/scenarios.routes.js';
import { telegramRouter } from './routes/telegram.routes.js';
import { heatmapRouter } from './routes/heatmap.routes.js';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'brainhack-backend', mock: process.env.MOCK_MODE === 'true' });
});

app.use('/api/users', usersRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/badges', badgesRouter);
app.use('/api/scanner', scannerRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/squads', squadsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/integrations/telegram', telegramRouter);
app.use('/api/heatmap', heatmapRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
