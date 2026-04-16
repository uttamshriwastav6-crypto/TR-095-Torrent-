const axios = require('axios');

/**
 * Retrieves weather data for a given location.
 * @param {string} location - The city or location name.
 * @returns {object} Object containing temp, humidity, and description.
 */
const getWeather = async (location) => {
    try {
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey || apiKey === 'your_openweather_key') {
            console.warn('Weather API Key is missing or default. Returning mock data.');
            return {
                temp: 30, // Mock temperature
                humidity: 60, // Mock humidity
                description: 'clear sky' // Mock description
            };
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);

        return {
            temp: response.data.main.temp,
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description
        };
    } catch (error) {
        console.error('Error fetching weather:', error.response?.data?.message || error.message);
        throw new Error('Failed to fetch weather data for the specified location.');
    }
};

module.exports = {
    getWeather
};
