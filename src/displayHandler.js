let unitValue;
export default function display(data, unit) {
  console.log(data);
  if (unit === "metric") {
    unitValue = "°C";
  } else {
    unitValue = "°F";
  }
  current(data, unitValue);
}

const cityName = document.querySelector(".city-name");
const address = document.querySelector(".extra-address");
const time = document.querySelector(".time");
const condition = document.querySelector(".curr-cond");
const icon = document.querySelector(".curr-icon");
const currTemp = document.querySelector(".curr-temp");
const humid = document.querySelector(".humid-value");
const feels = document.querySelector(".feels-value");
const precip = document.querySelector(".precip-value");

const dayCont = document.querySelector(".days-cont");

function current(data) {
  let addressArray = data.currCont.address.split(", ");
  cityName.textContent = addressArray.splice(0, 1);
  address.textContent = addressArray.join(", ");
  time.textContent = data.currCont.time;
  condition.textContent = data.currCont.condition;
  currTemp.innerHTML = `${data.currCont.temp}<span>${unitValue}</span>`;
  humid.textContent = data.currCont.humidity;
  feels.textContent = data.currCont.feelsLike;
  precip.textContent = data.currCont.precipProb;
  let dayArray = document.querySelectorAll(".days");
  dayArray.forEach((item) => item.remove());
  data.day.forEach((item) => {
    let days = document.createElement("div");
    days.className = "days";
    days.innerHTML = `<img src="./assets/clear-day(1).svg" alt="" />
            <p class="date">${item.date}</p>
            <p class="temp-name">Temperature ${unitValue}</p>
            <div class="temp-cont">
              <p>${item.tempMax}</p>
              <p>${item.temp}</p>
              <p>${item.tempMin}</p>
            </div>`;
    console.log(dayCont);
    dayCont.appendChild(days);
  });
}
