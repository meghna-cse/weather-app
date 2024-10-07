import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Thermometer, CloudRain, Wind, Sun, Moon, Cloud, CloudSnow, CloudLightning, Info } from 'react-feather';
import './App.css';

const WeatherBackground = ({ weatherCode, isDay }) => {
  const getWeatherElements = () => {
    switch (weatherCode) {
      case '01d':
      case '01n':
        return isDay ? (
          <div className="weather-animation sunny">
            <Sun className="weather-icon sun" />
          </div>
        ) : (
          <div className="weather-animation night">
            <Moon className="weather-icon moon" />
            {[...Array(20)].map((_, i) => (
              <div key={i} className="star" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
        );
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return (
          <div className="weather-animation cloudy">
            {isDay && <Sun className="weather-icon sun" />}
            <Cloud className="weather-icon cloud-1" />
            <Cloud className="weather-icon cloud-2" />
          </div>
        );
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return (
          <div className="weather-animation rainy">
            <Cloud className="weather-icon cloud-1" />
            <CloudRain className="weather-icon rain" />
            {[...Array(20)].map((_, i) => (
              <div key={i} className="raindrop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}></div>
            ))}
          </div>
        );
      case '11d':
      case '11n':
        return (
          <div className="weather-animation stormy">
            <Cloud className="weather-icon cloud-1" />
            <CloudLightning className="weather-icon lightning" />
            <div className="lightning-flash"></div>
          </div>
        );
      case '13d':
      case '13n':
        return (
          <div className="weather-animation snowy">
            <CloudSnow className="weather-icon snow" />
            {[...Array(20)].map((_, i) => (
              <div key={i} className="snowflake" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}></div>
            ))}
          </div>
        );
      case '50d':
      case '50n':
        return (
          <div className="weather-animation foggy">
            <Cloud className="weather-icon fog-1" />
            <Cloud className="weather-icon fog-2" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="weather-background">
      {getWeatherElements()}
    </div>
  );
};

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;

  const { current, forecast } = weatherData;
  const isDay = current.icon.includes('d');

  return (
    <div className="weather-display">
      <h2>{current.city}, {current.country}</h2>
      <div className="current-weather">
        <img 
          src={`http://openweathermap.org/img/wn/${current.icon}@2x.png`} 
          alt={current.description}
          className="weather-icon"
        />
        <div>
          <p className="temperature">{Math.round(current.temperature)}°C</p>
          <p className="description">{current.description}</p>
        </div>
      </div>
      <div className="weather-details">
        <div className="detail">
          <Thermometer size={16} />
          <span>Feels like: {Math.round(current.temperature)}°C</span>
        </div>
        <div className="detail">
          <CloudRain size={16} />
          <span>Humidity: {current.humidity}%</span>
        </div>
        <div className="detail">
          <Wind size={16} />
          <span>Wind: {current.wind_speed} m/s</span>
        </div>
      </div>
      <div className="forecast">
        <h3>5-Day Forecast</h3>
        <div className="forecast-days">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-day">
              <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <img 
                src={`http://openweathermap.org/img/wn/${day.icon}.png`} 
                alt={`Weather on ${day.date}`}
              />
              <p>{Math.round(day.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WeatherForm = ({ setWeatherData }) => {
  const [city, setCity] = useState('');

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${encodeURIComponent(city)}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(`http://localhost:5000/weather/location?lat=${latitude}&lon=${longitude}`);
            setWeatherData(response.data);
          } catch (error) {
            console.error('Error fetching weather data by location:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="weather-form">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>
        <Search size={16} />
        <span>Search</span>
      </button>
      <button onClick={fetchWeatherByLocation}>
        <MapPin size={16} />
        <span>Use My Location</span>
      </button>
    </div>
  );
};

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>
          Learn more here: <a href="https://github.com/meghna-cse/weather-app" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const isDay = weatherData ? weatherData.current.icon.includes('d') : true;

  return (
    <div className={`App ${isDay ? 'day' : 'night'}`}>
      {weatherData && <WeatherBackground weatherCode={weatherData.current.icon} isDay={isDay} />}
      <div className="content">
        <header>
          <h1>Weather App</h1>
          <button className="info-button" onClick={() => setIsInfoModalOpen(true)}>
            <Info size={16} />
          </button>
        </header>
        <main>
          <WeatherForm setWeatherData={setWeatherData} />
          <WeatherDisplay weatherData={weatherData} />
        </main>
      </div>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}

export default App;