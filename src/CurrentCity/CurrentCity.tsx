import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
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

function CurrentCity({ units }: CurrentCityProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const cityName = pathname ? pathname.split('/').pop() : null;

  const apiKey = '43233cefd22a75b52dce2e74340c6e86';
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (cityName) {
      const encodedCityName = encodeURIComponent(cityName);
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCityName}&appid=${apiKey}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('City not found');
          }
          return response.json();
        })
        .then((data: WeatherData) => {
          setWeatherData(data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          setWeatherData(null);
        });
    }
  }, [cityName, units, apiKey]);

  return (
    <div>
      {cityName ? (
        <div>
          <h2>{cityName}</h2>
          {weatherData ? (
            <div>
              <p>Temperature: {weatherData.main.temp}°{units === 'imperial' ? 'F' : 'C'}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Description: {weatherData.weather[0].description}</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      ) : (
        <p>City not specified</p>
      )}
    </div>
  );
}

export default CurrentCity;
