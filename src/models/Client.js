// backend/src/models/Client.js
import mongoose from 'mongoose';

/**
 * Client Schema
 * 
 * Ye model store karega kon-kon se clients hain
 * Har client ki apni API details aur field mapping hogi
 */
const clientSchema = new mongoose.Schema({
    // Client ka naam - required
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    
    // Company name - optional
    company: {
        type: String,
        trim: true
    },
    
    // Client ki API endpoint - required
    // Example: https://client-api.com/api/lead
    apiEndpoint: {
        type: String,
        required: [true, 'API endpoint is required'],
        trim: true
    },
    
    // API key for authentication - optional (POC mein rakh rahe hain)
    apiKey: {
        type: String,
        trim: true
    },
    
    /**
     * Field Mapping - Yeh sabse important hai
     * 
     * System fields ko client fields mein map karta hai
     * 
     * Example:
     * System mein "name" hai, Client A mein "customerName" hai
     * To mapping: { name: "customerName" }
     * 
     * System mein "phone" hai, Client A mein "mobile" hai
     * To mapping: { phone: "mobile" }
     */
    fieldMapping: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        email: { type: String, trim: true },
        property: { type: String, trim: true },
        configuration: { type: String, trim: true },
        city: { type: String, trim: true },
        budget: { type: String, trim: true }
        // Note: Client apni requirement ke hisaab se extra fields add kar sakte hain
    },
    
    // Client active hai ya nahi
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Total leads received (counter - maintain karenge)
    totalLeadsReceived: {
        type: Number,
        default: 0
    }
    
}, {
    timestamps: true // Automatically createdAt aur updatedAt add karega
});

// Indexes for better performance
clientSchema.index({ name: 1 });
clientSchema.index({ isActive: 1 });

const Client = mongoose.model('Client', clientSchema);
export default Client;