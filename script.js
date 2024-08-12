const apiKey = '2dea5a229b6434068b79023b7a5aa14e'; // Replace with your API key
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
    } catch (error) {
        console.error('Error fetching the weather data:', error);
        alert(`Could not retrieve weather data: ${error.message}`);
    }
}
