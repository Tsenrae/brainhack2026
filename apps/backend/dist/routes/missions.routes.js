import { Router } from 'express';
import { missionsController } from '../controllers/missions.controller.js';
export const missionsRouter = Router();
// Mission overview + per-module progress for the authenticated user
missionsRouter.get('/digital-shield', missionsController.getMissionStatus);
// Current quiz session state + active question
missionsRouter.get('/digital-shield/spot-the-spin/session', missionsController.getQuizSession);
// Submit an answer and receive feedback + XP result
missionsRouter.post('/digital-shield/spot-the-spin/answer', missionsController.submitAnswer);
