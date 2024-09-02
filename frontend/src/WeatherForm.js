import React, { useState } from 'react';
import axios from 'axios';

const WeatherForm = ({ setWeatherData }) => {
  const [city, setCity] = useState('');

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
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
    <div className="city-input">
      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
      <button onClick={fetchWeatherByLocation}>Use My Location</button>
    </div>
  );
};

export default WeatherForm;
