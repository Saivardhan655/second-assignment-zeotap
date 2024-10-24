import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi'; // Weather Icons
import './PresentWeather.css';

const API_URL = process.env.REACT_APP_API_URL; // Assuming you're using create-react-app

const PresentWeather = ({ selectedCity }) => {
  const [presentData, setPresentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresentWeather = async () => {
      try {
        console.log(selectedCity)
        setLoading(true);
        const response = await axios.get(`${API_URL}/present/weather/${selectedCity}`);
        // console.log(response);
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

  if (loading) {
    return <p className="loading-text">Loading present weather data...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!presentData) {
    return <p className="no-data-text">No present weather data available.</p>;
  }

  const temp = presentData.temp !== undefined ? presentData.temp.toFixed(2) : 'N/A';
  const feelsLike = presentData.feels_like !== undefined ? presentData.feels_like.toFixed(2) : 'N/A';

  return (
    <div className="weather-card">
      <h2 className="city-name">{selectedCity}</h2>
      <div className="weather-icon">
        {getWeatherIcon(presentData.condition)}
      </div>
      <div className="weather-details">
        <p className="temperature">{temp}°C</p>
        <p className="feels-like">Feels like {feelsLike}°C</p>
        <p className="condition">{presentData.condition}</p>
        <p className="timestamp">{new Date(presentData.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PresentWeather;
