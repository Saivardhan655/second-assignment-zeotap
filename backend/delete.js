const axios = require('axios');

const API_KEY = "94c6ed914eab222f485e6e237da99cd4";
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data for a specific city
const getWeatherData = async (city) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        // Log the entire response object
        console.log('Full Response:', JSON.stringify(response.data, null, 2));

        if (response.status === 200) {
            const weatherData = {
                temp: response.data.main.temp,
                feels_like: response.data.main.feels_like,
                condition: response.data.weather[0].description,
                timestamp: response.data.dt
            };

            console.log('Extracted Weather Data:', weatherData);
        } else {
            console.log(`Failed to fetch weather data for ${city}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching weather data for ${city}: ${error.message}`);
    }
};

// Test the function with a specific city
//getWeatherData('London'); // Change 'London' to any city you want to test






/*
Full Response: {
    "coord": {
      "lon": -0.1257,
      "lat": 51.5085
    },
    "weather": [
      {
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
      }
    ],
    "base": "stations",
    "main": {
      "temp": 8.53,
      "feels_like": 8.53,
      "temp_min": 6.74,
      "temp_max": 9.32,
      "pressure": 1027,
      "humidity": 93,
      "sea_level": 1027,
      "grnd_level": 1024
    },
    "visibility": 10000,
    "wind": {
      "speed": 0.89,
      "deg": 261,
      "gust": 2.68
    },
    "clouds": {
      "all": 4
    },
    "dt": 1729581433,
    "sys": {
      "type": 2,
      "id": 2091269,
      "country": "GB",
      "sunrise": 1729579011,
      "sunset": 1729615961
    },
    "timezone": 3600,
    "id": 2643743,
    "name": "London",
    "cod": 200
  }
  Extracted Weather Data: {
    temp: 8.53,
    feels_like: 8.53,
    condition: 'clear sky',
    timestamp: 1729581433
  }
  
*/