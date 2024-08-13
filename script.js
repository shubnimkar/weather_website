const apiKey = '76861849cf6412dfb66cf6504dc92a69'; // Replace with your API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
let isCelsius = true;

async function getWeather() {
    const city = document.getElementById('city-input').value || document.getElementById('city-name').textContent;
    if (city === '') return;

    document.getElementById('loading-spinner').style.display = 'block';

    const units = isCelsius ? 'metric' : 'imperial';
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=${units}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById('loading-spinner').style.display = 'none';

        if (!response.ok) {
            throw new Error(`Error: ${data.message}`);
        }

        const tempUnit = isCelsius ? '°C' : '°F';
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} ${tempUnit}`;
        document.getElementById('description').textContent = `Condition: ${data.weather[0].description}`;
        document.getElementById('icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
        document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;

        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        document.getElementById('sunrise').textContent = `Sunrise: ${sunriseTime}`;
        document.getElementById('sunset').textContent = `Sunset: ${sunsetTime}`;

        updateBackground(data.weather[0].main);
        showMap(data.coord.lat, data.coord.lon);
        getForecast(city);
    } catch (error) {
        document.getElementById('loading-spinner').style.display = 'none';
        console.error('Error fetching the weather data:', error);
        alert(`Could not retrieve weather data: ${error.message}`);
    }
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    const city = document.getElementById('city-name').textContent;
    if (city !== 'City Name') {
        getWeather();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.weather-container').classList.toggle('dark-mode');
}

async function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;

    try {
        const response = await fetch(forecastUrl);
        const forecastData = await response.json();

        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = ''; // Clear previous forecast

        for (let i = 0; i < forecastData.list.length; i += 8) {
            const forecast = forecastData.list[i];
            const forecastElement = document.createElement('div');
            forecastElement.classList.add('forecast-day');
            forecastElement.innerHTML = `
                <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
                <p>${forecast.main.temp} ${isCelsius ? '°C' : '°F'}</p>
                <p>${forecast.weather[0].description}</p>
            `;
            forecastContainer.appendChild(forecastElement);
        }
    } catch (error) {
        console.error('Error fetching the forecast data:', error);
        alert(`Could not retrieve forecast data: ${error.message}`);
    }
}

function showMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup('Location of weather')
        .openPopup();
}

function updateBackground(condition) {
    const weatherCondition = condition.toLowerCase();

    if (weatherCondition.includes('cloud')) {
        document.body.style.backgroundImage = "url('cloudy.jpg')";
    } else if (weatherCondition.includes('rain')) {
        document.body.style.backgroundImage = "url('rainy.jpg')";
    } else if (weatherCondition.includes('sunny') || weatherCondition.includes('clear')) {
        document.body.style.backgroundImage = "url('sunny.jpg')";
    } else {
        document.body.style.backgroundColor = "#f0f8ff";
    }
}
