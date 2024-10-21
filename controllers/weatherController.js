const weatherService = require('../services/weatherService');

exports.getDailySummary = async (req, res) => {
    const city = req.params.city;
    try {
        console.log('get daily summary called')
        const summary = await weatherService.getDailySummary(city);
        if (summary) {
            res.json({
                city: summary.city,
                avg_temp: summary.avg_temp.toFixed(2),
                max_temp: summary.max_temp.toFixed(2),
                min_temp: summary.min_temp.toFixed(2),
                dominant_condition: summary.dominant_condition
            });
        } else {
            res.status(404).json({ message: 'No data available for the past day' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily summary', error });
    }
};
