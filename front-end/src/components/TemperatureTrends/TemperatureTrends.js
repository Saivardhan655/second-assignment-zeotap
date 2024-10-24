import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './TemperatureTrends.css';
const API_URL = process.env.REACT_APP_API_URL
const TemperatureTrends = () => {
  const [data, setData] = useState({
    dates: [],
    temperatures: [],
    percentageIncrease: 0,
    updatedTime: 'N/A',
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('${API_URL}/weather-summary');
        const weatherData = await response.json();

        const dates = weatherData.map(item => item.date);
        const temperatures = weatherData.map(item => item.avg_temp);

        setData({
          dates,
          temperatures,
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

  const chartData = {
    labels: data.dates,
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
    </div>
  );
};

export default TemperatureTrends;
