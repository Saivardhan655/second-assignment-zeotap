const axios = require('axios');
const weatherService = require('./weatherService');

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cities = ['Hyderabad', 'Delhi', 'Bengaluru', 'Chennai', 'Mumbai'];

// Function to fetch weather data for a city
const fetchWeatherData = async (city) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        if (response.status === 200) {
            return {
                temp: response.data.main.temp,
                feels_like: response.data.main.feels_like,
                condition: response.data.weather[0].description,
                timestamp: response.data.dt
            };
        } else {
            console.error(`Failed to fetch data for ${city}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
    }

    return null;
};

const updateWeatherData = async () => {
    for (const city of cities) {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            await weatherService.storeWeatherData(city, weatherData);
        }
    }
};

// Fetch weather data every 5 minutes
setInterval(updateWeatherData, 5 * 60 * 1000);

module.exports = updateWeatherData;
