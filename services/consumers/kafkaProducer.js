// kafkaProducer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'weather-scheduler',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']  // Kafka broker address
});

const producer = kafka.producer();

const runProducer = async () => {
    await producer.connect();

    // Send a message to the 'weather-fetch' topic every 5 minutes
    setInterval(async () => {
        await producer.send({
            topic: 'weather-fetch',
            messages: [
                { value: JSON.stringify({ action: 'fetchWeatherData' }) }
            ],
        });
        console.log('Weather data fetch request sent to Kafka.');
    }, 5 * 60 * 1000);  // Every 5 minutes
};

runProducer().catch(console.error);
