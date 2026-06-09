import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller.js';
export const reportsRouter = Router();
reportsRouter.post('/', reportsController.submit);
reportsRouter.get('/mine', reportsController.getMine);
reportsRouter.get('/stats', reportsController.getStats);
