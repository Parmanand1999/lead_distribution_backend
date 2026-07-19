// backend/src/controllers/ruleController.js
import Rule from '../models/Rule.js';

// Get all rules
export const getRules = async (req, res) => {
    try {
        const rules = await Rule.find({})
            .populate('clientId', 'name company')
            .sort({ priority: 1, createdAt: -1 });
        res.json({
            success: true,
            data: rules
        });
    } catch (error) {
        console.error('❌ Get rules error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Get single rule
export const getRuleById = async (req, res) => {
    try {
        const rule = await Rule.findById(req.params.id).populate('clientId', 'name company');
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
        res.json({
            success: true,
            data: rule
        });
    } catch (error) {
        console.error('❌ Get rule by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Create a new rule
export const createRule = async (req, res) => {
    try {
        const { name, clientId, conditions, priority, isActive } = req.body;
        
        if (!name || !clientId) {
            return res.status(400).json({
                success: false,
                error: 'Name and Client ID are required'
            });
        }
        
        const rule = new Rule({
            name,
            clientId,
            conditions,
            priority,
            isActive
        });
        
        await rule.save();
        res.status(201).json({
            success: true,
            data: rule
        });
    } catch (error) {
        console.error('❌ Create rule error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Update rule
export const updateRule = async (req, res) => {
    try {
        const { name, clientId, conditions, priority, isActive } = req.body;
        
        const rule = await Rule.findById(req.params.id);
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
        
        if (name) rule.name = name;
        if (clientId) rule.clientId = clientId;
        if (conditions !== undefined) rule.conditions = conditions;
        if (priority !== undefined) rule.priority = priority;
        if (isActive !== undefined) rule.isActive = isActive;
        
        await rule.save();
        res.json({
            success: true,
            data: rule
        });
    } catch (error) {
        console.error('❌ Update rule error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Delete rule
export const deleteRule = async (req, res) => {
    try {
        const rule = await Rule.findById(req.params.id);
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
        
        await Rule.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Rule deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete rule error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};
