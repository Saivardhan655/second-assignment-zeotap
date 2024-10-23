import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PresentWeather = ({ selectedCity }) => {
  const [presentData, setPresentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresentWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/present/weather/${selectedCity}`);
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

  if (loading) {
    return <p className="text-center text-blue-600">Loading present weather data...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!presentData) {
    return <p className="text-center">No present weather data available.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Present Weather in {selectedCity}</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">Temperature (°C)</th>
            <th className="px-4 py-2 border border-gray-300">Feels Like (°C)</th>
            <th className="px-4 py-2 border border-gray-300">Condition</th>
            <th className="px-4 py-2 border border-gray-300">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border border-gray-300">{presentData.temp.toFixed(2)}°C</td>
            <td className="px-4 py-2 border border-gray-300">{presentData.feels_like.toFixed(2)}°C</td>
            <td className="px-4 py-2 border border-gray-300">{presentData.condition}</td>
            <td className="px-4 py-2 border border-gray-300">{new Date(presentData.timestamp).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PresentWeather;
