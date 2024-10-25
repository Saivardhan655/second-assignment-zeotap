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

// Helper function to get date range for queries
const getDateRange = (day) => {
  const today = new Date();
  let startDate, endDate;

  switch (day) {
    case 'today':
      startDate = endDate = formatDate(today);
      break;
    case 'yesterday':
      startDate = endDate = formatDate(new Date(today - 86400000)); // 24 hours ago
      break;
    case 'dayBeforeYesterday':
      startDate = endDate = formatDate(new Date(today - 2 * 86400000)); // 48 hours ago
      break;
    case 'lastweek':
      endDate = formatDate(today); // Today's date
      startDate = formatDate(new Date(today - 7 * 86400000)); // 7 days ago
      break;
    default:
      return null; // Invalid day
  }
  return { startDate, endDate };
};

// Get weather data for today, yesterday, or last week for a specific city
router.get('/weather/daily', async (req, res) => {
  const city = req.query.city; // Get city from query parameters
  const day = req.query.date; // Get date filter from query parameters

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  const dateRange = getDateRange(day);
  if (!dateRange) {
    return res.status(400).json({ error: 'Valid date parameter is required (today, yesterday, dayBeforeYesterday, lastweek)' });
  }

  const { startDate, endDate } = dateRange;

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
    console.error('Error fetching daily weather data:', err);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

router.get('/weather/hourly', async (req, res) => {
  const city = req.query.city; 
  const day = req.query.date; 

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }
  
  if (!day || !['today', 'yesterday', 'dayBeforeYesterday'].includes(day)) {
    return res.status(400).json({ error: 'Valid date parameter is required (today, yesterday, dayBeforeYesterday)' });
  }

  // Determine the selected date based on the day parameter
  const selectedDate = formatDate(new Date(Date.now() - (day === 'yesterday' ? 86400000 : (day === 'dayBeforeYesterday' ? 2 * 86400000 : 0))));

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
    console.error('Error fetching hourly weather data:', err);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

module.exports = router;
