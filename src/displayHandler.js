let unitValue;
function display(data, unit, iconSet) {
  console.log(data);
  if (unit === "metric") {
    unitValue = "°C";
  } else {
    unitValue = "°F";
  }
  current(data, unitValue, iconSet);
  displayDay(data, unitValue, iconSet);
}

const cityName = document.querySelector(".city-name");
const address = document.querySelector(".extra-address");
const time = document.querySelector(".time");
const condition = document.querySelector(".curr-cond");
const iconIMG = document.querySelector(".curr-icon>img");
const currTemp = document.querySelector(".curr-temp");
const humid = document.querySelector(".humid-value");
const feels = document.querySelector(".feels-value");
const precip = document.querySelector(".precip-value");

const dayCont = document.querySelector(".days-cont");

const dialog = document.querySelector(".dialog");

function current(data, unitValue, iconSet) {
  let addressArray = data.currCont.address.split(", ");
  cityName.textContent = addressArray.splice(0, 1);
  address.textContent = addressArray.join(", ");
  time.textContent = data.currCont.time;
  condition.textContent = data.currCont.condition;
  currTemp.innerHTML = `${data.currCont.temp}<span>${unitValue}</span>`;
  humid.textContent = data.currCont.humidity;
  feels.textContent = data.currCont.feelsLike;
  precip.textContent = data.currCont.precipProb;
  iconIMG.src = iconSet[data.currCont.icon];
}

function displayDay(data, unitValue, iconSet) {
  let dayArray = document.querySelectorAll(".days");
  dayArray.forEach((item) => item.remove());
  data.day.forEach((item) => {
    let days = document.createElement("div");
    days.className = "days";
    days.innerHTML = `<img src="" alt="" />
            <p class="date">${item.date}</p>
            <p class="temp-name">Temperature ${unitValue}</p>
            <div class="temp-cont">
              <p>${item.tempMax}</p>
              <p>${item.temp}</p>
              <p>${item.tempMin}</p>
            </div>`;
    dayCont.appendChild(days);
    let icon = days.querySelector("img");
    icon.src = iconSet[item.icon];
  });
}

function loadDown() {
  dayCont.scrollTop = dayCont.scrollHeight;
}
function loadTop() {
  dayCont.scrollTop = 0;
}

function errorDisplay(errorMessage) {
  dialog.textContent = errorMessage;
  dialog.classList.toggle("dialog-show");
  setTimeout(() => dialog.classList.toggle("dialog-show"), 5000);
}
export { display, loadDown, loadTop, errorDisplay };
