// server.js
// Main Express server - CommonJS format
require("dotenv").config(); // Load .env if it exists (won't crash if missing)

const express = require("express");
const cors = require("cors");
const advisoryRoutes = require("./routes/advisory");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================
// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

// ==================== Logging Middleware ====================
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==================== Routes ====================
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Farm Advisory Backend is running",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
        hasApiKey: !!process.env.OPENAI_API_KEY,
    });
});

// Advisory routes
app.use("/api/advice", advisoryRoutes);

// ==================== Error Handling ====================
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        path: req.path,
        method: req.method,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("[Global Error Handler]", err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

// ==================== Server Startup ====================
app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("Farm Advisory Backend");
    console.log("=".repeat(50));
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
        `✓ OpenAI API Key: ${process.env.OPENAI_API_KEY ? "Configured ✓" : "Not configured (using fallback)"}`
    );
    console.log("\n📍 Available endpoints:");
    console.log(`  GET  /health               - Server health check`);
    console.log(`  POST /api/advice           - Get farm advisory`);
    console.log(`  GET  /api/advice/health    - Advisory service health`);
    console.log("\n💡 Test the API with:");
    console.log(
        `  curl -X POST http://localhost:${PORT}/api/advice \\`
    );
    console.log(
        `    -H "Content-Type: application/json" \\`
    );
    console.log(`    -d '{"query":"How to improve crop yield?"}'`);
    console.log("=".repeat(50) + "\n");
});

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\n[Server] Received SIGINT, shutting down gracefully...");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n[Server] Received SIGTERM, shutting down gracefully...");
    process.exit(0);
});

module.exports = app;