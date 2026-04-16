const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');

// POST /api/get-advice
router.post('/get-advice', async (req, res) => {
    try {
        const { crop, stage, location } = req.body;

        // Validation (Handled by Agent 4 requirements here)
        if (!crop || !stage || !location) {
            return res.status(400).json({
                error: 'Validation Error: "crop", "stage", and "location" are required fields.'
            });
        }

        console.log(`Received request for Crop: ${crop}, Stage: ${stage}, Location: ${location}`);

        // Fetch Weather
        let weatherData;
        try {
            weatherData = await getWeather(location);
            console.log(`Weather data retrieved for ${location}:`, weatherData);
        } catch (weatherErr) {
            return res.status(404).json({
                error: 'Weather Service Error: ' + weatherErr.message
            });
        }

        // Call AI Service (Mocking this as requested: "handled by another teammate")
        // In a real scenario, you would pass `weatherData`, `crop`, and `stage` to your AI service.
        console.log('Sending data to AI Service...');
        const aiAdvice = `Ensure proper watering for ${crop} during the ${stage} stage. Weather is currently ${weatherData.description} with ${weatherData.temp}°C.`;
        const aiWeeklyPlan = [
            `Day 1: Water the ${crop} lightly.`,
            `Day 2: Monitor for pests specific to ${stage} stage.`,
            `Day 3: Check soil moisture.`,
            `Day 4: Apply necessary nutrients.`,
            `Day 5: Observe growth indicators.`,
            `Day 6: Prepare for next stage transition.`,
            `Day 7: Record progress.`
        ];
        const aiAlerts = [
            weatherData.temp > 35 ? "High temperature alert: increase irrigation." : "Normal temperature."
        ];

        // Return final JSON
        const responseData = {
            advice: aiAdvice,
            weekly_plan: aiWeeklyPlan,
            alerts: aiAlerts,
            weatherContext: weatherData // optionally sending it back
        };

        return res.status(200).json(responseData);

    } catch (err) {
        console.error('API /get-advice Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
