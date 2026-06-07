import { Router } from 'express';
import { squadsController } from '../controllers/squads.controller.js';

export const squadsRouter = Router();

squadsRouter.get('/',                squadsController.getAll);
squadsRouter.get('/me',              squadsController.getMySquad);
squadsRouter.post('/',               squadsController.create);
squadsRouter.post('/:squadId/join',  squadsController.join);
squadsRouter.post('/:squadId/leave', squadsController.leave);
