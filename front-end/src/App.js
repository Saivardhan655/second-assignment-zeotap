// src/App.js
import React from 'react';
import './index.css'; // or './App.css' if you named the file differently
import WeatherSummaryContainer from './components/WeatherSummary/WeatherSummary.js';
import WeatherData from './components/WeatherRollupData/WeatherRollupData.js';
import PresentWeather from './components/PresentWeather/PresentWeather.js';

const App = () => {
  return (
    <div className="dashboard-container">
      <h1>Weather Dashboard</h1>
      <h2>Welcome</h2>
      <div className="component-container">
        <PresentWeather selectedCity={'Hyderabad'} />
      </div>
      <div className="component-container">
        <WeatherSummaryContainer selectedCity={'Hyderabad'} />
      </div>
      <div className="component-container">
        <WeatherData />
      </div>
    </div>
  );
};

export default App;
