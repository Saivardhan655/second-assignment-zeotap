const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');
// app.use(bodyParser.json());
app.use(cors());

// Set up PostgreSQL connection pool
const pool = new Pool({

  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// route to test database connection
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});
const weatherRoutes = require('./routes/weatherRoutes');
const presentRoutes=require('./routes/presentWeather');
const rollupRoute=require('./routes/weatherData');
const updateWeatherData=require('./services/weather_data');
updateWeatherData();

app.use('/api', weatherRoutes);
// Use the route for present weather
app.use('/present', presentRoutes);
app.use('/rollup', rollupRoute)

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
