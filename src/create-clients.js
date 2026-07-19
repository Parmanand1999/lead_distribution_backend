// create-clients.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function createClients() {

    console.log('🚀 Creating clients...\n');

    try {
        // Client A - Residential 2BHK
        console.log('📌 Creating Client A...');
        const clientA = await axios.post(`${BASE_URL}/clients`, {
            name: "Client A",
            company: "ABC Realty",
            apiEndpoint: "https://api.clienta.com/lead",
            apiKey: "test-key-123",
            fieldMapping: {
                name: "customerName",
                phone: "mobile",
                email: "emailId",
                property: "propertyType",
                configuration: "configuration",
                city: "city"
            }
        });
        console.log('✅ Client A created:', clientA.data.data.name);
        console.log('📋 Client A ID:', clientA.data.data._id);

        // Client B - Commercial Office
        console.log('\n📌 Creating Client B...');
        const clientB = await axios.post(`${BASE_URL}/clients`, {
            name: "Client B",
            company: "XYZ Realty",
            apiEndpoint: "https://api.clientb.com/lead",
            apiKey: "test-key-456",
            fieldMapping: {
                name: "fullName",
                phone: "phoneNumber",
                email: "emailAddress",
                property: "propertyCategory",
                configuration: "propertyConfig",
                city: "cityName"
            }
        });
        console.log('✅ Client B created:', clientB.data.data.name);
        console.log('📋 Client B ID:', clientB.data.data._id);

        // Client C - Residential 3BHK
        console.log('\n📌 Creating Client C...');
        const clientC = await axios.post(`${BASE_URL}/clients`, {
            name: "Client C",
            company: "PQR Properties",
            apiEndpoint: "https://api.clientc.com/lead",
            apiKey: "test-key-789",
            fieldMapping: {
                name: "leadName",
                phone: "contactNo",
                email: "email",
                property: "propertyType",
                configuration: "bhkType",
                city: "location"
            }
        });
        console.log('✅ Client C created:', clientC.data.data.name);
        console.log('📋 Client C ID:', clientC.data.data._id);

        console.log('\n🎉 All clients created successfully!');
        console.log('\n📝 Save these IDs for creating rules:');
        console.log(`Client A: ${clientA.data.data._id}`);
        console.log(`Client B: ${clientB.data.data._id}`);
        console.log(`Client C: ${clientC.data.data._id}`);

        return {
            clientAId: clientA.data.data._id,
            clientBId: clientB.data.data._id,
            clientCId: clientC.data.data._id
        };

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Run
createClients();