import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the required components for Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const WeatherData = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [selectedDate, setSelectedDate] = useState('today');

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/rollup/weather/daily?city=${selectedCity}&date=${selectedDate}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedCity, selectedDate]);

  // Prepare the data for the line chart
  const chartData = {
    labels: weatherData.map((data) =>
      new Date(data.hour).toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    ),
    datasets: [
      {
        label: 'Avg Temperature (°C)',
        data: weatherData.map((data) => (data.avg_temp ? data.avg_temp.toFixed(2) : null)),
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)', // Blue
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4, // smooth curves
      },
      {
        label: 'Avg Feels Like (°C)',
        data: weatherData.map((data) => (data.avg_feels_like ? data.avg_feels_like.toFixed(2) : null)),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)', // Red
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4, // smooth curves
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
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
  };

  return (
    <div>
      <h1>Weather Data for {selectedCity}</h1>

      <label>Select City:</label>
      <select
        value={selectedCity}
        onChange={handleCityChange}
        style={{ padding: '10px', margin: '10px 0', borderRadius: '5px' }}
      >
        <option value="Hyderabad">Hyderabad</option>
        <option value="Delhi">Delhi</option>
        <option value="Mumbai">Mumbai</option>
        {/* Add more cities if needed */}
      </select>

      <label>Select Date:</label>
      <select
        value={selectedDate}
        onChange={handleDateChange}
        style={{ padding: '10px', margin: '10px 0', borderRadius: '5px' }}
      >
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="dayBeforeYesterday">Day Before Yesterday</option>
      </select>

      {weatherData.length > 0 ? (
        <div className="chart-container my-4" style={{ height: '400px', width: '60%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>No data available for the selected city and date.</p>
      )}
    </div>
  );
};

export default WeatherData;
