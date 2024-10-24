import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './AllWeatherRollup.css'; // Optional for styling
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const WeatherComponent = ({ selectedCity }) => {
  const [chartData, setChartData] = useState({});
  const [selectedDate, setSelectedDate] = useState("lastweek");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/rollup/weather/daily`, {
          params: { city: selectedCity, date: selectedDate },
        });

        if (response.data && Array.isArray(response.data)) {
          setWeatherData(response.data);
        } else {
          setWeatherData([]);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData([]);
      }
    };

    fetchData();
  }, [selectedCity, selectedDate]); // Add selectedDate to the dependency array

  useEffect(() => {
    if (weatherData && weatherData.length > 0) {
      const dates = weatherData.map((item) => item.day.split('T')[0]); // Extract date in YYYY-MM-DD format
      const avgTemps = weatherData.map((item) => item.avg_temp);

      setChartData({
        labels: dates,
        datasets: [
          {
            data: avgTemps,
            fill: true, // Fill the area under the line
            backgroundColor: 'rgba(161, 156, 16, 0.3)', // Light opacity for the fill color
            borderColor: 'rgba(161, 156, 16, 1)', // Line color
            tension: 0.1, // Smooth curve
          },
        ],
      });
    }
  }, [weatherData]);

  // Chart configuration options
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
        display: false, // Hide the legend
      },
    },
  };

  return (
    <div className="weather-chart-container">
      <h2>Temperature Trends in {selectedCity}</h2>
      {chartData && chartData.labels ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default WeatherComponent;
