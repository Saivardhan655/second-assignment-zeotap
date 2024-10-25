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


exports.storeAlertData = async (alerts) => {
    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
        console.log('\x1b[31mNo alerts to store.\x1b[0m');
        return; // Exit if there are no alerts
    }
    
    for (const alert of alerts) {
        const { city, alert_type, description, severity } = alert;
        
        const issuedAt = new Date();
        const expiresAt = new Date(issuedAt.getTime() + 2 * 60 * 60 * 1000);

        console.log('Alert Data:', {
            city,
            alert_type,
            description,
            severity,
            issuedAt: issuedAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
        });

        const insertQuery = `
            INSERT INTO weather_alerts (city, alert_type, description, severity, issued_at, expires_at) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [city, alert_type, description, severity, issuedAt, expiresAt];

        try {
            const result = await db.query(insertQuery, values);
            console.log('\x1b[32mAlert inserted:\x1b[0m', result.rows[0]);

        } catch (err) {
            console.error('Error inserting alert:', err);
        }
    }
};

