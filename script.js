const apiKey = '76861849cf6412dfb66cf6504dc92a69'; // Replace with your API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather() {
    const city = document.getElementById('city-input').value;
    if (city === '') return;

    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error: ${data.message}`);
        }

        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
        document.getElementById('description').textContent = `Condition: ${data.weather[0].description}`;
        document.getElementById('icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        updateBackground(data.weather[0].main);

        getForecast(city);
    } catch (error) {
        console.error('Error fetching the weather data:', error);
        alert(`Could not retrieve weather data: ${error.message}`);
    }
}

async function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

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
                <p>${forecast.main.temp} °C</p>
                <p>${forecast.weather[0].description}</p>
            `;
            forecastContainer.appendChild(forecastElement);
        }
    } catch (error) {
        console.error('Error fetching the forecast data:', error);
        alert(`Could not retrieve forecast data: ${error.message}`);
    }
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
        document.body.style.backgroundImage = "url('default.jpg')";
    }
}
