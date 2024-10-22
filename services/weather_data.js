const axios = require('axios');
const { Kafka } = require('kafkajs');
const weatherService = require('./weatherService');

// Kafka setup
const kafka = new Kafka({
    clientId: 'weather-app',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']  // Kafka broker address
});

const producer = kafka.producer(); // Producer instance to send messages

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

// Function to update weather data and send Kafka messages
const updateWeatherData = async () => {
    await producer.connect(); // Connect the Kafka producer

    for (const city of cities) {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            // Store weather data in DB and update summaries
            await weatherService.storeWeatherData(city, weatherData);
            
            // Send Kafka message with the fetched weather data
            await producer.send({
                topic: 'weather-data',
                messages: [
                    { value: JSON.stringify({ city, weatherData }) }
                ],
            });

            console.log(`Weather data for ${city} sent to Kafka topic 'weather-data'.`);
        }
    }

    await producer.disconnect(); // Disconnect after sending messages
};

// Schedule the weather data fetch and Kafka message sending every 5 minutes
setInterval(updateWeatherData, 5 * 60 * 1000);

module.exports = updateWeatherData;
