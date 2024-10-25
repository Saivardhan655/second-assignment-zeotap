import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi'; // Importing weather icons
import './TemperatureTrends.css';

const API_URL = process.env.REACT_APP_API_URL;

const TemperatureTrends = () => {
  const [data, setData] = useState({
    dates: [],
    temperatures: [],
    conditions: [], // To store weather conditions
    percentageIncrease: 0,
    updatedTime: 'N/A',
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`${API_URL}/weather-summary`);
        const weatherData = await response.json();

        const dates = weatherData.map(item => item.date);
        const temperatures = weatherData.map(item => item.avg_temp);
        const conditions = weatherData.map(item => item.weather_condition); // Fetch weather conditions

        setData({
          dates,
          temperatures,
          conditions, // Add conditions to state
          percentageIncrease: calculatePercentageIncrease(temperatures),
          updatedTime: new Date().toLocaleTimeString(),
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const calculatePercentageIncrease = (temperatures) => {
    if (temperatures.length < 2) return 0;
    const initial = temperatures[0];
    const latest = temperatures[temperatures.length - 1];
    return ((latest - initial) / initial) * 100;
  };

  // Function to map weather condition to corresponding icon
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <WiDaySunny size={40} color="#ffcc00" />;
      case 'cloudy':
        return <WiCloudy size={40} color="#a0a0a0" />;
      case 'rain':
        return <WiRain size={40} color="#76c7c0" />;
      case 'snow':
        return <WiSnow size={40} color="#00aaff" />;
      case 'thunderstorm':
        return <WiThunderstorm size={40} color="#ff6600" />;
      default:
        return <WiCloudy size={40} color="#a0a0a0" />;
    }
  };

  const chartData = {
    labels: data.dates, // The x-axis dates
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: data.temperatures,
        fill: false,
        borderColor: '#f87979',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="temperature-trend-container">
      <div className="temperature-chart">
        <Line data={chartData} options={options} />
      </div>
      <div className="temperature-summary">
        <p>Percentage Increase: {data.percentageIncrease.toFixed(2)}%</p>
        <p>Last Updated: {data.updatedTime}</p>
      </div>
      {/* Display weather icons separately */}
      <div className="weather-conditions">
        {data.conditions.map((condition, index) => (
          <div key={index} className="weather-icon">
            <span>{data.dates[index]}</span>
            {getWeatherIcon(condition)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureTrends;
