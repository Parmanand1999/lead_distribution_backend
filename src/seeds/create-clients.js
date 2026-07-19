import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/database.js";
import Client from "../models/Client.js";
import Rule from "../models/Rule.js";

dotenv.config();

async function seedDummyData() {
  try {
    console.log("🌱 Seeding dummy data...");

    // Clear existing data
    await Rule.deleteMany({});
    await Client.deleteMany({});

    console.log("🗑️ Old data removed");

    // ==========================
    // Create Clients
    // ==========================

    const clientA = await Client.create({
      name: "Client A",
      company: "ABC Realty",
      isActive: true,
    });

    const clientB = await Client.create({
      name: "Client B",
      company: "XYZ Realty",
      isActive: true,
    });

    const clientC = await Client.create({
      name: "Client C",
      company: "PQR Properties",
      isActive: true,
    });

    console.log("✅ Clients Created");

    // ==========================
    // Create Rules
    // ==========================

    await Rule.insertMany([
      {
        name: "Residential 2BHK Delhi",

        clientId: clientA._id,

        conditions: {
          property: "Residential",
          configuration: "2 BHK",
          city: "Delhi",

          minBudget: 300000,
          maxBudget: 600000,
        },

        priority: 1,
        isActive: true,
      },

      {
        name: "Commercial Office Noida",

        clientId: clientB._id,

        conditions: {
          property: "Commercial",
          configuration: "Office",
          city: "Noida",

          minBudget: 800000,
          maxBudget: 1500000,
        },

        priority: 2,
        isActive: true,
      },

      {
        name: "Residential 3BHK Gurgaon",

        clientId: clientC._id,

        conditions: {
          property: "Residential",
          configuration: "3 BHK",
          city: "Gurgaon",

          minBudget: 600000,
          maxBudget: 1000000,
        },

        priority: 3,
        isActive: true,
      },

      // Default Rule (Fallback)
      {
        name: "Default Rule",

        clientId: clientA._id,

        conditions: {},

        priority: 999,

        isActive: true,
      },
    ]);

    console.log("✅ Rules Created");
    console.log("🎉 Dummy data seeded successfully");
  } catch (error) {
    console.error("❌ Seed Error:", error);
  }
}

(async () => {
  try {
    await connectDB();

    await seedDummyData();

    await mongoose.connection.close();

    console.log("🔌 Database Closed");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
})();
