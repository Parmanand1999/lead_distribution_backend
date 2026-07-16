// backend/src/controllers/leadController.js
const distributionService = require('../services/distributionService');
const Lead = require('../models/Lead');

/**
 * Lead Controller
 * 
 * Lead se related saare API endpoints handle karega
 */
exports.handleLead = async (req, res) => {
    try {
        const { source, data } = req.body;
        
        // Validate input
        if (!source) {
            return res.status(400).json({
                success: false,
                error: 'Source is required'
            });
        }
        
        if (!data || typeof data !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Data is required and must be an object'
            });
        }
        
        // Process lead
        const result = await distributionService.processLead(source, data);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            // Still return 200 but with error flag
            // Client ko batana hai ki lead mil gayi but processing mein issue hai
            res.status(200).json(result);
        }
        
    } catch (error) {
        console.error('❌ Handle lead error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const { 
            source, 
            status, 
            clientId,
            dateFrom, 
            dateTo,
            limit = 50,
            page = 1
        } = req.query;
        
        // Build filter
        const filter = {};
        if (source) filter.source = source;
        if (status) filter.status = status;
        if (clientId) filter.assignedTo = clientId;
        
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
        }
        
        // Calculate skip for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get leads with pagination
        const leads = await Lead.find(filter)
            .populate('assignedTo', 'name company')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Get total count
        const total = await Lead.countDocuments(filter);
        
        res.json({
            success: true,
            data: leads,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        console.error('❌ Get leads error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

exports.getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const lead = await Lead.findById(id)
            .populate('assignedTo', 'name company apiEndpoint');
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found'
            });
        }
        
        res.json({
            success: true,
            data: lead
        });
        
    } catch (error) {
        console.error('❌ Get lead by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};