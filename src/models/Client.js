import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    // Client Name
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },

    // Company Name
    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    // Client Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Statistics
    totalLeadsReceived: {
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

clientSchema.index({ name: 1 }, { unique: true });
clientSchema.index({ isActive: 1 });

const Client = mongoose.model("Client", clientSchema);

export default Client;
