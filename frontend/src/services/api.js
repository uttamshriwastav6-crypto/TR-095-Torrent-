import { GoogleGenerativeAI } from "@google/generative-ai";

const fetchWeather = async (location) => {
  // Simple mock weather fetcher
  return {
    temperature: "34°C",
    condition: "Sunny",
    rain: "No rain expected for 3 days",
    irrigate: "High evaporation, water today",
    fertilizer: "Good time for nitrogen",
    pest: "Low risk"
  };
};

export const generateFarmAdvice = async ({ crop, ph, duration, location, language }) => {
  try {
    const weather = await fetchWeather(location);
    const apiKey = import.meta.env.VITE_APP_API_KEY;

    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const prompt = `You are a specialist farm advisor. 
    User is growing ${crop} with soil pH of ${ph} in ${location} for ${duration} days.
    Current Weather: ${weather.temperature}, ${weather.condition}.
    Language: ${language === 'hi' ? 'Hindi' : (language === 'ta' ? 'Tamil' : 'English')}.

    Return a JSON object:
    {
      "daily_guidance": "short summary sentence",
      "overview": {
        "rain": "status",
        "irrigate": "action",
        "fertilizer": "advice",
        "pest": "risk level"
      },
      "weekly_plan": [
        {"day": "Day 1", "task": "...", "details": "..."},
        ... 10 entries ...
      ],
      "notifications": [
        {"id": 1, "type": "info", "title": "Weather", "message": "...", "date": "Today"},
        ...
      ]
    }`;

    let text = "";
    if (apiKey.startsWith('sk-')) {
       // OpenAI Fallback logic
       const res = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
         body: JSON.stringify({
           model: 'gpt-4o-mini',
           messages: [{ role: 'system', content: prompt }]
         })
       });
       const data = await res.json();
       text = data.choices[0].message.content;
    } else {
       // Gemini primary
       const genAI = new GoogleGenerativeAI(apiKey);
       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
       const result = await model.generateContent(prompt);
       text = result.response.text();
    }

    // Clean text if it contains markdown blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedText);

    return {
      ...parsedData,
      crop,
      ph,
      location,
      weather
    };

  } catch (error) {
    console.error("API Error:", error);
    // Return fallback mock data
    return {
      daily_guidance: "Maintain crop health with regular monitoring.",
      overview: { rain: "Clear sky", irrigate: "Standard", fertilizer: "Not needed", pest: "None" },
      weekly_plan: Array.from({length: 10}).map((_, i) => ({ day: `Day ${i+1}`, task: "Monitor crop", details: "Look for signs of stress." })),
      notifications: [{ id: 1, type: "info", title: "Welcome", message: "Your setup is complete.", date: "Today" }],
      crop, ph, location, weather: { temperature: "28°C", condition: "Good" }
    };
  }
};

export const chatWithAI = async ({ message, history, contextData, language }) => {
  try {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    if (!apiKey) return "API Key not configured.";

    const systemPrompt = `You are an expert farm advisor chatbot for a mobile app. 
Context: ${contextData.crop}, pH: ${contextData.ph}, Weather: ${contextData.weather?.temperature}, ${contextData.weather?.condition}. Language: ${language === 'hi' ? 'Hindi' : (language === 'ta' ? 'Tamil' : 'English')}.
CRITICAL INSTRUCTIONS:
1. NEVER write long essays. 
2. Keep your response to a maximum of 3 short sentences.
3. Be direct, actionable, and conversational.
4. Do NOT use markdown formatting. Use simple text with line breaks.
5. Format your response into small, readable paragraphs.`;

    const tryOpenAI = async () => {
       const mappedHistory = history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
       }));
       const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'system', content: systemPrompt }, ...mappedHistory, { role: 'user', content: message }]
          })
       });
       if (!res.ok) throw new Error("OpenAI request failed");
       const data = await res.json();
       return data.choices[0].message.content;
    };

    const tryGemini = async () => {
       const genAI = new GoogleGenerativeAI(apiKey);
       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
       const formattedHistory = history.map(msg => ({
         role: msg.role === 'user' ? 'user' : 'model',
         parts: [{ text: msg.text }]
       }));
       const chat = model.startChat({
         history: [
           { role: "user", parts: [{ text: systemPrompt }] },
           { role: "model", parts: [{ text: "Understood." }] },
           ...formattedHistory
         ]
       });
       const result = await chat.sendMessage(message);
       return result.response.text();
    };

    if (apiKey.startsWith('sk-')) {
       return await tryOpenAI();
    } else {
       try {
           return await tryGemini();
       } catch(err) {
           console.warn("Gemini attempt failed, trying OpenAI fallback...", err);
           try {
             return await tryOpenAI();
           } catch(openAIError) {
             return "The AI engine is currently experiencing high demand. Please try again soon.";
           }
       }
    }
  } catch (error) {
    console.error("Chat AI Error:", error);
    return "The AI engine is currently status: unavailable. Please try again in 30 seconds.";
  }
};
