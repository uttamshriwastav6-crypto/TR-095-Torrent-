// =============================================
//  GreenHand AI — Advisory API Route
// =============================================

import express from "express";
import { generateFarmAdvice } from "../services/aiService.js";

const router = express.Router();

router.post("/advice", async (req, res) => {
  try {
    const { crop, stage, weather } = req.body;

    if (!crop || typeof crop !== "string" || !crop.trim()) {
      return res.status(400).json({
        error: "Crop is required."
      });
    }

    if (!stage || typeof stage !== "string" || !stage.trim()) {
      return res.status(400).json({
        error: "Stage is required."
      });
    }

    if (!weather || typeof weather !== "object") {
      return res.status(400).json({
        error: "Weather object is required."
      });
    }

    if (
      weather.temperature === undefined ||
      weather.humidity === undefined
    ) {
      return res.status(400).json({
        error: "Weather must include temperature and humidity."
      });
    }

    const normalizedWeather = {
      temperature: Number(weather.temperature),
      humidity: Number(weather.humidity),
      description: typeof weather.description === "string"
        ? weather.description.trim()
        : "Not specified"
    };

    if (Number.isNaN(normalizedWeather.temperature) || Number.isNaN(normalizedWeather.humidity)) {
      return res.status(400).json({
        error: "Temperature and humidity must be valid numbers."
      });
    }

    const result = await generateFarmAdvice(
      crop.trim(),
      stage.trim(),
      normalizedWeather
    );

    return res.json(result);
  } catch (err) {
    console.error("[/api/advice Error]", err.message);
    return res.status(500).json({
      error: "Something went wrong on the server. Please try again."
    });
  }
});

export default router;