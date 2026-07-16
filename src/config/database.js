// backend/src/config/database.js
const mongoose = require('mongoose');

/**
 * Database connection function
 * Ye function MongoDB se connect karta hai
 * Agar connection fail hota hai to process exit kar deta hai
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Ye options MongoDB driver ke liye hain
            // POC ke liye basic connection hi kaafi hai
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
        
        // Connection events listen karna (optional)
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        // POC mein agar DB nahi connect hota to process exit kar do
        process.exit(1);
    }
};

module.exports = connectDB;