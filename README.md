# ELEC3 Final Project - Web Applications Suite

A collection of four responsive web applications built with vanilla HTML, CSS, and JavaScript. This suite includes a calculator, stopwatch, Waifu.pics API integration, and weather API integration.

---

## 📋 Projects Overview

### 1. Calculator

#### Project Description
A fully functional calculator application that performs basic arithmetic operations. Users can input numbers, perform calculations (addition, subtraction, multiplication, division), and view results in real-time.

**Key Features:**
- Basic arithmetic operations (+, -, ×, ÷)
- Clear and delete functionality
- Real-time calculation display
- Responsive design for all devices
- Keyboard support (numbers, operators, Enter)

**Problem Solved:** Provides a quick, accessible calculator for basic mathematical computations without leaving the browser.

#### Instructions to Run
1. Open the project folder: `calculator/`
2. Open `index.html` in your web browser
3. Start performing calculations by clicking buttons or using your keyboard

---

### 2. Stopwatch

#### Project Description
A precise stopwatch application with start, stop, and reset controls. Users can track elapsed time in hours, minutes, seconds, and centiseconds.

**Key Features:**
- Start/Stop/Reset functionality
- High-precision time tracking (hours, minutes, seconds, centiseconds)
- Clean, minimalist UI
- Responsive design
- Keyboard shortcuts (Space to toggle, R to reset)

**Problem Solved:** Provides a simple, accessible timer for tracking workout sessions, cooking time, or any timed activities.

#### Instructions to Run
1. Open the project folder: `stopwatch/`
2. Open `index.html` in your web browser
3. Click "Start" to begin timing
4. Click "Stop" to pause
5. Click "Reset" to clear the timer

---

### 3. Waifu Pics API

#### Project Description
An anime image browser powered by the Waifu.pics API. Users can browse SFW and NSFW categories (if enabled), fetch images, copy/open URLs, and save favorites locally.

**Key Features:**
- Category selection with SFW/NSFW toggle
- Search filter for categories
- Instant image fetch with loader
- Copy image URL and open in new tab
- Favorites grid with local persistence
- Dark and light mode support
- Status messages and error handling

**Problem Solved:** Provides a fun, quick way to discover and save anime images across curated categories.

#### API Details Used

| Detail | Information |
|--------|-------------|
| **API Name** | Waifu.pics API |
| **Base URL** | `https://api.waifu.pics` |
| **Endpoints** | `GET /{type}/{category}` (e.g., `/sfw/waifu`, `/nsfw/neko`) |
| **Required Parameters** | `type` (`sfw` or `nsfw`), `category` (e.g., `waifu`, `neko`, `hug`, etc.) |
| **Authentication** | None (Public API) |
| **API Usage** | Fetches an image URL (`data.url`) for the selected category and type |

**How API Data is Used:**
- Requests are sent to Waifu.pics with the selected `type` and `category`
- The response is parsed and the image URL is displayed
- Favorites are stored in `localStorage` and rendered in a grid
- NSFW toggle updates available categories and shows a caution message
- Robust error handling for invalid categories or network issues

#### Instructions to Run
1. Open the project folder: `waifu-pics/`
2. Open `index.html` in your web browser
3. (Optional) Toggle NSFW for adult categories
4. Select a category and click "Fetch"
5. Copy or open the image URL, and add favorites
6. Toggle between light and dark modes

#### Screenshot References
- Category selector, search filter, and loader
- Image preview with source tag
- Favorites grid with open/remove actions
- Dark and light mode views
- NSFW warning state

---

### 4. Weather App

#### Project Description
A real-time weather application that provides current weather conditions and a forecast summary for any location worldwide.

**Key Features:**
- Current weather display
- Temperature, humidity, wind speed
- 5-card forecast summary (midday slots)
- Responsive location-based search
- Dark mode and light mode support

**Problem Solved:** Provides up-to-date weather information for trip planning, outfit selection, and daily activities.

