const API_BASE = 'https://api.waifu.pics';

const SFW_ENDPOINTS = [
	'waifu','neko','shinobu','megumin','bully','cuddle','cry','hug','awoo','kiss','lick','pat','smug','bonk','yeet','blush','smile','wave','highfive','handhold','nom','bite','glomp','slap','kill','kick','happy','wink','poke','dance','cringe'
];

const NSFW_ENDPOINTS = ['waifu','neko','trap','blowjob'];

const els = {
	themeToggle: document.getElementById('themeToggle'),
	categorySearch: document.getElementById('categorySearch'),
	categorySelect: document.getElementById('categorySelect'),
	nsfwToggle: document.getElementById('nsfwToggle'),
	fetchBtn: document.getElementById('fetchBtn'),
	favoriteBtn: document.getElementById('favoriteBtn'),
	copyBtn: document.getElementById('copyBtn'),
	openBtn: document.getElementById('openBtn'),
	clearFavorites: document.getElementById('clearFavorites'),
	status: document.getElementById('status'),
	loader: document.getElementById('loader'),
	img: document.getElementById('preview'),
	source: document.getElementById('source'),
	favoritesGrid: document.getElementById('favoritesGrid')
};

let currentImage = null;
let favorites = [];
let availableCategories = [];

function setStatus(message, isError = false) {
	els.status.textContent = message || '';
	els.status.style.color = isError ? '#dc2626' : 'var(--muted)';
}

function setLoading(isLoading) {
	els.loader.style.display = isLoading ? 'block' : 'none';
	els.img.style.display = isLoading ? 'none' : (els.img.src ? 'block' : 'none');
	els.fetchBtn.disabled = isLoading;
	els.favoriteBtn.disabled = isLoading || !currentImage;
	els.copyBtn.disabled = isLoading || !currentImage;
	els.openBtn.disabled = isLoading || !currentImage;
}

function optionLabel(name, type) {
	const tag = type === 'nsfw' ? 'NSFW' : 'SFW';
	return `${name} (${tag})`;
}

function getOptions(allowNsfw) {
	return [
		...SFW_ENDPOINTS.map(name => ({ type: 'sfw', name })),
		...(allowNsfw ? NSFW_ENDPOINTS.map(name => ({ type: 'nsfw', name })) : [])
	];
}

function populateCategories(filter = '') {
	const allowNsfw = els.nsfwToggle.checked;
	const prev = els.categorySelect.value;
	availableCategories = getOptions(allowNsfw);
	const query = filter.trim().toLowerCase();
	const filtered = query
		? availableCategories.filter(o => optionLabel(o.name, o.type).toLowerCase().includes(query))
		: availableCategories;

	els.categorySelect.innerHTML = '';
	filtered.forEach(({ type, name }) => {
		const opt = document.createElement('option');
		opt.value = `${type}|${name}`;
		opt.textContent = optionLabel(name, type);
		els.categorySelect.appendChild(opt);
	});

	if (filtered.length === 0) {
		setStatus('No categories match that search.', true);
	} else {
		const stillExists = filtered.some(o => `${o.type}|${o.name}` === prev);
		els.categorySelect.value = stillExists ? prev : els.categorySelect.options[0].value;
	}
}

async function fetchImage(type, category) {
	const url = `${API_BASE}/${type}/${category}`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error('API error');
	}
	const data = await res.json();
	if (!data || !data.url) {
		throw new Error('No image returned');
	}
	return data.url;
}

async function handleFetch() {
	const [type, category] = els.categorySelect.value.split('|');
	setLoading(true);
	setStatus('Loading...');
	try {
		const url = await fetchImage(type, category);
		currentImage = { url, type, category };
		els.img.src = url;
		els.img.alt = `${category} (${type})`;
		els.img.onload = () => {
			els.img.style.display = 'block';
		};
		els.source.textContent = `${type.toUpperCase()} / ${category}`;
		setStatus('Loaded');
	} catch (err) {
		console.error(err);
		setStatus(err.message || 'Unable to load image.', true);
	} finally {
		setLoading(false);
	}
}

function loadFavorites() {
	const saved = localStorage.getItem('wp:favorites');
	favorites = saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
	localStorage.setItem('wp:favorites', JSON.stringify(favorites));
}

function renderFavorites() {
	els.favoritesGrid.innerHTML = '';
	if (!favorites.length) {
		els.favoritesGrid.innerHTML = '<p class="muted">No favorites yet.</p>';
		return;
	}
	favorites.forEach((fav, idx) => {
		const card = document.createElement('div');
		card.className = 'fav-card';
		card.innerHTML = `
			<img src="${fav.url}" alt="${fav.category}" />
			<div class="fav-actions">
				<button data-idx="${idx}" data-action="open" class="ghost small">Open</button>
				<button data-idx="${idx}" data-action="remove" class="ghost small">Remove</button>
			</div>
		`;
		els.favoritesGrid.appendChild(card);
	});
}

function addFavorite() {
	if (!currentImage) return;
	const exists = favorites.some(f => f.url === currentImage.url);
	if (exists) {
		setStatus('Already in favorites');
		return;
	}
	favorites.unshift(currentImage);
	saveFavorites();
	renderFavorites();
	setStatus('Saved to favorites');
}

function handleFavoriteAction(evt) {
	const btn = evt.target.closest('button');
	if (!btn) return;
	const idx = Number(btn.dataset.idx);
	const action = btn.dataset.action;
	const fav = favorites[idx];
	if (!fav) return;
	if (action === 'open') {
		window.open(fav.url, '_blank');
	} else if (action === 'remove') {
		favorites.splice(idx, 1);
		saveFavorites();
		renderFavorites();
	}
}

async function copyUrl() {
	if (!currentImage) return;
	try {
		await navigator.clipboard.writeText(currentImage.url);
		setStatus('Copied to clipboard');
	} catch (err) {
		setStatus('Clipboard unavailable', true);
	}
}

function openCurrent() {
	if (!currentImage) return;
	window.open(currentImage.url, '_blank');
}

function clearAllFavorites() {
	favorites = [];
	saveFavorites();
	renderFavorites();
}

function initTheme() {
	const saved = localStorage.getItem('wp:theme');
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const theme = saved || (prefersDark ? 'dark' : 'light');
	applyTheme(theme);
	els.themeToggle.checked = theme === 'dark';
}

function applyTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('wp:theme', theme);
}

function bindEvents() {
	els.themeToggle.addEventListener('change', () => {
		applyTheme(els.themeToggle.checked ? 'dark' : 'light');
	});

	els.nsfwToggle.addEventListener('change', () => {
		populateCategories(els.categorySearch.value);
		setStatus(els.nsfwToggle.checked ? 'NSFW enabled. Content may be adult.' : 'SFW only.');
	});

	els.categorySearch.addEventListener('input', () => {
		populateCategories(els.categorySearch.value);
	});

	els.fetchBtn.addEventListener('click', handleFetch);
	els.favoriteBtn.addEventListener('click', addFavorite);
	els.copyBtn.addEventListener('click', copyUrl);
	els.openBtn.addEventListener('click', openCurrent);
	els.clearFavorites.addEventListener('click', clearAllFavorites);
	els.favoritesGrid.addEventListener('click', handleFavoriteAction);
}

function bootstrap() {
	initTheme();
	loadFavorites();
	renderFavorites();
	populateCategories();
	bindEvents();
	setLoading(false);
	setStatus('Choose a category and fetch');
}

document.addEventListener('DOMContentLoaded', bootstrap);
