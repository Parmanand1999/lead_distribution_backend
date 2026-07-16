// backend/src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/reports/dashboard', reportController.getDashboardStats);

module.exports = router;
