const { Kafka } = require('kafkajs');
const monthlyWeatherSummaryService = require('../services/monthlyWeatherSummaryService');

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

            if (data.action === 'updateMonthly') {
                console.log(`Generating monthly summary for ${data.city}`);
                await monthlyWeatherSummaryService.storeMonthlyWeatherSummary(data.city);
            }
        },
    });
};

run().catch(console.error);
