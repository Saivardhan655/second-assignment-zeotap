const db = require('../utils/database');

exports.saveWeatherData = async (city, weatherData) => {
    const { temp, feels_like, condition, timestamp } = weatherData;
    const query = `
        INSERT INTO weather_data (city, temp, feels_like, condition, timestamp)
        VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(query, [city, temp, feels_like, condition, timestamp]);
};

exports.getDailySummary = async () => {
    const query = `
        SELECT city, AVG(temp) as avg_temp, MAX(temp) as max_temp, MIN(temp) as min_temp
        FROM weather_data
        WHERE timestamp >= EXTRACT(EPOCH FROM now() - INTERVAL '1 day')
        GROUP BY city
    `;
    const result = await db.query(query);
    return result.rows;
};

exports.checkForAlerts = async (threshold) => {
    const query = `
        SELECT city, temp FROM weather_data WHERE temp > $1
        ORDER BY timestamp DESC
    `;
    const result = await db.query(query, [threshold]);
    return result.rows;
};
