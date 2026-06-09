import { Router } from 'express';
import { getHeatmap } from '../controllers/heatmap.controller.js';

export const heatmapRouter = Router();

heatmapRouter.get('/', getHeatmap);
