import React from 'react';

const HistoricalTrends = ({ data }) => {
  return (
    <div>
      <h2>Historical Weather Trends</h2>
      <ul>
        {data.map((entry, index) => (
          <li key={index}>
            Date: {entry.date}, Temp: {entry.temperature} °C, Humidity: {entry.humidity} %
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoricalTrends;
