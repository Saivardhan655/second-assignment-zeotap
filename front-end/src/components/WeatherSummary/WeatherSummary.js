import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherSummary.css'; // Import the styles
import {  celsiusToFahrenheit } from '../../utils/temperatureConvertion';
import ReactLoading from 'react-loading'; // Import loading spinner

const API_URL = process.env.REACT_APP_API_URL;

const WeatherSummary = ({ selectedCity, selectedTemp }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [tempUnit, setTempUnit] = useState('C'); // Default to Celsius

  useEffect(() => {
    // Fetch the weather summary for the selected city from the backend
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const weatherRes = await axios.get(`${API_URL}/api/summary/${selectedCity}`);
        setWeatherData(weatherRes.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (selectedCity) {
      fetchData();
    }
  }, [selectedCity]);

  useEffect(() => {
    // Update the tempUnit whenever selectedTemp changes
    setTempUnit(selectedTemp || 'C');
  }, [selectedTemp]);

  const convertTemperature = (temp) => {
    // Convert the temperature string to a number
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum)) {
      return 'N/A'; // Handle cases where temp is not a number
    }

    switch (tempUnit) {
      // case 'K':
      //   return celsiusToKelvin(tempNum).toFixed(2);
      case 'F':
        return celsiusToFahrenheit(tempNum).toFixed(2);
      case 'C':
      default:
        return tempNum.toFixed(2);
    }
  };

  return (
    <div className="weather-summary-container">
      {loading ? (
        <div className="loading-container">
          <ReactLoading type="spin" color="#007bff" height={50} width={50} />
          <p className="loading-text">Loading weather summary for {selectedCity}...</p>
        </div>
      ) : (
        weatherData && (
          <div>
            <h2>Summary for {selectedCity}</h2>
            <p><strong>Average Temperature:</strong> {convertTemperature(weatherData.avg_temp)}°{tempUnit}</p>
            <p><strong>Max Temperature:</strong> {convertTemperature(weatherData.max_temp)}°{tempUnit}</p>
            <p><strong>Min Temperature:</strong> {convertTemperature(weatherData.min_temp)}°{tempUnit}</p>
            <p><strong>Condition:</strong> {weatherData.dominant_condition}</p>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherSummary;
