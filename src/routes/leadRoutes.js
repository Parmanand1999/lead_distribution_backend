// backend/src/routes/leadRoutes.js
import express from 'express';
import { handleLead, getLeads, getLeadById } from '../controllers/leadController.js';

const router = express.Router();

// POST /api/lead - Receive new lead
router.post('/lead', handleLead);

// GET /api/leads - Get all leads with filters
router.get('/leads', getLeads);

// GET /api/leads/:id - Get single lead
router.get('/leads/:id', getLeadById);

export default router;