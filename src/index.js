import "./reset.css";
import "./styles.css";

import clearDay from "./assets/clear-day.svg";
import clearNight from "./assets/clear-night.svg";
import cloudy from "./assets/cloudy.svg";
import fog from "./assets/fog.svg";
import partlyDay from "./assets/partly-cloudy-day.svg";
import partlyNight from "./assets/partly-cloudy-night.svg";
import rain from "./assets/rain.svg";
import snow from "./assets/snow.svg";
import wind from "./assets/wind.svg";

import { requestData, sortData } from "./APIHandler";
import { display, loadDown, loadTop, errorDisplay } from "./displayHandler";
const searchBox = document.querySelector("input");
const searchBut = document.querySelector(".search-but");
const flipUnit = document.querySelector(".flip-unit");

let searchValue;
let unit = "metric";

let iconSet = {
  "clear-day": clearDay,
  "clear-night": clearNight,
  "partly-cloudy-day": partlyDay,
  "partly-cloudy-night": partlyNight,
  cloudy,
  fog,
  rain,
  snow,
  wind,
};

flipUnit.addEventListener("click", async () => {
  if (flipUnit.textContent === "°C") {
    flipUnit.textContent = "°F";
    unit = "us";
  } else {
    flipUnit.textContent = "°C";
    unit = "metric";
  }
  requestDataHandler(); //switching units should fetch new data
});

searchBut.addEventListener("click", () => {
  searchValue = searchBox.value;
  requestDataHandler();
});

async function requestDataHandler() {
  loadDown();
  await requestData(searchValue, unit)
    .then(sortData)
    .then((data) => display(data, unit, iconSet))
    .catch((error) => {
      if (error.cause.message === "City Not Found") {
        errorDisplay(error.cause.message);
      } else {
        errorDisplay(error.message);
      }
    });
  loadTop();
}
