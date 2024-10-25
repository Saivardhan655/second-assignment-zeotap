// src/components/WeatherAlertTable/WeatherAlertTable.js
import React, { useEffect, useState } from 'react';
import './WeatherAlertTable.css';
import ReactLoading from 'react-loading'; // Import loading spinner
import axios from 'axios'; // Import axios for API requests

const API_URL = process.env.REACT_APP_API_URL;


const WeatherAlertTable = () => {
  const [alerts, setAlerts] = useState([]); // State to hold alerts
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${API_URL}/api/alerts/`); // Fetch alerts from API
        // console.log(response)
        setAlerts(response.data); // Update alerts state
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAlerts(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="weather-alert-table-container">
      <h2>Alerts</h2>
      {loading ? (
        <div className="loading-container">
          <ReactLoading type="spin" color="#007bff" height={50} width={50} />
          <p className="loading-text">Loading alerts...</p>
        </div>
      ) : (
        <table className="weather-alert-table">
          <thead>
            <tr>
              <th>Alert Type</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Issued At</th>
              <th>Expires At</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="5">No alerts at this time</td>
              </tr>
            ) : (
              alerts.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.alert_type}</td>
                  <td>{alert.description}</td>
                  <td>{alert.severity}</td>
                  <td>{new Date(alert.issued_at).toLocaleString()}</td>
                  <td>{new Date(alert.expires_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeatherAlertTable;
