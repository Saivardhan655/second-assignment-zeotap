const axios = require('axios');
const weatherService = require('./weatherService');
const cron = require('node-cron');
const {checkWeatherConditions}=require('../controllers/alertsLogic')
const {storeAlertData} = require('./weatherSummaryService')

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const cities = ['Hyderabad', 'Delhi', 'Bengaluru', 'Chennai', 'Mumbai', 'Kolkata'];

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
                timestamp: response.data.dt,
                max_temp: response.data.main.temp_max, // Added max_temp
                dominant_condition: response.data.weather[0].main // Added dominant condition
            };
        } else {
            console.error(`Failed to fetch data for ${city}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
    }

    return null;
};

// Function to update weather data and check alerts
const updateWeatherData = async () => {
    for (const city of cities) {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            // Store weather data in the database
            await weatherService.storeWeatherData(city, weatherData);
            
            const alerts = await checkWeatherConditions(city, weatherData);
            console.log("Alerts:", alerts);
            console.log(`Alerts length === ${alerts.length}`);
            
            if (alerts.length > 0) {
                console.log(`Alerts triggered for ${city}:`, alerts);
                await storeAlertData(alerts);
            }
        }
    }
};

// Fetch weather data every 5 minutes
cron.schedule('*/5 * * * *', updateWeatherData);

module.exports = updateWeatherData;
