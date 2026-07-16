// backend/src/models/Lead.js
const mongoose = require('mongoose');

/**
 * Lead Schema
 * 
 * Har incoming lead yahan store hogi
 * Pura lifecycle track karega
 */
const leadSchema = new mongoose.Schema({
    // Lead kahan se aayi (Facebook, Google, etc.)
    source: {
        type: String,
        required: [true, 'Source is required'],
        trim: true,
        enum: ['facebook', 'google', 'instagram', 'website', 'excel', 'other']
        // POC ke liye enum use kar rahe hain
    },
    
    // Original raw data jo source se aayi
    // Example: { name: "Rahul", phone_number: "9999999999", ... }
    rawData: {
        type: Object,
        required: true
    },
    
    // Mapped data (system ke format mein)
    // Example: { name: "Rahul", phone: "9999999999", ... }
    mappedData: {
        type: Object,
        default: null
    },
    
    // Data jo client ko bheja gaya (client ke format mein)
    // Example: { customerName: "Rahul", mobile: "9999999999", ... }
    clientData: {
        type: Object,
        default: null
    },
    
    // Kis client ko assign hui (reference to Client model)
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        default: null
    },
    
    // Lead ki current status
    status: {
        type: String,
        enum: ['pending', 'assigned', 'success', 'failed'],
        default: 'pending'
    },
    
    // Agar failed hai to error message
    errorMessage: {
        type: String,
        default: null
    },
    
    // Client API ka response (success ya fail)
    apiResponse: {
        type: Object,
        default: null
    },
    
    // Kitni baar retry kiya (future use)
    retryCount: {
        type: Number,
        default: 0
    },
    
    // Processing time in milliseconds
    processingTime: {
        type: Number,
        default: null
    }
    
}, {
    timestamps: true
});

// Indexes for faster queries
leadSchema.index({ source: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 }); // Latest leads pehle

// Virtual field - lead ka age (kitni purani hai)
leadSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Method - lead ko mark as success
leadSchema.methods.markAsSuccess = function(clientData, apiResponse) {
    this.status = 'success';
    this.clientData = clientData;
    this.apiResponse = apiResponse;
    this.processingTime = Date.now() - this.createdAt;
    return this.save();
};

// Method - lead ko mark as failed
leadSchema.methods.markAsFailed = function(errorMessage) {
    this.status = 'failed';
    this.errorMessage = errorMessage;
    this.processingTime = Date.now() - this.createdAt;
    return this.save();
};

module.exports = mongoose.model('Lead', leadSchema);