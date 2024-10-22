const { Kafka } = require('kafkajs');
const weeklyWeatherSummaryService = require('../services/weeklyWeatherSummaryService');

const kafka = new Kafka({
    clientId: 'weather-app',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'weather-summary-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'weather-summary', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value.toString());

            if (data.action === 'updateWeekly') {
                console.log(`Generating weekly summary for ${data.city}`);
                await weeklyWeatherSummaryService.storeWeeklyWeatherSummary(data.city);
            }
        },
    });
};

run().catch(console.error);
