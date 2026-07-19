// backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import leadRoutes from "./routes/leadRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import ruleRoutes from "./routes/ruleRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Detailed logging in development
} else {
  app.use(morgan("combined")); // Standard logging in production
}

// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
