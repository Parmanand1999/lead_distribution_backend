import Rule from "../models/Rule.js";

class RuleEngine {
  async findMatchingRule(leadData) {
    const rules = await Rule.find({ isActive: true })
      .populate("clientId", "name company isActive")
      .sort({ priority: 1 });

    if (!rules.length) {
      return null;
    }

    for (const rule of rules) {
      // Convert Mongoose Map -> Plain Object
      const conditions =
        rule.conditions instanceof Map
          ? Object.fromEntries(rule.conditions)
          : rule.conditions;

      if (this.matchesRule(conditions, leadData)) {
        await Rule.updateOne(
          { _id: rule._id },
          {
            $inc: {
              leadsAssigned: 1,
            },
          },
        );

        return rule;
      }
    }

    return null;
  }

  matchesRule(conditions = {}, leadData = {}) {
    for (const [field, expectedValue] of Object.entries(conditions)) {
      if (
        expectedValue === undefined ||
        expectedValue === null ||
        expectedValue === ""
      ) {
        continue;
      }

      switch (field) {
        case "minBudget": {
          const budget = Number(leadData.budget);

          if (Number.isNaN(budget) || budget < Number(expectedValue)) {
            return false;
          }

          break;
        }

        case "maxBudget": {
          const budget = Number(leadData.budget);

          if (Number.isNaN(budget) || budget > Number(expectedValue)) {
            return false;
          }

          break;
        }

        default: {
          const actualValue = String(leadData[field] ?? "")
            .trim()
            .toLowerCase();

          const requiredValue = String(expectedValue).trim().toLowerCase();

          if (actualValue !== requiredValue) {
            return false;
          }
        }
      }
    }

    return true;
  }
}

export default new RuleEngine();
