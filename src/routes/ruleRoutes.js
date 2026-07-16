// backend/src/routes/ruleRoutes.js
const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

router.get('/rules', ruleController.getRules);
router.get('/rules/:id', ruleController.getRuleById);
router.post('/rules', ruleController.createRule);
router.put('/rules/:id', ruleController.updateRule);
router.delete('/rules/:id', ruleController.deleteRule);

module.exports = router;
