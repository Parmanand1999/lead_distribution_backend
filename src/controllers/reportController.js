// backend/src/controllers/reportController.js
const Lead = require('../models/Lead');
const Client = require('../models/Client');

// Get overall statistics for dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        // Total, Success, Failed counts
        const stats = await Lead.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    success: {
                        $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
                    },
                    failed: {
                        $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
                    }
                }
            }
        ]);
        
        const summary = stats[0] || { total: 0, success: 0, failed: 0 };
        const successRate = summary.total > 0 ? Math.round((summary.success / summary.total) * 100) : 0;
        
        // Group by Source
        const sourceStats = await Lead.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Group by Client
        const clientStats = await Lead.aggregate([
            {
                $match: { assignedTo: { $ne: null } }
            },
            {
                $group: {
                    _id: '$assignedTo',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Populate client names
        const clients = await Client.find({ _id: { $in: clientStats.map(c => c._id) } });
        const clientNameMap = {};
        clients.forEach(c => {
            clientNameMap[c._id.toString()] = c.name;
        });
        
        const formattedClientStats = clientStats.map(c => ({
            clientId: c._id,
            name: clientNameMap[c._id.toString()] || 'Unknown Client',
            count: c.count
        }));
        
        // Get recent lead history (10 latest)
        const recentLeads = await Lead.find({})
            .populate('assignedTo', 'name company')
            .sort({ createdAt: -1 })
            .limit(10);
            
        res.json({
            success: true,
            data: {
                summary: {
                    total: summary.total,
                    success: summary.success,
                    failed: summary.failed,
                    successRate
                },
                sourceDistribution: sourceStats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                clientDistribution: formattedClientStats,
                recentLeads
            }
        });
        
    } catch (error) {
        console.error('❌ Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};
