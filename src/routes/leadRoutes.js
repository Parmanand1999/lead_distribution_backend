// backend/src/routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// POST /api/lead - Receive new lead
router.post('/lead', leadController.handleLead);

// GET /api/leads - Get all leads with filters
router.get('/leads', leadController.getLeads);

// GET /api/leads/:id - Get single lead
router.get('/leads/:id', leadController.getLeadById);

module.exports = router;