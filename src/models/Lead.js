import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
      enum: ["facebook", "google", "instagram", "website", "excel", "other"],
    },

    // Original payload received from webhook/API
    rawData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Standardized lead after mapping
    mappedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Assigned Client
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },

    // Rule used for assignment
    rule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rule",
      default: null,
    },

    // Lead Status
    status: {
      type: String,
      enum: ["pending", "assigned", "processed", "rejected"],
      default: "pending",
    },

    // Processing Remarks
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

leadSchema.index({ source: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ rule: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
