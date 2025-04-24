const tabYourWeather = document.querySelector("[data-tab='your-weather']");
const tabSearchWeather = document.querySelector("[data-tab='search-weather']");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_KEY = "69edf24e2afea219f37534e40cc3253b";

// Toggle Tabs
tabYourWeather.addEventListener("click", () => switchTab("your-weather"));
tabSearchWeather.addEventListener("click", () => switchTab("search-weather"));

function switchTab(tab) {
  if (tab === "your-weather") {
    tabSearchWeather.classList.remove("current-tab");
    tabYourWeather.classList.add("current-tab");
    searchForm.classList.remove("active");
    getLocation();
  } else {
    tabYourWeather.classList.remove("current-tab");
    tabSearchWeather.classList.add("current-tab");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    searchForm.classList.add("active");
  }
}

// Geolocation
document.querySelector(".grant-access-btn").addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeatherByCoords, (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("Please allow location access to get weather data.");
      } else {
        alert("Failed to get geolocation.");
      }
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

async function showWeatherByCoords(position) {
  const { latitude, longitude } = position.coords;
  showLoading();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch weather data.");
    }

    const data = await response.json();
    showWeather(data);
  } catch (err) {
    alert(err.message || "Failed to fetch weather data.");
  }
}

// City Search
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = searchForm.querySelector("input").value;
  if (!city) return;
  showLoading();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("City not found.");
    }

    const data = await response.json();
    showWeather(data);
  } catch (err) {
    alert(err.message || "City not found.");
  }
});

function showLoading() {
  grantAccessContainer.classList.remove("active");
  userInfoContainer.classList.remove("active");
  loadingScreen.classList.add("active");
}

function showWeather(data) {
  loadingScreen.classList.remove("active");
  userInfoContainer.classList.add("active");

  document.querySelector("[data-city]").textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector("[data-temp]").textContent = `${Math.round(data.main.temp)}°C`;
  document.querySelector("[data-windspeed]").textContent = `${data.wind.speed} m/s`;
  document.querySelector("[data-humidity]").textContent = `${data.main.humidity}%`;
  document.querySelector("[data-clouds]").textContent = `${data.clouds.all}%`;

  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

