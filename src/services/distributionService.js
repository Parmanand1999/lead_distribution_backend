// backend/src/services/distributionService.js
const Lead = require('../models/Lead');
const Client = require('../models/Client');
const ruleEngine = require('./ruleEngine');
const mappingService = require('./mappingService');

/**
 * Distribution Service
 * 
 * Ye service complete lead distribution process handle karegi
 * 
 * Flow:
 * 1. Lead save karo
 * 2. Rule check karo
 * 3. Client find karo
 * 4. Data map karo
 * 5. Client API call karo (POC mein simulate karenge)
 * 6. Lead update karo
 */
class DistributionService {
    
    /**
     * Main method - process incoming lead
     * 
     * @param {String} source - Source of lead
     * @param {Object} rawData - Raw lead data
     * @returns {Object} - Result of processing
     */
    async processLead(source, rawData) {
        const startTime = Date.now();
        
        try {
            console.log(`📥 Processing lead from ${source}`);
            
            // Step 1: Save lead with raw data
            const lead = new Lead({
                source,
                rawData,
                status: 'pending'
            });
            await lead.save();
            console.log(`✅ Lead saved with ID: ${lead._id}`);
            
            // Step 2: Map source to system data
            const { systemData } = mappingService.mapLeadData(rawData, source);
            console.log('📋 System data:', systemData);
            
            // Step 3: Validate required fields
            const validation = mappingService.validateRequiredFields(systemData);
            if (!validation.isValid) {
                const error = `Missing required fields: ${validation.missingFields.join(', ')}`;
                await lead.markAsFailed(error);
                return {
                    success: false,
                    leadId: lead._id,
                    error: error
                };
            }
            
            // Step 4: Find matching client using rules
            const client = await ruleEngine.findMatchingClient(systemData);
            
            if (!client) {
                const error = 'No matching client found for this lead';
                await lead.markAsFailed(error);
                return {
                    success: false,
                    leadId: lead._id,
                    error: error
                };
            }
            
            console.log(`🎯 Assigned to client: ${client.name}`);
            
            // Step 5: Map system data to client format
            const { clientData } = mappingService.mapLeadData(
                rawData, 
                source, 
                client.fieldMapping
            );
            
            console.log('📤 Client data:', clientData);
            
            // Step 6: Send to client (POC mein simulate karte hain)
            const apiResult = await this._sendToClient(client, clientData);
            
            // Step 7: Update lead
            lead.assignedTo = client._id;
            lead.mappedData = systemData;
            lead.clientData = clientData;
            
            if (apiResult.success) {
                await lead.markAsSuccess(clientData, apiResult.response);
                
                // Update client counter
                await Client.findByIdAndUpdate(client._id, {
                    $inc: { totalLeadsReceived: 1 }
                });
                
                return {
                    success: true,
                    leadId: lead._id,
                    client: client.name,
                    dataSent: clientData,
                    response: apiResult.response,
                    processingTime: Date.now() - startTime
                };
            } else {
                await lead.markAsFailed(apiResult.error);
                return {
                    success: false,
                    leadId: lead._id,
                    client: client.name,
                    error: apiResult.error,
                    processingTime: Date.now() - startTime
                };
            }
            
        } catch (error) {
            console.error('❌ Distribution error:', error);
            return {
                success: false,
                error: error.message,
                processingTime: Date.now() - startTime
            };
        }
    }
    
    /**
     * Private method: Send lead to client API
     * 
     * POC mein hum actual API call nahi karenge
     * Instead, simulate karenge
     * 
     * @param {Object} client - Client object
     * @param {Object} data - Data to send
     * @returns {Object} - { success, response/error }
     */
    async _sendToClient(client, data) {
        try {
            console.log(`📡 Sending to ${client.name} API: ${client.apiEndpoint}`);
            
            // POC: Simulate API call
            // Real implementation mein axios use karenge
            // const response = await axios.post(client.apiEndpoint, data, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-API-Key': client.apiKey || 'test-key'
            //     }
            // });
            
            // Simulate API response (80% success rate)
            const success = Math.random() < 0.8;
            
            if (success) {
                return {
                    success: true,
                    response: {
                        status: 'success',
                        message: 'Lead received successfully',
                        leadId: `CLIENT_${Date.now()}`,
                        timestamp: new Date().toISOString()
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Client API returned error (simulated)'
                };
            }
            
        } catch (error) {
            return {
                success: false,
                error: error.message || 'API call failed'
            };
        }
    }
    
    /**
     * Retry failed leads
     * 
     * @param {String} leadId - Lead ID to retry
     * @returns {Object} - Result
     */
    async retryLead(leadId) {
        // Future implementation
        // Failed leads ko retry kar sakte hain
        console.log(`🔄 Retrying lead: ${leadId}`);
        // Implementation...
    }
}

// Singleton instance export
module.exports = new DistributionService();