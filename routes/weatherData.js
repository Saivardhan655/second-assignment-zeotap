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

// Get weather data for today, yesterday, or the day before yesterday for a specific city
router.get('/weather/daily', async (req, res) => {
  const city = req.query.city; // Get city from query parameters
  const day = req.query.date;  // Get date filter from query parameters (today, yesterday, etc.)

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }
  
  if (!day || !['today', 'yesterday', 'dayBeforeYesterday'].includes(day)) {
    return res.status(400).json({ error: 'Valid date parameter is required (today, yesterday, dayBeforeYesterday)' });
  }

  // Determine the selected date based on the day parameter
  let selectedDate;
  if (day === 'today') {
    selectedDate = formatDate(new Date());
  } else if (day === 'yesterday') {
    selectedDate = formatDate(new Date(Date.now() - 86400000)); // 24 hours in milliseconds
  } else if (day === 'dayBeforeYesterday') {
    selectedDate = formatDate(new Date(Date.now() - 2 * 86400000)); // 48 hours in milliseconds
  }

  try {
    const query = `
    SELECT 
      date_trunc('hour', timestamp) as hour,  -- Truncate timestamp to the hour
      AVG(temp) as avg_temp,                  -- Calculate average temperature
      AVG(feels_like) as avg_feels_like,      -- Calculate average feels-like temperature
      COUNT(*) as count,                      -- Optional: count of data points in the hour
      MAX(condition) as condition             -- Assume latest condition is the most relevant
    FROM weather_data
    WHERE timestamp::date = $1 AND city = $2
    GROUP BY date_trunc('hour', timestamp)
    ORDER BY hour;
  `;
    const result = await pool.query(query, [selectedDate, city]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

module.exports = router;
