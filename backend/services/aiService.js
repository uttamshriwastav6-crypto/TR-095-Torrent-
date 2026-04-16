// services/aiService.js
// Correct CommonJS import for OpenAI v4+
const OpenAI = require("openai");

/**
 * Get farm advisory from OpenAI API
 * Falls back to mock response if API key is missing
 */
async function getFarmAdvice(query) {
  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback logic: if no API key, return mock response
  if (!apiKey) {
    console.warn(
      "[aiService] No OPENAI_API_KEY found. Using fallback mock response."
    );
    return getFallbackAdvice(query);
  }

  try {
    // Initialize OpenAI client (correct syntax for v4+)
    const client = new OpenAI({
      apiKey: apiKey,
    });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert farm advisor. Provide concise, practical advice for farmers.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 500,
    });

    // Extract text from response
    const advice = response.choices[0].message.content;
    return {
      success: true,
      source: "openai",
      advice: advice,
    };
  } catch (error) {
    console.error("[aiService] OpenAI API error:", error.message);

    // Fallback to mock response on API error
    return {
      success: false,
      source: "fallback",
      advice: getFallbackAdvice(query).advice,
      error: error.message,
    };
  }
}

/**
 * Fallback advice when API is unavailable
 */
function getFallbackAdvice(query) {
  const fallbackResponses = {
    crop: "For optimal crop yield: ensure proper soil pH (6.0-7.0), maintain consistent watering schedule, and apply balanced fertilizer (NPK 10-10-10) monthly.",
    pest:
      "For pest management: identify the pest species first, use neem oil spray for organic control, or consult local agricultural extension office for pesticides.",
    water: "For irrigation: water during early morning or evening to reduce evaporation. Use drip irrigation for 30-40% water savings. Monitor soil moisture daily.",
    soil: "For soil health: conduct soil testing annually, add organic matter (compost), practice crop rotation, and avoid monoculture.",
    default:
      "Farm advice: Keep detailed records, practice crop rotation, maintain soil health with organic matter, use drip irrigation, and consult local agricultural extension services for region-specific guidance.",
  };

  const queryLower = query.toLowerCase();
  let response = fallbackResponses.default;

  for (const [key, value] of Object.entries(fallbackResponses)) {
    if (queryLower.includes(key)) {
      response = value;
      break;
    }
  }

  return {
    success: true,
    source: "fallback",
    advice: response,
  };
}

module.exports = {
  getFarmAdvice,
};