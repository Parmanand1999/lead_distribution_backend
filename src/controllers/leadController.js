import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import distributionService from "../services/distributionService.js";

// Receive & Process Lead
export const handleLead = async (req, res) => {
  try {
    const { source, data } = req.body;

    if (!source || typeof source !== "string") {
      return res.status(400).json({
        success: false,
        message: "Source is required",
      });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        success: false,
        message: "Data must be an object",
      });
    }

    const result = await distributionService.processLead(source, data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Handle Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Leads
export const getLeads = async (req, res) => {
  try {
    const {
      source,
      status,
      clientId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (source) filter.source = source;

    if (status) filter.status = status;

    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      filter.assignedTo = clientId;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};

      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }

      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name company")
      .populate("rule", "name priority")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const total = await Lead.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get Leads Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Lead By Id
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead id",
      });
    }

    const lead = await Lead.findById(id)
      .populate("assignedTo", "name company")
      .populate("rule", "name priority")
      .lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Get Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
