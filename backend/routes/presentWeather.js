// routes/presentWeather.js
const express = require('express');
const router = express.Router();
const presentWeatherController = require('../controllers/presentWeather');

// Route to get present weather data for a city
router.get('/weather/:city', presentWeatherController.getPresentWeather);

module.exports = router;
