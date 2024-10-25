const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const weatherRoutes = require('./routes/weatherRoutes');
const presentRoutes = require('./routes/presentWeather');
const rollupRoute = require('./routes/weatherData');
const alertRoutes = require('./routes/alertRoute'); // Import the alert routes
const updateWeatherData = require('./services/weather_data');
const db = require('./utils/database');


// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON request bodies


db.createTables();


// Route to test database connection
app.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Update weather data (presumably a scheduled task)
updateWeatherData();

// Use defined routes
app.use('/api', weatherRoutes);
app.use('/present', presentRoutes);
app.use('/rollup', rollupRoute);
app.use('/api/alerts', alertRoutes);

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
