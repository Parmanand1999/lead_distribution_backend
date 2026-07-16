// backend/src/models/Rule.js
const mongoose = require('mongoose');

/**
 * Rule Schema
 * 
 * Ye define karta hai ki kaun-si lead kis client ko jayegi
 * 
 * Example Rule:
 * IF property = 'Residential' AND configuration = '2 BHK'
 * THEN assign to Client A
 */
const ruleSchema = new mongoose.Schema({
    // Rule ka naam (readable)
    name: {
        type: String,
        required: [true, 'Rule name is required'],
        trim: true
    },
    
    // Kis client ko assign karna hai (reference)
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Client ID is required']
    },
    
    /**
     * Conditions - Rule ki conditions
     * 
     * Example conditions:
     * {
     *   property: 'Residential',
     *   configuration: '2 BHK',
     *   city: 'Delhi',
     *   minBudget: 500000,
     *   maxBudget: 1000000
     * }
     * 
     * Note: Multiple conditions AND logic se match hongi
     * Means saari conditions satisfy honi chahiye
     */
    conditions: {
        property: { type: String, trim: true },
        configuration: { type: String, trim: true },
        city: { type: String, trim: true },
        minBudget: { type: Number, min: 0 },
        maxBudget: { type: Number, min: 0 },
        // Future mein aur conditions add kar sakte hain
        // source: { type: String }, // Agar specific source se ho to
        // leadType: { type: String }, // Agar lead type ho to
    },
    
    /**
     * Priority - agar multiple rules match karein to kaun pehle aayega
     * 1 = Highest priority
     * Higher number = Lower priority
     */
    priority: {
        type: Number,
        default: 1,
        min: 1
    },
    
    // Rule active hai ya nahi
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Is rule se kitni leads assign hui (analytics)
    leadsAssigned: {
        type: Number,
        default: 0
    }
    
}, {
    timestamps: true
});

// Indexes
ruleSchema.index({ clientId: 1 });
ruleSchema.index({ priority: 1 });
ruleSchema.index({ isActive: 1 });

// Compound index for faster rule matching
ruleSchema.index({ 
    'conditions.property': 1, 
    'conditions.configuration': 1,
    'conditions.city': 1 
});

// Method - increment leads assigned counter
ruleSchema.methods.incrementLeadsAssigned = function() {
    this.leadsAssigned += 1;
    return this.save();
};

module.exports = mongoose.model('Rule', ruleSchema);