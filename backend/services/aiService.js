// =============================================
//  GreenHand AI — AI Service
// =============================================

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(crop, stage, weather) {
  return `
You are an agricultural expert AI helping small-scale farmers.

Your job is to provide simple, practical, and actionable farming advice.

INPUT:
- Crop: ${crop}
- Growth Stage: ${stage}
- Weather:
  - Temperature: ${weather.temperature}°C
  - Humidity: ${weather.humidity}%
  - Condition: ${weather.description || "Not specified"}

INSTRUCTIONS:
1. Use very simple language.
2. Avoid technical jargon.
3. Keep advice short and actionable.
4. Provide a weekly plan with exactly 7 items.
5. Each weekly plan item must start with "Day 1:" to "Day 7:".
6. Alerts should mention meaningful weather, pest, or disease risks.
7. Return only valid JSON.
8. Do not include markdown.
9. Do not include explanation outside JSON.

OUTPUT FORMAT:
{
  "advice": "string",
  "weekly_plan": [
    "Day 1: ...",
    "Day 2: ...",
    "Day 3: ...",
    "Day 4: ...",
    "Day 5: ...",
    "Day 6: ...",
    "Day 7: ..."
  ],
  "alerts": ["...", "..."]
}

STRICT RULES:
- weekly_plan must contain exactly 7 items
- no empty fields
- output must be valid parsable JSON
`.trim();
}

function getRuleBasedAlerts(weather) {
  const alerts = [];
  const temperature = Number(weather.temperature);
  const humidity = Number(weather.humidity);
  const description = (weather.description || "").toLowerCase();

  if (temperature >= 38) {
    alerts.push("🔥 Extreme heat warning: Water crops twice daily.");
  } else if (temperature >= 32) {
    alerts.push("☀️ High heat: Water early morning and evening.");
  }

  if (temperature <= 10) {
    alerts.push("❄️ Cold damage risk: Cover seedlings at night.");
  }

  if (humidity >= 85) {
    alerts.push("💧 Very high humidity: Watch for fungal diseases.");
  } else if (humidity >= 70) {
    alerts.push("🌫️ Moderate humidity: Check leaves for moisture spots.");
  }

  if (description.includes("rain") || description.includes("shower")) {
    alerts.push("🌧️ Rain expected: Check for waterlogging in your fields.");
  }

  if (description.includes("storm") || description.includes("thunder")) {
    alerts.push("⛈️ Storm risk: Secure plants and protect young crops.");
  }

  return alerts;
}

function extractJSON(text) {
  if (!text || typeof text !== "string") return null;

  try {
    return JSON.parse(text);
  } catch { }

  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch { }
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch { }
  }

  return null;
}

function validateAndFix(data) {
  if (!data || typeof data !== "object") return null;

  let advice = typeof data.advice === "string" ? data.advice.trim() : "";
  let weeklyPlan = Array.isArray(data.weekly_plan) ? data.weekly_plan : [];
  let alerts = Array.isArray(data.alerts) ? data.alerts : [];

  if (!advice) {
    advice = "Monitor your crop regularly and maintain proper watering.";
  }

  weeklyPlan = weeklyPlan
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  const fixedPlan = [];
  for (let i = 0; i < 7; i++) {
    const existing = weeklyPlan[i];
    if (existing) {
      fixedPlan.push(existing.startsWith(`Day ${i + 1}:`) ? existing : `Day ${i + 1}: ${existing}`);
    } else {
      fixedPlan.push(`Day ${i + 1}: Monitor crop health and check soil moisture.`);
    }
  }

  alerts = alerts
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return {
    advice,
    weekly_plan: fixedPlan,
    alerts,
  };
}

function getFallbackResponse(crop, stage, ruleAlerts) {
  return {
    advice: `Your ${crop} crop is in the ${stage} stage. Check it daily, water it properly, and watch for pests or disease signs.`,
    weekly_plan: [
      "Day 1: Water the crop and check soil moisture.",
      "Day 2: Inspect leaves for pests or yellow spots.",
      "Day 3: Remove weeds around the plants.",
      "Day 4: Check for fungus or leaf damage.",
      "Day 5: Water lightly and observe plant growth.",
      "Day 6: Inspect stems and leaves again.",
      "Day 7: Review overall crop health and plan next care steps."
    ],
    alerts: [
      "⚠️ AI service unavailable. Using safe fallback advice.",
      ...ruleAlerts
    ]
  };
}

export async function generateFarmAdvice(crop, stage, weather) {
  const ruleAlerts = getRuleBasedAlerts(weather);

  try {
    const prompt = buildPrompt(crop, stage, weather);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 900,
    });

    const rawText = response.choices?.[0]?.message?.content || "";
    let parsed = extractJSON(rawText);
    parsed = validateAndFix(parsed);

    if (!parsed) {
      return getFallbackResponse(crop, stage, ruleAlerts);
    }

    parsed.alerts = [...new Set([...parsed.alerts, ...ruleAlerts])];

    return parsed;
  } catch (err) {
    console.error("[aiService] OpenAI call failed:", err.message);
    return getFallbackResponse(crop, stage, ruleAlerts);
  }
}