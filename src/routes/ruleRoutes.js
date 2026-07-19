// backend/src/routes/ruleRoutes.js
import express from 'express';
import {
    getRules,
    getRuleById,
    createRule,
    updateRule,
    deleteRule
} from '../controllers/ruleController.js';

const router = express.Router();

router.get('/rules', getRules);
router.get('/rules/:id', getRuleById);
router.post('/rules', createRule);
router.put('/rules/:id', updateRule);
router.delete('/rules/:id', deleteRule);

export default router;
