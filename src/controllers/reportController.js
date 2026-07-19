import Lead from "../models/Lead.js";

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Summary
    const [summary] = await Lead.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },

          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },

          assigned: {
            $sum: {
              $cond: [{ $eq: ["$status", "assigned"] }, 1, 0],
            },
          },

          processed: {
            $sum: {
              $cond: [{ $eq: ["$status", "processed"] }, 1, 0],
            },
          },

          rejected: {
            $sum: {
              $cond: [{ $eq: ["$status", "rejected"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = summary || {
      total: 0,
      pending: 0,
      assigned: 0,
      processed: 0,
      rejected: 0,
    };

    // Source Distribution
    const sourceDistribution = await Lead.aggregate([
      {
        $group: {
          _id: "$source",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // Client Distribution
    const clientDistribution = await Lead.aggregate([
      {
        $match: {
          assignedTo: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "_id",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },
      {
        $project: {
          _id: 0,
          clientId: "$client._id",
          name: "$client.name",
          company: "$client.company",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // Recent Leads
    const recentLeads = await Lead.find()
      .populate("assignedTo", "name company")
      .populate("rule", "name")
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        summary: stats,
        sourceDistribution,
        clientDistribution,
        recentLeads,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
