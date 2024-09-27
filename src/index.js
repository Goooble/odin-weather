import "./reset.css";
import "./styles.css";
import { requestData, sortData } from "./APIHandler";
const searchBox = document.querySelector("input");
const searchBut = document.querySelector(".search-but");
const flipUnit = document.querySelector(".flip-unit");

let searchValue;
let unit = "metric";

flipUnit.addEventListener("click", async () => {
  if (flipUnit.textContent === "°C") {
    flipUnit.textContent = "°F";
    unit = "us";
  } else {
    flipUnit.textContent = "°C";
    unit = "metric";
  }
  requestDataHandler();
});

searchBut.addEventListener("click", () => {
  searchValue = searchBox.value;
  requestDataHandler();
});

function requestDataHandler() {
  requestData(searchValue, unit)
    .then(sortData)
    .then((data) => console.log(data))
    .catch((error) => {
      if (error.cause.message === "Not found") {
        console.log(`${error.cause.message}: Displayed`);
      }
    });
}
