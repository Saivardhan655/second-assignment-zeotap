// src/components/WeatherSummaryContainer.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherSummaryContainer = ({ selectedCity }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch the weather summary for the selected city from the backend
    const fetchData = async () => {
      try {
        const weatherRes = await axios.get(`http://localhost:3000/api/summary/${selectedCity}`);
        setWeatherData(weatherRes.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };
    fetchData();
  }, [selectedCity]);

  return (
    <div>
      {weatherData ? (
        <div>
          <h2>Weather Summary for {selectedCity}</h2>
          <p><strong>AverageTemperature:</strong> {weatherData.avg_temp}°C</p>
          <p><strong>Max Temperature:</strong> {weatherData.max_temp}°C</p>
          <p><strong>Min Temperature:</strong> {weatherData.min_temp}°C</p>
          <p><strong>Condition:</strong> {weatherData.dominant_condition}</p>
        </div>
      ) : (
        <p>Loading weather summary for {selectedCity}...</p>
      )}
    </div>
  );
};

export default WeatherSummaryContainer;
