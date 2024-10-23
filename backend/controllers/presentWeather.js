const axios = require('axios');
const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Controller to get the present weather data for a city
exports.getPresentWeather = async (req, res) => {
    const city = req.params.city;
    console.log(API_KEY)
    try {
        // Fetch weather data from OpenWeatherMap API
        const response = await axios.get(API_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        if (response.status === 200) {
            const weatherData = response.data;

            const formattedWeatherData = {
                city: weatherData.name,
                temp: weatherData.main.temp,
                feels_like: weatherData.main.feels_like,
                condition: weatherData.weather[0].description,
                timestamp: new Date(weatherData.dt * 1000).toString() // Convert to milliseconds and format the date
            };

            // Output the weather data
            console.log(formattedWeatherData);

            return res.json(formattedWeatherData); // Send weather data to the frontend
        } else {
            return res.status(response.status).json({ message: `Failed to fetch weather data for ${city}` });
        }
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return res.status(500).json({ message: `Error fetching weather data for ${city}`, error: error.message });
    }
};
