async function requestData(city, unit) {
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=ZPDPTC7QZ2D6VPK7NFH2EMAB2`,
      {
        mode: "cors",
      },
    );
    if (response.status === 400) {
      throw new Error("City Not Found");
    }
    if (!response.ok) {
      throw new Error("There has been an error, please try again later");
      //mdn told me to do this idk
    }
    let data = await response.json();
    return data;
  } catch (err) {
    throw new Error("There has been an error, Please try again later", {
      cause: err,
    });
  }
}

function sortData(data) {
  let currCont = {
    address: data.resolvedAddress,
    time: data.currentConditions.datetime,
    icon: data.currentConditions.icon,
    condition: data.currentConditions.conditions,
    temp: data.currentConditions.temp,
    humidity: data.currentConditions.humidity,
    feelsLike: data.currentConditions.feelslike,
    precipProb: data.currentConditions.precipprob,
  };

  let day = [];
  data.days.forEach((item) => {
    day.push({
      date: item.datetime,
      icon: item.icon,
      temp: item.temp,
      tempMax: item.tempmax,
      tempMin: item.tempmin,
    });
  });

  return { currCont, day };
}

export { requestData, sortData };
