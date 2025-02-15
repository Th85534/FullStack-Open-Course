import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "97365dee90msh5465f636889868fp1a7aa1jsn688c264e7acb";
const API_HOST = "open-weather13.p.rapidapi.com";

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    if (query) {
      const results = countries.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(results);
    } else {
      setFilteredCountries([]);
    }
    setSelectedCountry(null);
    setWeather(null);
  }, [query, countries]);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      const capital = encodeURIComponent(country.capital);
      const weatherUrl = `https://open-weather13.p.rapidapi.com/city/${capital}/EN`;
      
      axios
        .get(weatherUrl, {
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST
          }
        })
        .then((response) => {
          setWeather(response.data);
        })
        .catch((error) => console.error("Weather fetch error:", error));
    }
  }, [filteredCountries]);

  const showCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1>Country Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a country..."
      />
      {filteredCountries.length > 10 ? (
        <p>Too many matches, please specify further.</p>
      ) : filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common} 
              <button onClick={() => showCountry(country)}>Show</button>
            </li>
          ))}
        </ul>
      ) : null}
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages).map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>
          <img src={selectedCountry.flags.png} alt="flag" width={150} />
          {weather && weather.main && (
            <div>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>Temperature: {weather.main.temp}°F</p>
              <p>Condition: {weather.weather[0].description}</p>
              <p>Wind Speed: {weather.wind.speed} mph</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </div>
          )}
        </div>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>Capital: {filteredCountries[0].capital}</p>
          <p>Area: {filteredCountries[0].area} km²</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values(filteredCountries[0].languages).map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>
          <img src={filteredCountries[0].flags.png} alt="flag" width={150} />
          {weather && weather.main && (
            <div>
              <h3>Weather in {filteredCountries[0].capital}</h3>
              <p>Temperature: {weather.main.temp}°F</p>
              <p>Condition: {weather.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
              <p>Wind Speed: {weather.wind.speed} mph</p>
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default App;
