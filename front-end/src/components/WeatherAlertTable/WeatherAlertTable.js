// src/components/WeatherAlertTable/WeatherAlertTable.js
import React from 'react';
import './WeatherAlertTable.css';

const WeatherAlertTable = ({ alerts }) => {
  return (
    <div className="weather-alert-table-container">
      <h2>Alerts</h2>
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
                <td>{alert.type}</td>
                <td>{alert.description}</td>
                <td>{alert.severity}</td>
                <td>{alert.issuedAt}</td>
                <td>{alert.expiresAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherAlertTable;
