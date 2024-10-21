const db = require('../utils/database');

// Function to store weather data in the database
exports.storeWeatherData = async (city, weatherData) => {
    const { temp, feels_like, condition, timestamp } = weatherData;
    
    const query = `
        INSERT INTO weather_data (city, temp, feels_like, condition, timestamp)
        VALUES ($1, $2, $3, $4, $5)
    `;

    try {
        // Insert data into the database
        await db.query(query, [city, temp, feels_like, condition, new Date(timestamp * 1000)]);
        console.log(`Weather data for ${city} inserted successfully.`);
    } catch (err) {
        console.error(`Error storing weather data for ${city}:`, err);
        throw err; 
    }
};

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
