import { Router } from 'express';
import { scannerController } from '../controllers/scanner.controller.js';

export const scannerRouter = Router();

scannerRouter.post('/scan',    scannerController.scan);
scannerRouter.get('/history',  scannerController.getHistory);
scannerRouter.get('/stats',    scannerController.getStats);
