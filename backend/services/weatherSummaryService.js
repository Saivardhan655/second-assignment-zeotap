const db = require('../utils/database');

exports.storeDailyWeatherSummary = async () => {
    const query = `
        INSERT INTO daily_weather_summary (city, date, avg_temp, max_temp, min_temp, dominant_condition)
        SELECT
            city,
            DATE_TRUNC('day', timestamp) AS date,
            AVG(temp) AS avg_temp,
            MAX(temp) AS max_temp,
            MIN(temp) AS min_temp,
            (
                SELECT condition
                FROM weather_data
                WHERE city = wd.city
                AND DATE_TRUNC('day', timestamp) = DATE_TRUNC('day', CURRENT_DATE - INTERVAL '1 day')
                GROUP BY condition
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) AS dominant_condition
        FROM
            weather_data wd
        WHERE
            DATE_TRUNC('day', timestamp) = CURRENT_DATE - INTERVAL '1 day'
        GROUP BY
            city, DATE_TRUNC('day', timestamp)
        ON CONFLICT (city, date) DO UPDATE SET
            avg_temp = EXCLUDED.avg_temp,
            max_temp = EXCLUDED.max_temp,
            min_temp = EXCLUDED.min_temp,
            dominant_condition = EXCLUDED.dominant_condition;
    `;

    try {
        await db.query('BEGIN');
        await db.query(query);
        await db.query('COMMIT');
        console.log('Daily weather summary updated successfully.');
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Error storing daily weather summary:', err);
        throw err;
    }
};

