import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherSummary.css'; // Import the styles

const API_URL= process.env.REACT_APP_API_URL;

const WeatherSummary = ({ selectedCity }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch the weather summary for the selected city from the backend
    const fetchData = async () => {
      try {
        const weatherRes = await axios.get(`${API_URL}/api/summary/${selectedCity}`);
        console.log(weatherData)
        setWeatherData(weatherRes.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };
    fetchData();
  }, [selectedCity]);

  return (
    <div className="weather-summary-container">
      {weatherData ? (
        <div>
          <h2>{selectedCity}</h2>
          <p><strong>Average Temperature:</strong> {weatherData.avg_temp}°C</p>
          <p><strong>Max Temperature:</strong> {weatherData.max_temp}°C</p>
          <p><strong>Min Temperature:</strong> {weatherData.min_temp}°C</p>
          <p><strong>Condition:</strong> {weatherData.dominant_condition}</p>
        </div>
      ) : (
        <p className="loading-text">Loading weather summary for {selectedCity}...</p>
      )}
    </div>
  );
};

export default WeatherSummary;
