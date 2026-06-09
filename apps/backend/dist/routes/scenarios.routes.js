import { Router } from 'express';
import { scenariosController } from '../controllers/scenarios.controller.js';
export const scenariosRouter = Router();
scenariosRouter.get('/progress', scenariosController.getProgress);
scenariosRouter.post('/:scenarioId/complete', scenariosController.complete);
