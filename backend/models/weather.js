const db = require('../utils/database');

exports.saveWeatherData = async (city, weatherData) => {
    const { temp, feels_like, condition, timestamp } = weatherData;
    const query = `
        INSERT INTO weather_data (city, temp, feels_like, condition, timestamp)
        VALUES ($1, $2, $3, $4, $5)
    `;

    try {
        await db.query(query, [city, temp, feels_like, condition, timestamp]);
        console.log(`Weather data for ${city} saved successfully.`);
    } catch (err) {
        console.error('Error saving weather data:', err);
    }
};

exports.getDailySummary = async () => {
    const query = `
        SELECT city, AVG(temp) AS avg_temp, MAX(temp) AS max_temp, MIN(temp) AS min_temp
        FROM weather_data
        WHERE timestamp >= NOW() - INTERVAL '1 day'
        GROUP BY city
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error fetching daily summary:', err);
        throw err; // Rethrow the error for further handling if needed
    }
};

exports.insertAlert = async (alert) => {
    const { city, alert_type, description, severity, durationInHours } = alert;

    // Calculate the issued_at and expires_at timestamps
    const issuedAt = new Date(); // Current time
    const expiresAt = new Date(issuedAt.getTime() + durationInHours * 60 * 60 * 1000); // Adding hours to the issued time

    const insertQuery = `
        INSERT INTO alerts (city, alert_type, description, severity, issued_at, expires_at) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [city, alert_type, description, severity, issuedAt, expiresAt];

    try {
        const result = await db.query(insertQuery, values);
        console.log('Alert inserted:', result.rows[0]);
    } catch (err) {
        console.error('Error inserting alert:', err);
    }
};
