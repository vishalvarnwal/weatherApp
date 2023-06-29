const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variable need?
let currentTab = userTab;
const API_KEY = "c5ef1cfa9324cc15b3717e9f7d447ae1";
currentTab.classList.add("current-tab");

//one more pending work??
getfromSessionStorage();

const switchTab = (clickedTab) => {
  if (clickedTab !== currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //search form container invisible?? if yes, make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //is your weather invisible?? if yes, make it visible
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();
    }
  }
};

userTab.addEventListener("click", () => {
  //pass clicked tab as an Input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //pass clicked tab as an Input parameter
  switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");
  // API CALL
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
  }
}

const renderWeatherInfo = (weatherInfo) => {
  //firstly fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temperature = document.querySelector("[data-temperature]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${(weatherInfo?.sys?.country).toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp}°C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("no geolocation support available");
  }
};

const showPosition = (position) => {
  const userCoordinate = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinate));
  fetchUserWeatherInfo(userCoordinate);
};

grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  console.log(cityName, "city");
  if (cityName.trim() === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});

const fetchSearchWeatherInfo = async (city) => {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    // https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    const data = await res.json();
    console.log(data, "***");
    loadingScreen.classList.remove("active");
    renderWeatherInfo(data);
    userInfoContainer.classList.add("active");
  } catch (error) {
    loadingScreen.classList.remove("active");
  }
};
