const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// Route to get all alerts
router.get('/', async (req, res) => { // Changed to '/' for consistency
    const query = 'SELECT * FROM weather_alerts ORDER BY issued_at DESC LIMIT 5';

    try {
        const result = await db.query(query);
        const alerts = result.rows;

        if (alerts.length === 0) {
            return res.status(404).json({ message: 'No alerts found.' });
        }

        return res.status(200).json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return res.status(500).json({ message: 'Error fetching alerts', error: error.message });
    }
});

module.exports = router; // Ensure this line is present
