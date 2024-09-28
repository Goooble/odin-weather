async function requestData(city, unit) {
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=ZPDPTC7QZ2D6VPK7NFH2EMAB2`,
      {
        mode: "cors",
      },
    );
    if (response.status === 400) {
      throw new Error("Not found");
    }
    if (!response.ok) {
      throw new Error("Some Random error");
      //mdn told me to do this idk
    }
    let data = await response.json();
    return data;
  } catch (err) {
    throw new Error("error", { cause: err });
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
      humidity: item.humidity,
      feelsLike: item.feelslike,
      precipProb: item.precipprob,
    });
  });

  return { currCont, day };
}

export { requestData, sortData };
