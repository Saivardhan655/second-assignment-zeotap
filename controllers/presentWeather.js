const axios = require('axios');

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Controller to get the present weather data for a city
exports.getPresentWeather = async (req, res) => {
    const city = req.params.city;

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
            const weatherData = {
                city: "Hyderabad",
                temp: 22.73,
                feels_like: 23.51,
                condition: "broken clouds",
                timestamp: new Date(1729625061 * 1000).toString() // Convert to milliseconds and then create Date
            };
            
            // Output the weatherData
            console.log(weatherData);
            

            return res.json(weatherData);  // Send weather data to the frontend
        } else {
            return res.status(response.status).json({ message: `Failed to fetch weather data for ${city}` });
        }
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return res.status(500).json({ message: `Error fetching weather data for ${city}`, error: error.message });
    }
};
