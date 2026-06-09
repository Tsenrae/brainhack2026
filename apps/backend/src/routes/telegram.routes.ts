import { Router } from 'express';
import { telegramController } from '../controllers/telegram.controller.js';

export const telegramRouter = Router();

telegramRouter.get('/info', telegramController.getInfo);
telegramRouter.get('/commands', telegramController.getCommands);
telegramRouter.get('/status', telegramController.getStatus);
telegramRouter.post('/link-code', telegramController.createLinkCode);
telegramRouter.post('/link', telegramController.linkTelegramAccount);
telegramRouter.get('/stats', telegramController.getStats);
telegramRouter.get('/scans', telegramController.getRecentScans);
telegramRouter.get('/history', telegramController.getHistory);
telegramRouter.post('/analyze', telegramController.analyze);