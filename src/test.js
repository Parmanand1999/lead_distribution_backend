// test.js - Create a test file
// Run: node test.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testCreateLead() {
    try {
        // Test 1: Residential 2 BHK Delhi -> Client A
        const lead1 = {
            source: 'facebook',
            data: {
                name: 'Rahul Sharma',
                phone_number: '9999999999',
                email: 'rahul@email.com',
                property_type: 'Residential',
                bhk_type: '2 BHK',
                city_name: 'Delhi',
                budget: 500000
            }
        };
        
        console.log('📤 Sending lead 1:', lead1);
        const response1 = await axios.post(`${BASE_URL}/lead`, lead1);
        console.log('✅ Response 1:', response1.data);
        
        // Test 2: Commercial Office Noida -> Client B
        const lead2 = {
            source: 'google',
            data: {
                full_name: 'Aman Verma',
                mobile: '8888888888',
                email_address: 'aman@email.com',
                property_category: 'Commercial',
                configuration_type: 'Office',
                city: 'Noida',
                budget_range: 1000000
            }
        };
        
        console.log('\n📤 Sending lead 2:', lead2);
        const response2 = await axios.post(`${BASE_URL}/lead`, lead2);
        console.log('✅ Response 2:', response2.data);
        
        // Test 3: Residential 3 BHK Gurgaon -> Client C
        const lead3 = {
            source: 'instagram',
            data: {
                customer_name: 'Mohit Singh',
                contact_number: '7777777777',
                email_id: 'mohit@email.com',
                property_category: 'Residential',
                property_type: '3 BHK',
                city_name: 'Gurgaon',
                budget: 750000
            }
        };
        
        console.log('\n📤 Sending lead 3:', lead3);
        const response3 = await axios.post(`${BASE_URL}/lead`, lead3);
        console.log('✅ Response 3:', response3.data);
        
        // Test 4: No matching rule
        const lead4 = {
            source: 'website',
            data: {
                fullName: 'Unknown Person',
                mobileNumber: '6666666666',
                emailId: 'unknown@email.com',
                propertyType: 'Residential',
                configType: '4 BHK',
                cityName: 'Mumbai',
                budget: 2000000
            }
        };
        
        console.log('\n📤 Sending lead 4 (should fail):', lead4);
        const response4 = await axios.post(`${BASE_URL}/lead`, lead4);
        console.log('✅ Response 4:', response4.data);
        
    } catch (error) {
        console.error('❌ Test error:', error.response?.data || error.message);
    }
}

testCreateLead();