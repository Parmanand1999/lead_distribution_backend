// backend/src/controllers/clientController.js
const Client = require('../models/Client');

// Get all clients
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: clients
        });
    } catch (error) {
        console.error('❌ Get clients error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Get single client by ID
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                error: 'Client not found'
            });
        }
        res.json({
            success: true,
            data: client
        });
    } catch (error) {
        console.error('❌ Get client by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Create new client
exports.createClient = async (req, res) => {
    try {
        const { name, company, apiEndpoint, apiKey, fieldMapping, isActive } = req.body;
        
        if (!name || !apiEndpoint) {
            return res.status(400).json({
                success: false,
                error: 'Name and API endpoint are required'
            });
        }
        
        const client = new Client({
            name,
            company,
            apiEndpoint,
            apiKey,
            fieldMapping,
            isActive
        });
        
        await client.save();
        res.status(201).json({
            success: true,
            data: client
        });
    } catch (error) {
        console.error('❌ Create client error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Update client
exports.updateClient = async (req, res) => {
    try {
        const { name, company, apiEndpoint, apiKey, fieldMapping, isActive } = req.body;
        
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                error: 'Client not found'
            });
        }
        
        if (name) client.name = name;
        if (company !== undefined) client.company = company;
        if (apiEndpoint) client.apiEndpoint = apiEndpoint;
        if (apiKey !== undefined) client.apiKey = apiKey;
        if (fieldMapping !== undefined) client.fieldMapping = fieldMapping;
        if (isActive !== undefined) client.isActive = isActive;
        
        await client.save();
        res.json({
            success: true,
            data: client
        });
    } catch (error) {
        console.error('❌ Update client error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Delete client
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                error: 'Client not found'
            });
        }
        
        await Client.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Client deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete client error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};
