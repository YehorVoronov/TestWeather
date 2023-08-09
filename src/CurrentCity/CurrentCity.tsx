import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like:number;
    pressure:number;
  };
  weather: [
    {
      description: string;
    }
  ];
}

interface CurrentCityProps {
  units: 'imperial' | 'metric'; // Adjust as needed
}

function CurrentCity() {
  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname ? pathname.split('/') : [];
  const cityNameAndUnits = parts[1];
  const cityName = cityNameAndUnits ? cityNameAndUnits.split('+')[0] : null;
  const units = cityNameAndUnits ? cityNameAndUnits.charAt(cityNameAndUnits.length - 1) === 'F' ? 'imperial' : 'metric' : null;

  const apiKey = '43233cefd22a75b52dce2e74340c6e86';

  const fetchWeatherData = async () => {
    if (cityName) {
      const encodedCityName = encodeURIComponent(cityName);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedCityName}&appid=${apiKey}&units=${units}`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    }
    return null;
  };

  const { data: weatherData, error, isLoading } = useQuery<WeatherData | null>('weatherData', fetchWeatherData);
console.log(weatherData)
  return (
    <div>
      {cityName ? (
        <div>
          <h2>{cityName}</h2>
          {isLoading ? (
            <p>Loading weather data...</p>
          ) : error ? (
            <p>Error fetching weather data: {error.message}</p>
          ) : weatherData ? (
            <div>
              <p>Temperature: {weatherData.main.temp}°{units === 'imperial' ? 'F' : 'C'}</p>
              <p>feels_like: {weatherData.main.feels_like}:</p>
              <p>Pressure: {weatherData.main.pressure}:</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Description: {weatherData.weather[0].description}</p>
            </div>
          ) : (
            <p>No weather data available</p>
          )}
        </div>
      ) : (
        <p>City not specified</p>
      )}
    </div>
  );
}

export default CurrentCity;
