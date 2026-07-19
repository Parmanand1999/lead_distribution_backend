import mongoose from "mongoose";
import Rule from "../models/Rule.js";
import Client from "../models/Client.js";

// Get All Rules
export const getRules = async (req, res) => {
  try {
    const rules = await Rule.find()
      .populate("clientId", "name company")
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: rules,
    });
  } catch (error) {
    console.error("Get Rules Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Rule By Id
export const getRuleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rule id",
      });
    }

    const rule = await Rule.findById(id)
      .populate("clientId", "name company")
      .lean();

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    console.error("Get Rule Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create Rule
export const createRule = async (req, res) => {
  try {
    const { name, clientId, conditions, priority, isActive } = req.body;

    if (!name || !clientId) {
      return res.status(400).json({
        success: false,
        message: "Name and Client are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client id",
      });
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const rule = await Rule.create({
      name,
      clientId,
      conditions,
      priority,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Rule created successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Create Rule Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Rule already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Rule
export const updateRule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rule id",
      });
    }

    if (req.body.clientId) {
      if (!mongoose.Types.ObjectId.isValid(req.body.clientId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid client id",
        });
      }

      const client = await Client.findById(req.body.clientId);

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    const rule = await Rule.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("clientId", "name company");

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rule updated successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Update Rule Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Rule already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Rule
export const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rule id",
      });
    }

    const rule = await Rule.findByIdAndDelete(id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rule deleted successfully",
    });
  } catch (error) {
    console.error("Delete Rule Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
