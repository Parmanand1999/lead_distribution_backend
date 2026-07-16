// backend/src/services/mappingService.js

/**
 * Mapping Service
 * 
 * Ye service data ko ek format se doosre format mein convert karegi
 * 
 * Two types of mapping:
 * 1. Source → System: Source ke fields ko system fields mein map karna
 * 2. System → Client: System fields ko client fields mein map karna
 * 
 * Example:
 * Facebook source: { name: "Rahul", phone_number: "9999999999" }
 * System format:   { name: "Rahul", phone: "9999999999" }
 * Client format:   { customerName: "Rahul", mobile: "9999999999" }
 */
class MappingService {
    
    /**
     * Main method - complete mapping process
     * 
     * @param {Object} rawData - Raw data from source
     * @param {String} source - Source type (facebook, google, etc.)
     * @param {Object} clientMapping - Client's field mapping
     * @returns {Object} - { systemData, clientData }
     */
    mapLeadData(rawData, source, clientMapping = {}) {
        try {
            // Step 1: Source → System
            const systemData = this._mapSourceToSystem(rawData, source);
            
            // Step 2: System → Client
            const clientData = this._mapSystemToClient(systemData, clientMapping);
            
            return {
                systemData,
                clientData
            };
            
        } catch (error) {
            console.error('❌ Mapping error:', error.message);
            throw error;
        }
    }
    
    /**
     * Private method: Source to System mapping
     * 
     * @param {Object} rawData - Data from source
     * @param {String} source - Source type
     * @returns {Object} - System format data
     */
    _mapSourceToSystem(rawData, source) {
        // Define source mappings
        // POC ke liye basic mappings
        const sourceMappings = {
            facebook: {
                name: 'name',
                phone: 'phone_number',
                email: 'email',
                property: 'property_type',
                configuration: 'bhk_type',
                city: 'city_name',
                budget: 'budget'
            },
            google: {
                name: 'full_name',
                phone: 'mobile',
                email: 'email_address',
                property: 'property_category',
                configuration: 'configuration_type',
                city: 'city',
                budget: 'budget_range'
            },
            instagram: {
                name: 'customer_name',
                phone: 'contact_number',
                email: 'email_id',
                property: 'property_category',
                configuration: 'property_type',
                city: 'city_name',
                budget: 'budget'
            },
            website: {
                name: 'fullName',
                phone: 'mobileNumber',
                email: 'emailId',
                property: 'propertyType',
                configuration: 'configType',
                city: 'cityName',
                budget: 'budget'
            },
            excel: {
                name: 'Name',
                phone: 'Phone',
                email: 'Email',
                property: 'Property',
                configuration: 'Configuration',
                city: 'City',
                budget: 'Budget'
            }
        };
        
        // Default mapping agar source define nahi hai
        const defaultMapping = {
            name: 'name',
            phone: 'phone',
            email: 'email',
            property: 'property',
            configuration: 'configuration',
            city: 'city',
            budget: 'budget'
        };
        
        // Get mapping for this source
        const mapping = sourceMappings[source] || defaultMapping;
        
        // Create system data
        const systemData = {};
        
        for (const [systemField, sourceField] of Object.entries(mapping)) {
            // Check if source field exists in raw data
            if (rawData[sourceField] !== undefined && rawData[sourceField] !== null) {
                systemData[systemField] = rawData[sourceField];
            }
        }
        
        // Agar koi required field missing hai to log karo
        const requiredFields = ['name', 'phone'];
        const missingFields = requiredFields.filter(f => !systemData[f]);
        if (missingFields.length > 0) {
            console.log(`⚠️ Missing required fields: ${missingFields.join(', ')}`);
        }
        
        return systemData;
    }
    
    /**
     * Private method: System to Client mapping
     * 
     * @param {Object} systemData - System format data
     * @param {Object} clientMapping - Client's field mapping
     * @returns {Object} - Client format data
     */
    _mapSystemToClient(systemData, clientMapping) {
        const clientData = {};
        
        // Agar client mapping nahi hai to system data hi return karo
        if (!clientMapping || Object.keys(clientMapping).length === 0) {
            return { ...systemData };
        }
        
        // Map each system field to client field
        for (const [systemField, clientField] of Object.entries(clientMapping)) {
            // Agar system field exists and client field is defined
            if (systemData[systemField] !== undefined && 
                systemData[systemField] !== null && 
                clientField) {
                clientData[clientField] = systemData[systemField];
            }
        }
        
        return clientData;
    }
    
    /**
     * Get all system fields
     * 
     * @returns {Array} - List of system fields
     */
    getSystemFields() {
        return ['name', 'phone', 'email', 'property', 'configuration', 'city', 'budget'];
    }
    
    /**
     * Validate if data has all required fields
     * 
     * @param {Object} data - Data to validate
     * @param {Array} requiredFields - List of required fields
     * @returns {Object} - { isValid, missingFields }
     */
    validateRequiredFields(data, requiredFields = ['name', 'phone']) {
        const missingFields = requiredFields.filter(
            field => !data[field] || data[field].trim() === ''
        );
        
        return {
            isValid: missingFields.length === 0,
            missingFields
        };
    }
}

// Singleton instance export
module.exports = new MappingService();