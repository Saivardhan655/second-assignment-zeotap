import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Line chart  from area chart
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm } from 'react-icons/wi'; // Import weather icons
import './AllWeatherRollup.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const WeatherComponent = ({ selectedCity }) => {
    const [chartData, setChartData] = useState({});
    const [selectedDate, setSelectedDate] = useState("lastweek");
    const [weatherData, setWeatherData] = useState([]);

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
    }, [selectedCity, selectedDate]);

    useEffect(() => {
        if (weatherData && weatherData.length > 0) {
            const dates = weatherData.map((item) => item.day.split('T')[0]); // Extracted date in YYYY-MM-DD format
            const avgTemps = weatherData.map((item) => item.avg_temp);

            setChartData({
                labels: dates,
                datasets: [
                  {
                    data: avgTemps,
                    fill: {
                        target: 'origin', // Fill to the baseline/origin
                        above: 'rgba(161, 156, 16, 0.5)', // Color above the line
                        below: 'rgba(161, 156, 16, 0.1)' // Color below the line
                    },
                    borderColor: 'rgba(161, 156, 16, 1)', // Line color
                    borderWidth: 2, // Adjust border width as needed
                    tension: 0.4, // Smooth curve
                }
                
                
                ],
            });
        }
    }, [weatherData]);

    const getWeatherIcon = (condition) => {
        if (!condition) return null; // Handle empty or undefined conditions

        switch (condition.toLowerCase()) {
            case 'clear':
                return <WiDaySunny size={24} color="#ffcc00" />;
            case 'light intensity drizzle':
            case 'drizzle':
            case 'light rain':
            case 'moderate rain':
                return <WiRain size={24} color="#76c7c0" />;
            case 'mist':
            case 'fog':
            case 'haze':
            case 'smoke':
                return <WiCloudy size={24} color="#a0a0a0" />;
            case 'broken clouds':
            case 'overcast clouds':
            case 'scattered clouds':
            case 'few clouds':
                return <WiCloudy size={24} color="#a0a0a0" />;
            case 'thunderstorm':
            case 'thunderstorm with light rain':
            case 'thunderstorm with rain':
                return <WiThunderstorm size={24} color="#ff6600" />;
            default:
                return <WiCloudy size={24} color="#a0a0a0" />; // Default to cloudy icon
        }
    };

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
                    display: false,
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
            <h2>All Rollup Trends in {selectedCity}</h2>
            {chartData && chartData.labels ? (
                <>
                    <Line data={chartData} options={options} />
                    {/* Weather icons below the chart */}
                    <div className="weather-icons">
                        {weatherData.map((item, index) => (
                            <div key={index} className="weather-icon-item">
                                {getWeatherIcon(item.condition)} {/* Display icon */}
                                {/* <span>{item.condition}</span> */}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
};

export default WeatherComponent;