#### API Details Used

| Detail | Information |
|--------|-------------|
| **API Name** | OpenWeatherMap API |
| **Base URL** | `https://api.openweathermap.org/data/2.5` |
| **Endpoints** | `GET /weather?q={city}&units=metric&appid={API_KEY}`, `GET /forecast?q={city}&units=metric&appid={API_KEY}` |
| **Required Parameters** | `q` (city name), `appid` (API key), `units` (e.g., `metric`) |
| **Authentication** | API Key required |
| **API Usage** | Fetches real-time weather data and short-term forecast, displayed in a clean, readable format |

**How API Data is Used:**
- User enters a city name and submits
- Requests to `/weather` and `/forecast` are sent in parallel
- Current conditions and forecast are rendered with helpful formatting
- Theme and last searched city are persisted in `localStorage`

#### Instructions to Run
1. Open the project folder: `weather-app/`
2. Open `index.html` in your web browser
3. Enter a city name in the search field
4. Click "Search" to retrieve weather data
5. View current conditions and forecast
6. Toggle between light and dark modes

#### Screenshot References
- Weather search interface
- Current weather display with temperature and conditions
- Forecast cards with day labels
- Dark and light mode views
- Error handling for invalid locations

---

## 🚀 General Setup Instructions

### Required Tools
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code, Sublime Text, etc.) — optional for viewing source code
- Internet connection (required for API projects)

### How to Access Projects
1. Clone or download the entire `final-project-elec3` folder
2. Navigate to the desired project subfolder
3. Double-click `index.html` to open in your default browser, or
4. Right-click `index.html` → Open with → Select your browser

### API Key Setup (Weather App)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Generate a free API key
3. In `weather-app/script.js`, set `API_KEY` to your key
4. Save and refresh the page

### Local Development Server (Optional)
For better testing with APIs:

```bash
# Using Python 3
python -m http.server 8000
```

---

## 📁 Project Structure

```
final-project-elec3/
├── calculator/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── waifu-pics/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── stopwatch/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── weather-app/
    ├── index.html
    ├── script.js
    └── style.css

---

## 👩‍💻 Developer Information

| Aspect | Details |
|--------|---------|
| **Developer Name** | Miko S. Catacutan |
| **Role** | Developer |
| **Project Type** | ELEC3 Final Project |

### Responsibilities
- ✅ **API Integration** — Implemented REST API calls using `async/await` and Fetch API
- ✅ **JavaScript Logic & Data Processing** — Input validation, error handling, DOM manipulation
- ✅ **UI & CSS Design** — Responsive, modern interfaces; dark/light mode where applicable
- ✅ **Testing & Debugging** — Ensured functionality across common browsers and devices
- ✅ **Documentation** — Comprehensive README and inline code comments

---

## 🎨 Design Features

Across the suite (where applicable):
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Dark & Light Mode** — Theme toggles in Waifu Pics and Weather App
- **Modern UI** — Powder pink accents and smooth animations
- **Accessibility** — ARIA labels and semantic HTML
- **Error Handling** — User-friendly error messages
- **Loading States** — Visual feedback during API calls

---

## 🔧 Technologies Used

- **HTML5** — Semantic markup structure
- **CSS3** — Responsive design, flexbox, CSS variables
- **JavaScript (ES6+)** — `async/await`, Fetch API, DOM manipulation
- **Third-Party APIs** — Waifu.pics API, OpenWeatherMap API

---

## 📝 Notes

- All projects use vanilla JavaScript (no frameworks)
- APIs are accessed via HTTPS for security
- Local storage is used for theme preference and favorites persistence (where applicable)
- Input validation and status feedback improve user experience

---

## 📄 License

This project is created for educational purposes as part of ELEC3 coursework.

---

**Last Updated:** December 23, 2025

For questions or feedback, please review the individual project source files included in each folder.
