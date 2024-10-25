const db = require('../utils/database');
const weatherSummaryService = require('./weatherSummaryService');
const nodemailer = require('nodemailer');
const { checkWeatherConditions } = require('../controllers/alertsLogic')

// Store user-configurable alert thresholds (e.g., temp > 35°C for 2 consecutive updates)
const alertConfig = {
    temperatureThreshold: 35, // degrees Celsius
    consecutiveUpdates: 2
};



// Function to store weather data in the database
exports.storeWeatherData = async (city, weatherData) => {
    const { temp, feels_like, condition, timestamp } = weatherData;
    console.log(`service: weatherService :  ${weatherData}`)
    
    const query = `
        INSERT INTO weather_data (city, temp, feels_like, condition, timestamp)
        VALUES ($1, $2, $3, $4, $5)
    `;

    try {
        // Insert data into the database
        await db.query(query, [city, temp, feels_like, condition, new Date(timestamp * 1000)]);
        console.log(`Weather data for ${city} inserted successfully.`);
        
        // Check if the threshold for temperature is breached
        await weatherSummaryService.storeDailyWeatherSummary();
        
        // Store daily summary
        const alert = checkWeatherConditions(city, weatherData);
        await weatherSummaryService.storeAlertData(alert);

    } catch (err) {
        console.error(`Error storing weather data for ${city}:`, err);
        throw err;
    }
};



// Function to trigger alert (can be expanded to send emails)
function triggerAlert(city, temp) {
    console.log(`ALERT: Temperature in ${city} has exceeded ${alertConfig.temperatureThreshold}°C for ${alertConfig.consecutiveUpdates} consecutive updates. Current temp: ${temp}°C`);

    // You can expand this to send an email alert
    sendEmailAlert(city, temp);
}

// Function to send email alert (optional)
async function sendEmailAlert(city, temp) {
    // Configure email transporter (using Gmail as an example)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'saivardhan9154@gmail.com',
        subject: `Weather Alert for ${city}`,
        text: `Temperature in ${city} has exceeded ${alertConfig.temperatureThreshold}°C for ${alertConfig.consecutiveUpdates} consecutive updates. Current temp: ${temp}°C`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email alert sent successfully.');
    } catch (error) {
        console.error('Error sending email alert:', error);
    }
}

// Function to get the daily summary of weather data for a specific city
exports.getDailySummary = async (city) => {
    const query = `
        SELECT
            city,
            AVG(temp) as avg_temp,
            MAX(temp) as max_temp,
            MIN(temp) as min_temp,
            (
                SELECT condition
                FROM weather_data
                WHERE city = $1
                AND timestamp >= NOW() - INTERVAL '1 day'
                GROUP BY condition
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) as dominant_condition
        FROM weather_data
        WHERE city = $1
        AND timestamp >= NOW() - INTERVAL '1 day'
        GROUP BY city
    `;

    try {
        const result = await db.query(query, [city]);

        if (result.rows.length === 0) {
            console.log(`No weather data found for ${city} in the past day.`);
            return null;
        }

        return result.rows[0];
    } catch (err) {
        console.error(`Error fetching daily summary for ${city}:`, err);
        throw err;
    }
};
