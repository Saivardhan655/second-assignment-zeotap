const express = require('express');
const axios = require('axios');
const weatherService = require('./services/weatherService');
const router = express.Router();

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Route to fetch and store weather data for a specific city
router.post('/weather/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const response = await axios.get(API_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        if (response.status === 200) {
            const weatherData = {
                temp: response.data.main.temp,
                feels_like: response.data.main.feels_like,
                condition: response.data.weather[0]?.description || 'No condition available',
                timestamp: response.data.dt
            };

            await weatherService.storeWeatherData(city, weatherData);
            res.status(200).json({ message: 'Weather data stored successfully' });
        } else {
            res.status(response.status).json({ message: `Failed to fetch weather data for ${city}` });
        }
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error.stack);
        res.status(500).json({ message: `Error fetching weather data for ${city}: ${error.message}` });
    }
});


module.exports = router;
