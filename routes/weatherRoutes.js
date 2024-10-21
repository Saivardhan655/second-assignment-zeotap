const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Route to get daily summary for a city
router.get('/summary/:city', weatherController.getDailySummary);

module.exports = router;
