const countryContainer = document.getElementById('countryData');
const apiKey = 'YOUR_WEATHERAPI_KEY'; // Replace with your WeatherAPI key

async function searchCountry() {
  const countryName = document.getElementById('countryInput').value.trim();
  if (!countryName) {
    alert('Please enter a country name!');
    return;
  }

  try {
    const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await countryResponse.json();

    if (!countryData || countryData.status === 404) throw new Error('Country not found');
    countryContainer.innerHTML = ''; // Clear previous results

    for (const country of countryData) {
      const { name, flags, capital, population } = country;
      console.log('Country Data:', country); // Debugging
      const weather = await fetchWeather(capital ? capital[0] : '');
      displayCountryData(name.common, flags.png, capital ? capital[0] : 'N/A', population, weather);
    }
  } catch (error) {
    console.error('Error:', error.message); // Debugging
    alert(`Error: ${error.message}`);
  }
}

async function fetchWeather(capital) {
  if (!capital) return 'No capital city provided';

  try {
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${capital}`
    );

    const weatherData = await weatherResponse.json();
    console.log('Weather API Response:', weatherData); // Debugging line

    if (!weatherData || weatherData.error) throw new Error(weatherData.error.message);

    const { temp_c, condition } = weatherData.current;
    return `Temperature: ${temp_c}°C, Condition: ${condition.text}`;
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    return 'Weather data unavailable';
  }
}

function displayCountryData(name, flag, capital, population, weather) {
  const countryCard = document.createElement('div');
  countryCard.className = 'col-md-4';

  countryCard.innerHTML = `
    <div class="card">
      <img src="${flag}" class="card-img-top" alt="${name}">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">Capital: ${capital}</p>
        <p class="card-text">Population: ${population.toLocaleString()}</p>
        <p class="card-text">Weather: ${weather}</p>
      </div>
    </div>
  `;
  countryContainer.appendChild(countryCard);
}
