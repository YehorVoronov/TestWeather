import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import './../App.css'; 

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
}

interface FavoriteCity {
  name: string;
  temperature: number;
  humidity: number;
  description: string;
  units: 'imperial' | 'metric';
}

function Dashboard() {
  const apiKey = '43233cefd22a75b52dce2e74340c6e86';
  const [city, setCity] = useState<string>('London');
  const [inputError, setInputError] = useState<string>('');
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [fav, setFav] = useState<FavoriteCity[]>([]);

  const fetchWeatherData = async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
    );
    if (!response.ok) {
      throw new Error('City not found');
    }
    return response.json();
  };

  const { data: weatherData, error, isLoading, refetch } = useQuery<WeatherData>('weatherData', fetchWeatherData);

  const AddToFavorite = () => {
    if (!fav.find((item) => item.name === city)) {
      const newFavorite: FavoriteCity = {
        name: city,
        temperature: weatherData!.main.temp,
        humidity: weatherData!.main.humidity,
        description: weatherData!.weather[0].description,
        units: units,
      };

      setFav((prevFav) => [...prevFav, newFavorite]);

      const updatedFavorites = [...fav, newFavorite];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorite = (name: string) => {
    setFav((prevFavorites) => prevFavorites.filter((item) => item.name !== name));
  };

  const toggleUnits = () => {
    setUnits(units === 'imperial' ? 'metric' : 'imperial');
  };

  useEffect(() => {
    fetchWeatherData();

    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFav(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <div className="Dashboard">
      <div className="header">
        <button className="units-button" onClick={toggleUnits}>
          {units === 'imperial' ? <div>F</div> : <div>C</div>}
        </button>
      </div>

      <div className="input-section">
        <input
          className="city-input"
          type="text"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setInputError('');
          }}
          placeholder="Enter city"
        />
        {inputError && <p className="error">{inputError}</p>}

        <button className="action-button" onClick={() => {fetchWeatherData(); refetch();}}>
          Get Weather
        </button>
        <button className="action-button" onClick={AddToFavorite}>
          Add to Favorite
        </button>
      </div>

      {/* Weather details */}
      {weatherData && (
        <div className="weather-details">
          <h2 className="city-name">{weatherData.name}</h2>
          <p className="temperature">
            Temperature: {weatherData.main.temp}°{units === 'imperial' ? 'F' : 'C'}
          </p>
          <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
          <p className="description">Description: {weatherData.weather[0].description}</p>
          <img
            className="weather-icon"
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="Weather Icon"
          />
        </div>
      )}

      {/* Favorites */}
      <div className="favorites">
        <h3>Favorites:</h3>
        {fav.map((item) => (
          <div key={item.name} className="favorite-item">
            {weatherData && (
              <Link
                to={{
                  pathname: `/${item.name}`,
                }}
              >
                <p className="favorite-name">Name: {item.name}</p>
                <p className="favorite-temperature">
                  Temperature: {item.temperature}°{item.units === 'imperial' ? 'F' : 'C'}
                </p>
                <p className="favorite-humidity">Humidity: {item.humidity}%</p>
                <p className="favorite-description">Description: {item.description}</p>
              </Link>
            )}
            <button className="remove-button" onClick={() => removeFromFavorite(item.name)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
