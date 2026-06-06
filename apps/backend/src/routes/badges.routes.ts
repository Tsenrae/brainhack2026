import { Router } from 'express';
import { badgesController } from '../controllers/badges.controller.js';

export const badgesRouter = Router();

// All badges with earned/locked status for the authenticated user
badgesRouter.get('/', badgesController.getAll);
