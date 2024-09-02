import React from 'react';
import './App.css';  // Ensure the styles from App.css are applied here

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) {
    return null;  // If no data is available, render nothing
  }

  const { current, forecast } = weatherData;

  return (
    <>
      {/* Weather Details Card */}
      <div className="weather-details">
        <h2>{current.city}, {current.country}</h2>
        <h3>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</h3>
        <h1>{Math.round(current.temperature)}°C</h1>
        <h3>{current.description.toUpperCase()}</h3>
        <p>Humidity: {current.humidity}%</p>
        <p>Wind Speed: {current.wind_speed} km/h</p>
      </div>

      {/* 5-Day Forecast Card */}
      <div className="forecast-container">
        <h4>5-Day Forecast</h4>
        {forecast.map((day, index) => (
          <div className="forecast-day" key={index}>
            <span>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span>{Math.round(day.temp)}°C</span>
            <img src={`http://openweathermap.org/img/wn/${day.icon}.png`} alt={day.description} />
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherDisplay;
