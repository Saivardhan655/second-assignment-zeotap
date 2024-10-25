const express = require('express');
const router = express.Router();
const db = require('../utils/database')

const getRecentWeatherData = async (city) => {
    const query = `
    SELECT *
    FROM weather_data
    WHERE city = $1
    ORDER BY timestamp DESC
    LIMIT 1;
    `;
    
    
    const result = await db.query(query, [city]);
    return result.rows[0]; //returns the most frequent rrecord from the databaes
};



const checkWeatherConditions = async (city, weatherData) => {
    // console.log('City:', city);
    console.log('Weather Data:', weatherData);
    
    if (weatherData === undefined) {
        console.error('No weather data provided.');
        return []; // Return an empty array if no weather data is provided
    }
    const recentWeatherData = await getRecentWeatherData(city);
    console.error(`recentWeatherData ${recentWeatherData.temp}.`);

    // console.table(weatherData);
    // console.log(weatherData);
    // console.log(`alertcontroller ${weatherData.temp}`);
    // console.log(`alertcontroller cond i ${weatherData.condition}`);
    // console.log(`alertcontroller dominant cond ${weatherData.dominant_condition}`);

    let alerts = []; // Always initialize as an array

    // Check for heat alert conditions
    if (weatherData.temp > 35 && recentWeatherData.temp > 35) {
        const alert = {
            city: city,
            alert_type: 'Heat Alert',
            description: 'High Heat conditions expected.',
            severity: 'High',
        };
        alerts.push(alert); // Add alert to the array
        // console.log(`controller 47: Heat alert triggered`);
    }
    console.log(alerts)


    return alerts; // Return the array (could be empty)
};




// Correct export
module.exports = { checkWeatherConditions };
