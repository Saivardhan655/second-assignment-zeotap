import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import WeatherSummary from './components/WeatherSummary/WeatherSummary';
import WeatherRollupData from './components/WeatherRollupData/WeatherRollupData';
import PresentWeather from './components/PresentWeather/PresentWeather';
import WeatherAlertTable from './components/WeatherAlertTable/WeatherAlertTable';
import TemperatureTrends from './components/TemperatureTrends/TemperatureTrends';
import AllWeatherRollup from './components/AllWeatherRollup/AllWeatherRollup.js'

const App = () => {
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [selectedDate, setSelectedDate] = useState('today');
  const [alerts, setAlerts] = useState([
    {
      type: 'Thunderstorm',
      description: 'Heavy thunderstorms expected in the evening.',
      severity: 'High',
      issuedAt: '2024-10-22 14:00',
      expiresAt: '2024-10-22 20:00',
    },
    {
      type: 'Flood Warning',
      description: 'Moderate flooding possible in low-lying areas.',
      severity: 'Medium',
      issuedAt: '2024-10-22 09:00',
      expiresAt: '2024-10-23 09:00',
    },
  ]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="dashboard-container">
      <div className="app-layout">
      <aside className="side-container">
          <div className="side-container-header">Select City</div>
          <ul className="side-container-menu">
            <li onClick={() => handleCityChange('Hyderabad')}>Hyderabad</li>
            <li onClick={() => handleCityChange('Delhi')}>Delhi</li>
            <li onClick={() => handleCityChange('Mumbai')}>Mumbai</li>
            <li onClick={() => handleCityChange('Chennai')}>Chennai</li>
            <li onClick={() => handleCityChange('Bangalore')}>Bangalore</li>
            <li onClick={() => handleCityChange('Kolkata')}>Kolkata</li>

          </ul>
          <div className="side-container-header">Select Date</div>
          <ul className="side-container-menu">
            <li onClick={() => handleDateChange('today')}>Today</li>
            <li onClick={() => handleDateChange('yesterday')}>Yesterday</li>
            <li onClick={() => handleDateChange('daybeforeyesterday')}>Day Before Yesterday</li>
          </ul>
        </aside>

        <main className="main-content">
          <Navbar />
          <div className="grid grid-cols-3 component-row">
            <div className="component-container">
              <PresentWeather selectedCity={selectedCity} />
            </div>
            <div className="component-container">
              <WeatherSummary selectedCity={selectedCity} />
            </div>
           
            {/* <div className="component-container">
              <TemperatureTrends selectedCity={selectedCity}/>
            </div> */}
            <div className="component-container">
              <AllWeatherRollup selectedCity={selectedCity}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 component-row full-width">
            <div className="component-container">
              <WeatherAlertTable alerts={alerts} />
            </div>
            <div className="component-container">
              <WeatherRollupData selectedCity={selectedCity} selectedDate={selectedDate} />
            </div>
          <Footer/>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
