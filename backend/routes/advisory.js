// routes/advisory.js
// Correct CommonJS syntax for route handler
const express = require("express");
const router = express.Router();
const { getFarmAdvice } = require("../services/aiService");

/**
 * POST /api/advice
 * Get farm advisory based on user query
 */
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    // Validate request
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Query is required and must be a non-empty string",
      });
    }

    // Get advice from service
    const result = await getFarmAdvice(query.trim());

    // Return response
    res.status(200).json({
      success: result.success,
      query: query,
      advice: result.advice,
      source: result.source,
      ...(result.error && { error: result.error }),
    });
  } catch (error) {
    console.error("[advisory route] Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * GET /api/advice/health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "farm-advisory",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;