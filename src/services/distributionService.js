import Lead from "../models/Lead.js";
import Client from "../models/Client.js";
import mappingService from "./mappingService.js";
import ruleEngine from "./ruleEngine.js";

class DistributionService {
  async processLead(source, rawData) {
    const startTime = Date.now();

    try {
      // 1. Save Raw Lead
      const lead = await Lead.create({
        source,
        rawData,
        status: "pending",
      });

      // 2. Normalize Lead
      const mappedData = mappingService.mapLeadData(rawData, source);

      // 3. Validate Required Fields
      const validation = mappingService.validateRequiredFields(mappedData);

      if (!validation.isValid) {
        lead.status = "rejected";
        lead.remarks = `Missing fields: ${validation.missingFields.join(", ")}`;

        lead.mappedData = mappedData;

        await lead.save();

        return {
          success: false,
          message: lead.remarks,
          leadId: lead._id,
        };
      }

      const systemData = mappingService.mapLeadData(rawData, source);

      console.log("System Data:", systemData);

      // 4. Find Matching Rule
      const rule = await ruleEngine.findMatchingRule(mappedData);

      if (!rule) {
        lead.status = "rejected";
        lead.remarks = "No matching rule found";
        lead.mappedData = mappedData;

        await lead.save();

        return {
          success: false,
          message: "No matching rule found",
          leadId: lead._id,
        };
      }

      // 5. Assign Client
      lead.assignedTo = rule.clientId._id;
      lead.rule = rule._id;
      lead.status = "assigned";
      lead.mappedData = mappedData;

      await lead.save();

      // 6. Update Client Statistics
      await Client.findByIdAndUpdate(rule.clientId._id, {
        $inc: {
          totalLeadsReceived: 1,
        },
      });

      return {
        success: true,
        leadId: lead._id,
        assignedTo: rule.clientId.name,
        rule: rule.name,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default new DistributionService();
