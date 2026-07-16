// backend/src/services/ruleEngine.js
const Rule = require('../models/Rule');

/**
 * Rule Engine Service
 * 
 * Ye service decide karegi ki kaun-si lead kis client ko jayegi
 * 
 * Working:
 * 1. Saare active rules fetch karo
 * 2. Priority ke hisaab se sort karo (highest first)
 * 3. Har rule ko lead ke data se match karo
 * 4. Pehla matching rule return karo
 */
class RuleEngine {
    
    /**
     * Main method - matching client find karo
     * 
     * @param {Object} leadData - Lead ka data (system format mein)
     * @returns {Object} - Matching client object ya null
     */
    async findMatchingClient(leadData) {
        try {
            // Step 1: Saare active rules fetch karo
            const rules = await Rule.find({ isActive: true })
                .populate('clientId') // Client ka data bhi saath mein lao
                .sort({ priority: 1 }); // Priority 1 = highest
            
            if (!rules || rules.length === 0) {
                console.log('⚠️ No active rules found');
                return null;
            }
            
            console.log(`🔍 Checking ${rules.length} rules for lead:`, leadData);
            
            // Step 2: Har rule ko check karo
            for (const rule of rules) {
                if (this._matchesRule(rule, leadData)) {
                    console.log(`✅ Rule matched: ${rule.name} -> ${rule.clientId.name}`);
                    
                    // Increment counter
                    await rule.incrementLeadsAssigned();
                    
                    return rule.clientId;
                }
            }
            
            console.log('❌ No matching rule found');
            return null;
            
        } catch (error) {
            console.error('❌ Rule engine error:', error.message);
            throw error;
        }
    }
    
    /**
     * Private method - check if lead matches a rule
     * 
     * @param {Object} rule - Rule object
     * @param {Object} leadData - Lead data
     * @returns {Boolean} - True if matches, false otherwise
     */
    _matchesRule(rule, leadData) {
        const conditions = rule.conditions;
        
        // Agar conditions empty hain to rule match karega (catch-all rule)
        // But POC mein hum specific conditions rakhna prefer karenge
        
        // Check each condition
        for (const [key, value] of Object.entries(conditions)) {
            // Agar condition value nahi hai to skip karo
            if (!value) continue;
            
            // Special handling for different condition types
            switch (key) {
                case 'minBudget':
                    // Budget greater than or equal to minBudget
                    if (!leadData.budget || leadData.budget < value) {
                        return false;
                    }
                    break;
                    
                case 'maxBudget':
                    // Budget less than or equal to maxBudget
                    if (!leadData.budget || leadData.budget > value) {
                        return false;
                    }
                    break;
                    
                default:
                    // String comparison (case insensitive)
                    if (!leadData[key] || 
                        leadData[key].toLowerCase() !== value.toLowerCase()) {
                        return false;
                    }
                    break;
            }
        }
        
        // Saari conditions pass ho gayi
        return true;
    }
    
    /**
     * Check if any rule exists for a client
     * 
     * @param {String} clientId - Client ID
     * @returns {Boolean} - True if rules exist
     */
    async hasRulesForClient(clientId) {
        const count = await Rule.countDocuments({ 
            clientId: clientId, 
            isActive: true 
        });
        return count > 0;
    }
    
    /**
     * Get all rules for a client
     * 
     * @param {String} clientId - Client ID
     * @returns {Array} - Array of rules
     */
    async getRulesForClient(clientId) {
        return await Rule.find({ clientId: clientId, isActive: true })
            .sort({ priority: 1 });
    }
}

// Singleton instance export
module.exports = new RuleEngine();