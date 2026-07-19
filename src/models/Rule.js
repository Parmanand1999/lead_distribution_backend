import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    // Rule Name
    name: {
      type: String,
      required: [true, "Rule name is required"],
      trim: true,
      maxlength: [100, "Rule name cannot exceed 100 characters"],
    },

    // Assigned Client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },

    /**
     * Dynamic Conditions
     *
     * Example:
     * {
     *   property: "Residential",
     *   configuration: "2 BHK",
     *   city: "Delhi",
     *   source: "facebook",
     *   minBudget: 500000,
     *   maxBudget: 1000000
     * }
     */
    conditions: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Lower number = Higher priority
    priority: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Enable / Disable Rule
    isActive: {
      type: Boolean,
      default: true,
    },

    // Analytics
    leadsAssigned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
ruleSchema.index({ clientId: 1 });
ruleSchema.index({ isActive: 1 });
ruleSchema.index({ priority: 1 });
ruleSchema.index({ priority: 1, isActive: 1 });

const Rule = mongoose.model("Rule", ruleSchema);

export default Rule;
