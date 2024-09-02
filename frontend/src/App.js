import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import WeatherDisplay from './WeatherDisplay';
import WeatherForm from './WeatherForm';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [showInfo, setShowInfo] = useState(false); 

  // Function to toggle the info modal
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="App">
      {/* Header Section */}
      <header className="app-header">
        <h6>Weather App by Meghna Jaglan</h6>
        <button className="info-button" onClick={toggleInfo}>Info</button>
      </header>

      <div className="weather-container">
        {/* Input Form */}
        <WeatherForm setWeatherData={setWeatherData} />
        
        {/* Weather Details Card */}
        {weatherData && <WeatherDisplay weatherData={weatherData} />}
      </div>

      {/* Info Modal or Section */}
      {showInfo && (
        <div className="info-modal">
          <div className="info-content">
            <h2>About PM Accelerator</h2>
            <p>
              PM Accelerator is a comprehensive program designed to help aspiring product managers
              succeed in interviews and build their careers in product management. Our approach includes
              rigorous training, mock interviews, and access to a community of professionals and mentors.
              Learn more here: <a href="https://www.linkedin.com/school/productmanagerinterview/about/" target="_blank" rel="noopener noreferrer">LinkedIn page</a>.
            </p>
            <button onClick={toggleInfo}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
