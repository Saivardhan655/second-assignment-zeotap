// kafkaConsumer.js
const { Kafka } = require('kafkajs');
const weatherService = require('./weatherService');

const kafka = new Kafka({
    clientId: 'weather-app',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']  // Kafka broker address
});
const consumer = kafka.consumer({ groupId: 'weather-group' });

const cities = ['Hyderabad', 'Delhi', 'Bengaluru', 'Chennai', 'Mumbai'];

// Function to fetch and update weather data
const updateWeatherData = async () => {
    for (const city of cities) {
        const weatherData = await weatherService.fetchWeatherData(city);
        if (weatherData) {
            await weatherService.storeWeatherData(city, weatherData);
        }
    }
};

// Run the Kafka consumer
const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'weather-fetch', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());

            if (data.action === 'fetchWeatherData') {
                console.log('Triggering weather data update for all cities.');
                await updateWeatherData();
            }
        },
    });
};

runConsumer().catch(console.error);
