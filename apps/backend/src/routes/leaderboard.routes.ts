import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboard.controller.js';

export const leaderboardRouter = Router();

leaderboardRouter.get('/individual', leaderboardController.getIndividual);
leaderboardRouter.get('/squads',     leaderboardController.getSquads);
