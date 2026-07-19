// backend/src/routes/reportRoutes.js
import express from 'express';
import { getDashboardStats } from '../controllers/reportController.js';

const router = express.Router();

router.get('/reports/dashboard', getDashboardStats);

export default router;
