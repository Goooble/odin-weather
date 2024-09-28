export default function display(data) {
  console.log(data);
  current(data);
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

function current(data) {
  let city = [...data.currCont.address.split(", ")];
  console.log(data.currCont.address);
}
