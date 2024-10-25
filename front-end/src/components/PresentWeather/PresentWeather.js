import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import ReactLoading from 'react-loading';
import './PresentWeather.css';
import { celsiusToFahrenheit } from '../../utils/temperatureConvertion';

const API_URL = process.env.REACT_APP_API_URL;

const PresentWeather = ({ selectedCity, selectedTemp }) => {
  const [presentData, setPresentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState('C'); // Default to 'C'

  useEffect(() => {
    const fetchPresentWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/present/weather/${selectedCity}`);
        // console.log(response.data)
        setPresentData(response.data);
      } catch (err) {
        setError('Error fetching present weather data');
      } finally {
        setLoading(false);
      }
    };

    if (selectedCity) {
      fetchPresentWeather();
    }
  }, [selectedCity]);

  useEffect(() => {
    switch (selectedTemp) {
      case 'C':
        setTempUnit('C');
        break;
      case 'F':
        setTempUnit('F');
        break;
      case 'K':
        setTempUnit('K');
        break;
      default:
        setTempUnit('C');
    }
  }, [selectedTemp]);

  const getWeatherIcon = (condition) => {
    if (!condition) {
      return <WiCloudy size={64} color="#a0a0a0" />;
    }
    switch (condition.toLowerCase()) {
      case 'clear':
        return <WiDaySunny size={64} color="#ffcc00" />;
      case 'cloudy':
        return <WiCloudy size={64} color="#a0a0a0" />;
      case 'rain':
        return <WiRain size={64} color="#76c7c0" />;
      case 'snow':
        return <WiSnow size={64} color="#00aaff" />;
      case 'thunderstorm':
        return <WiThunderstorm size={64} color="#ff6600" />;
      default:
        return <WiCloudy size={64} color="#a0a0a0" />;
    }
  };

  const convertTemperature = (temp) => {
    switch (tempUnit) {

      case 'F':
        return celsiusToFahrenheit(temp).toFixed(2);
      case 'C':
      default:
        return temp.toFixed(2);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ReactLoading type="spin" color="#007bff" height={50} width={50} />
        <p className="loading-text">Loading present weather data...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!presentData) {
    return <p className="no-data-text">No present weather data available.</p>;
  }

  const temp = presentData.max_temp !== undefined ? convertTemperature(presentData.max_temp) : 'N/A';
  // console.log(temp)
  const feelsLike = presentData.feels_like !== undefined ? convertTemperature(presentData.feels_like) : 'N/A';

  return (
    <div className="weather-card">
      <h2 className="city-name">{selectedCity}</h2>
      <div className="weather-icon">
        {getWeatherIcon(presentData.condition)}
      </div>
      <div className="weather-details">
        <p className="temperature">{temp}°{tempUnit}</p>
        <p className="feels-like">Feels like {feelsLike}°{tempUnit}</p>
        <p className="condition">{presentData.condition}</p>
        <p className="timestamp">{new Date(presentData.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PresentWeather;
