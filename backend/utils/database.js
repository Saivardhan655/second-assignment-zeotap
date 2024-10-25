const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Create weather_data table if it doesn't exist
const createWeatherDataTableQuery = `
CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    city TEXT,
    temp REAL,
    feels_like REAL,
    condition TEXT,
    timestamp TIMESTAMPTZ
)`;

// Create daily_weather_summary table if it doesn't exist
const createDailyWeatherSummaryTableQuery = `
CREATE TABLE IF NOT EXISTS daily_weather_summary (
    id SERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    date DATE NOT NULL,
    avg_temp REAL,
    max_temp REAL,
    min_temp REAL,
    dominant_condition TEXT,
    temp_threshold_breached BOOLEAN,
    alerts TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_city_date UNIQUE (city, date)

)`;

// Create alerts table if it doesn't exist
const createAlertsTableQuery = `
CREATE TABLE IF NOT EXISTS weather_alerts (
    id SERIAL PRIMARY KEY,
    city TEXT,
    alert_type TEXT,
    description TEXT,
    severity TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
)`;

// Function to create tables
const createTables = async () => {
    try {
        // Create weather_data table
        await pool.query(createWeatherDataTableQuery);
        console.log('weather_data table created or already exists.');

        // Create daily_weather_summary table
        await pool.query(createDailyWeatherSummaryTableQuery);
        console.log('daily_weather_summary table created or already exists.');

        // Create alerts table
        await pool.query(createAlertsTableQuery);
        console.log('alerts table created or already exists.');

    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

// Execute table creation
createTables();

// Export query function for use in other parts of the application
module.exports = {
    query: (text, params) => pool.query(text, params),
    createTables,
    pool,
};
