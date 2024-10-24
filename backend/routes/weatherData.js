const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Assuming you already have a Pool instance available here
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Helper function to format the date
const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
};

// Get weather data for today, yesterday, or last week for a specific city
router.get('/weather/daily', async (req, res) => {
  const city = req.query.city; // Get city from query parameters
  const day = req.query.date;  // Get date filter from query parameters (today, yesterday, etc.)

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  let startDate, endDate;

  // Determine the selected date range based on the `day` parameter
  if (day === 'today') {
    startDate = formatDate(new Date());
    endDate = startDate;
  } else if (day === 'yesterday') {
    startDate = formatDate(new Date(Date.now() - 86400000)); // 24 hours in milliseconds
    endDate = startDate;
  } else if (day === 'dayBeforeYesterday') {
    startDate = formatDate(new Date(Date.now() - 2 * 86400000)); // 48 hours in milliseconds
    endDate = startDate;
  } else if (day === 'lastweek') {
    endDate = formatDate(new Date()); // Today's date
    startDate = formatDate(new Date(Date.now() - 7 * 86400000)); // 7 days ago
  } else {
    return res.status(400).json({ error: 'Valid date parameter is required (today, yesterday, dayBeforeYesterday, lastweek)' });
  }

  try {
    const query = `
      SELECT 
        date_trunc('day', timestamp) as day,  -- Group by day for last week or specific day
        AVG(temp) as avg_temp,                -- Calculate average temperature
        AVG(feels_like) as avg_feels_like,    -- Calculate average feels-like temperature
        MAX(temp) as max_temp,                -- Maximum temperature of the day
        MIN(temp) as min_temp,                -- Minimum temperature of the day
        MAX(condition) as condition           -- Assume latest condition is the most relevant
      FROM weather_data
      WHERE timestamp::date BETWEEN $1 AND $2 AND city = $3
      GROUP BY day
      ORDER BY day;
    `;
    
    const result = await pool.query(query, [startDate, endDate, city]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

module.exports = router;
