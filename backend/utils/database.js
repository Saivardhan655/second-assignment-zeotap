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
const createTableQuery = `
CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    city TEXT,
    temp REAL,
    feels_like REAL,
    condition TEXT,
    timestamp TIMESTAMPTZ
)`;


pool.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating weather_data table:', err);
    } else {
        console.log('weather_data table created or already exists.');
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
