import { Router } from 'express';
import { usersController } from '../controllers/users.controller.js';
export const usersRouter = Router();
usersRouter.post('/profile', usersController.createProfile);
usersRouter.get('/me', usersController.getMe);
usersRouter.put('/me', usersController.updateMe);
usersRouter.post('/me/xp', usersController.awardXp);
usersRouter.get('/:username', usersController.getByUsername);
