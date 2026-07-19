// backend/src/routes/clientRoutes.js
import express from 'express';
import {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/clientController.js';

const router = express.Router();

router.get('/clients', getClients);
router.get('/clients/:id', getClientById);
router.post('/clients', createClient);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

export default router;
