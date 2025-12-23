// Weather Scout powered by OpenWeather
const API_KEY = '0657dcff6652fa0c71a4c9426964c305';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const els = {
	form: document.getElementById('searchForm'),
	input: document.getElementById('cityInput'),
	status: document.getElementById('status'),
	location: document.getElementById('location'),
	updated: document.getElementById('updated'),
	temp: document.getElementById('temperature'),
	desc: document.getElementById('description'),
	feels: document.getElementById('feelsLike'),
	wind: document.getElementById('wind'),
	humidity: document.getElementById('humidity'),
	forecastGrid: document.getElementById('forecastGrid'),
	themeToggle: document.getElementById('themeToggle'),
	forecastHint: document.getElementById('forecastHint')
};

const DEFAULT_CITY = 'New York';

function setStatus(message, isError = false) {
	els.status.textContent = message || '';
	els.status.style.color = isError ? '#dc2626' : 'var(--muted)';
}

function formatTemp(value) {
	return `${Math.round(value)}°C`;
}

function formatWind(valueMs) {
	const kmh = valueMs * 3.6;
	return `${kmh.toFixed(1)} km/h`;
}

async function fetchWeather(city) {
	const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error('City not found or API error');
	}
	return res.json();
}

async function fetchForecast(city) {
	const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error('Unable to load forecast');
	}
	return res.json();
}

function renderCurrent(data) {
	els.location.textContent = `${data.name}, ${data.sys.country}`;
	els.updated.textContent = `Updated ${new Date(data.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
	els.temp.textContent = Math.round(data.main.temp) + '°';
	els.desc.textContent = data.weather?.[0]?.description ?? '—';
	els.feels.textContent = formatTemp(data.main.feels_like);
	els.wind.textContent = formatWind(data.wind.speed);
	els.humidity.textContent = `${data.main.humidity}%`;
}

function pickMiddayForecast(list) {
	const noonSlots = list.filter(item => item.dt_txt.includes('12:00:00'));
	if (noonSlots.length >= 5) return noonSlots.slice(0, 5);
	const every8th = [];
	for (let i = 7; i < list.length && every8th.length < 5; i += 8) {
		every8th.push(list[i]);
	}
	return every8th.length ? every8th : list.slice(0, 5);
}

function renderForecast(data) {
	els.forecastGrid.innerHTML = '';
	const days = pickMiddayForecast(data.list);
	days.forEach(item => {
		const date = new Date(item.dt * 1000);
		const day = date.toLocaleDateString(undefined, { weekday: 'short' });
		const fullDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
		const card = document.createElement('div');
		card.className = 'day-card';
		card.innerHTML = `
			<h3>${day}</h3>
			<p class="day-meta">${fullDate} · ${item.weather?.[0]?.main ?? ''}</p>
			<p class="temp">${Math.round(item.main.temp)}°</p>
			<p class="day-meta">Feels ${Math.round(item.main.feels_like)}° · ${item.main.humidity}% humidity</p>
		`;
		els.forecastGrid.appendChild(card);
	});
}

async function loadCity(city) {
	const trimmed = city.trim();
	if (!trimmed) {
		setStatus('Type a city to search.', true);
		return;
	}
	if (API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
		setStatus('Add your OpenWeather API key in script.js.', true);
		return;
	}
	setStatus('Loading...');
	try {
		const [current, forecast] = await Promise.all([
			fetchWeather(trimmed),
			fetchForecast(trimmed)
		]);
		renderCurrent(current);
		renderForecast(forecast);
		setStatus(`Showing weather for ${current.name}`);
		localStorage.setItem('ws:lastCity', current.name);
	} catch (err) {
		console.error(err);
		setStatus(err.message || 'Unable to load weather.', true);
	}
}

function initTheme() {
	const saved = localStorage.getItem('ws:theme');
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const theme = saved || (prefersDark ? 'dark' : 'light');
	applyTheme(theme);
	els.themeToggle.checked = theme === 'dark';
}

function applyTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('ws:theme', theme);
}

function bindEvents() {
	els.form.addEventListener('submit', evt => {
		evt.preventDefault();
		loadCity(els.input.value);
	});

	els.themeToggle.addEventListener('change', () => {
		applyTheme(els.themeToggle.checked ? 'dark' : 'light');
	});
}

function bootstrap() {
	initTheme();
	bindEvents();
	const lastCity = localStorage.getItem('ws:lastCity') || DEFAULT_CITY;
	els.input.value = lastCity;
	loadCity(lastCity);
}

document.addEventListener('DOMContentLoaded', bootstrap);
