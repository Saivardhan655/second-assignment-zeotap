const axios = require('axios');
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
const checkWeatherConditions = require('./alertsLogic'); // Import the checkWeatherConditions function


// Controller to get the present weather data for a city
exports.getPresentWeather = async (req, res) => {
    const city = req.params.city;
    // console.log(API_KEY);
    try {
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
                max_temp: weatherData.main.temp, // Assuming this is the maximum temperature
                dominant_condition: weatherData.weather[0].main.toLowerCase(), // Use main condition for alerts
                feels_like: weatherData.main.feels_like,
                condition: weatherData.weather[0].description,
                timestamp: new Date(weatherData.dt * 1000).toString()
            };

            // Output the weather data
            console.log(formattedWeatherData);

            // Check weather conditions and trigger alerts
            //const alertsToSave = await checkWeatherConditions({ ...formattedWeatherData });

            // If alerts were triggered, insert them into the database
            // for (const alert of alertsToSave) {
            //     await insertAlert(alert);
            // }

            return res.json(formattedWeatherData); // Send weather data to the frontend
        } else {
            return res.status(response.status).json({ message: `Failed to fetch weather data for ${city}` });
        }
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return res.status(500).json({ message: `Error fetching weather data for ${city}`, error: error.message });
    }
};
