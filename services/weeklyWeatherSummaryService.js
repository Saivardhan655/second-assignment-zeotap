const db = require('../utils/database');

exports.storeWeeklyWeatherSummary = async (city) => {
    const query = `
        INSERT INTO weekly_weather_summary (city, week_start_date, avg_temp, max_temp, min_temp, dominant_condition)
        SELECT
            city,
            DATE_TRUNC('week', timestamp) AS week_start_date,
            AVG(temp) AS avg_temp,
            MAX(temp) AS max_temp,
            MIN(temp) AS min_temp,
            (
                SELECT condition
                FROM weather_data
                WHERE city = wd.city
                AND DATE_TRUNC('week', timestamp) = DATE_TRUNC('week', CURRENT_DATE)
                GROUP BY condition
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) AS dominant_condition
        FROM weather_data wd
        WHERE city = $1
        AND DATE_TRUNC('week', timestamp) = DATE_TRUNC('week', CURRENT_DATE)
        GROUP BY city, DATE_TRUNC('week', timestamp)
        ON CONFLICT (city, week_start_date) DO UPDATE SET
            avg_temp = EXCLUDED.avg_temp,
            max_temp = EXCLUDED.max_temp,
            min_temp = EXCLUDED.min_temp,
            dominant_condition = EXCLUDED.dominant_condition;
    `;

    try {
        await db.query('BEGIN');
        await db.query(query, [city]);
        await db.query('COMMIT');
        console.log(`Weekly weather summary updated for ${city}`);
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(`Error storing weekly summary for ${city}:`, err);
        throw err;
    }
};