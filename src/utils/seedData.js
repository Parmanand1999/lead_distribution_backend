// backend/src/utils/seedData.js
const Client = require('../models/Client');
const Rule = require('../models/Rule');
const mongoose = require('mongoose');

async function seedDummyData() {
    try {
        console.log('🌱 Seeding dummy data...');
        
        // Clear existing data
        await Client.deleteMany({});
        await Rule.deleteMany({});
        
        // Create clients
        const clientA = await Client.create({
            name: 'Client A',
            company: 'ABC Realty',
            apiEndpoint: 'https://api.clienta.com/lead',
            apiKey: 'test-key-123',
            fieldMapping: {
                name: 'customerName',
                phone: 'mobile',
                email: 'emailId',
                property: 'propertyType',
                configuration: 'configuration',
                city: 'city'
            }
        });
        
        const clientB = await Client.create({
            name: 'Client B',
            company: 'XYZ Realty',
            apiEndpoint: 'https://api.clientb.com/lead',
            apiKey: 'test-key-456',
            fieldMapping: {
                name: 'fullName',
                phone: 'phoneNumber',
                email: 'emailAddress',
                property: 'propertyCategory',
                configuration: 'propertyConfig',
                city: 'cityName'
            }
        });
        
        const clientC = await Client.create({
            name: 'Client C',
            company: 'PQR Properties',
            apiEndpoint: 'https://api.clientc.com/lead',
            apiKey: 'test-key-789',
            fieldMapping: {
                name: 'leadName',
                phone: 'contactNo',
                email: 'email',
                property: 'propertyType',
                configuration: 'bhkType',
                city: 'location'
            }
        });
        
        console.log('✅ Clients created');
        
        // Create rules
        await Rule.create({
            name: 'Residential 2BHK Delhi',
            clientId: clientA._id,
            conditions: {
                property: 'Residential',
                configuration: '2 BHK',
                city: 'Delhi'
            },
            priority: 1
        });
        
        await Rule.create({
            name: 'Commercial Office Noida',
            clientId: clientB._id,
            conditions: {
                property: 'Commercial',
                configuration: 'Office',
                city: 'Noida'
            },
            priority: 1
        });
        
        await Rule.create({
            name: 'Residential 3BHK Gurgaon',
            clientId: clientC._id,
            conditions: {
                property: 'Residential',
                configuration: '3 BHK',
                city: 'Gurgaon'
            },
            priority: 1
        });
        
        console.log('✅ Rules created');
        console.log('🌱 Seeding complete!');
        
    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
}

// Run if directly called
if (require.main === module) {
    require('../config/database')();
    seedDummyData().then(() => {
        mongoose.connection.close();
        console.log('💤 Database connection closed');
    });
}

module.exports = seedDummyData;