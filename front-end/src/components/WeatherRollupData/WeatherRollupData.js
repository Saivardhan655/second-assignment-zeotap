import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading'; // Import loading spinner

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './WeatherRollupData.css';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL;

const WeatherData = ({ selectedCity, selectedDate }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/rollup/weather/hourly`, {
          params: { city: selectedCity, date: selectedDate }
        }
      );
      // console.log(response);
      
      // Check if data is in the expected format
      if (response.data && Array.isArray(response.data)) {
        setWeatherData(response.data);
      } else {
        setWeatherData([]);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError('Error fetching weather data');
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedCity, selectedDate]);

  // Prepare the data for the line chart
  const chartData = {
    labels: weatherData.map((data) => {
      const date = new Date(data.hour); // Assuming your API returns 'hour' as the timestamp
      return `${date.getHours()}:00`; // Format the hour for the label
    }),
    datasets: [
      {
        label: 'Avg Temperature (°C)',
        data: weatherData.map((data) => (data.avg_temp ? data.avg_temp.toFixed(2) : null)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue area under the line
        borderColor: 'rgba(54, 162, 235, 1)', // Blue line
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Avg Feels Like (°C)',
        data: weatherData.map((data) => (data.avg_feels_like ? data.avg_feels_like.toFixed(2) : null)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Red area under the line
        borderColor: 'rgba(255, 99, 132, 1)', // Red line
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour',
        },
        type: 'category', // Set x-axis to categorical
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
        beginAtZero: false,
        min: 20,
        max: 40,
      },
    },
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

  return (
    <div className="weather-data-container">
      <h1 className="city-title">daily Rollup {selectedCity}</h1>

      {weatherData.length > 0 ? (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="no-data-text">No data available for the selected city and date.</p>
      )}
    </div>
  );
};

export default WeatherData;
