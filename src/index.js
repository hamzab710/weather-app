import { intlFormat } from "date-fns";

let input = document.querySelector("input[type=search]");
const submit = document.querySelector(".submit");

const content = document.getElementById("content");

const city = document.getElementById("city");
const sky = document.getElementById("sky");
const time = document.getElementById("time");
const temp = document.getElementById("temp");
const speed = document.getElementById("speed");
const degree = document.getElementById("degree");
const direction = document.getElementById("direction");
const humidity = document.getElementById("humidity");

const unit = document.querySelector("input[type=checkbox]");

const backgroundContainer = document.getElementById("backgroundContainer");
const errorHandler = document.getElementById("error-message");

let data;
async function getWeather(value) {
  try {
    const resp = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=604fbfb1a0ef42cba85103545232711&q=${value}`,
    );
    data = await resp.json();
    showWeather();
    handleTemp();
    handleBackground();
    handleOpacity();
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      errorHandler.textContent = "Network error. Please check your connection.";
    } else {
      errorHandler.textContent = "No matching location found";
    }
  }
}

function showWeather() {
  city.textContent = `${data.location.name}, ${data.location.country}`;
  sky.src = "https:" + data.current.condition.icon;
  time.textContent = intlFormat(new Date(data.location.localtime), {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  speed.textContent = `Wind speed: ${data.current.wind_kph} kph`;
  degree.textContent = `Wind degree: ${data.current.wind_degree}°`;
  direction.textContent = `Wind direction: ${data.current.wind_dir}`;
  humidity.textContent = `Humidity: ${data.current.humidity}%`;
  errorHandler.textContent = "";
}

function handleTemp() {
  if (unit.checked) {
    temp.textContent = `${data.current.temp_f} F°`;
  } else {
    temp.textContent = `${data.current.temp_c} C°`;
  }
}

function handleOpacity() {
  backgroundContainer.style.opacity = 0;
  content.style.opacity = 0;

  const transitionEndHandler = () => {
    backgroundContainer.removeEventListener(
      "transitionend",
      transitionEndHandler,
    );
    backgroundContainer.style.transition = "";
    content.style.transition = "";
    backgroundContainer.style.opacity = 1;
    content.style.opacity = 1;
  };

  backgroundContainer.addEventListener("transitionend", transitionEndHandler);
  backgroundContainer.offsetHeight; // Trigger reflow
  content.offsetHeight; // Trigger reflow

  backgroundContainer.style.transition = "opacity 0.5s";
  content.style.transition = "opacity 0.5s";
  backgroundContainer.style.opacity = 1;
  content.style.opacity = 1;
}

function handleBackground() {
  const weatherCodes = {
    clear: [1000],
    cloudy: [1003, 1006, 1009, 1030, 1063, 1066, 1069, 1072, 1087, 1135, 1150],
    rainy: [
      1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240,
      1243, 1246, 1273, 1276,
    ],
    snowy: [
      1114, 1117, 1147, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237,
      1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282,
    ],
  };

  const currentCode = data.current.condition.code;
  const foundWeather = Object.entries(weatherCodes).find(([_, codes]) =>
    codes.includes(currentCode),
  );

  if (foundWeather) {
    if (data.current.is_day) {
      const [weather, _] = foundWeather;
      const imageUrl = `./images/${weather}-day.jpg`;
      backgroundContainer.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${imageUrl})`;
    } else {
      const [weather, _] = foundWeather;
      const imageUrl = `./images/${weather}-night.jpg`;
      backgroundContainer.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${imageUrl})`;
    }
  } else {
    backgroundContainer.style.backgroundImage = "none";
  }
}

submit.addEventListener("click", () => {
  getWeather(input.value);
});

unit.addEventListener("change", handleTemp);

getWeather("agadir");
