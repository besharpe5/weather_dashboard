var recentSearchHistoryEl = document.querySelector("#recent-searches");
var searchEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var cityInputEl = document.querySelector("#city-input");

// function that gets weather info from the open weather api
var getWeatherInfo = function (cityName) {
  var weatherApi =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=c65a6f2ab2cc702b9d967ad166d77c62";
  fetch(weatherApi)
    .then(function (reply) {
      // this is if the api request went through successfully
      if (reply.ok) {
        reply.json().then(function (cityReply) {
          var latitude = cityReply[0].lat;
          var longitude = cityReply[0].lon;

          var weatherApiLatLon =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            latitude +
            "&lon=" +
            longitude +
            +"&exclude=minutely,hourly,alerts&units=imperial&appid=c65a6f2ab2cc702b9d967ad166d77c62";
          fetch(weatherApiLatLon)
            .then(function (reply) {
              if (reply.ok) {
                reply.json().then(function (info) {
                  showWeatherResults(info, city);
                  showForecastResults(info);
                });
              } else {
                alert("Error: City name not found");
              }
            })
            .catch(function (errorMessage) {
              alert("Error: connection to Open Weather failed");
            });
        });
      } else {
        alert("Error: City name not found");
      }
    })
    .catch(function (errorMessage) {
      alert("Error: connection to Open Weather failed");
    });
};

// uses the form to get info from open weather api
var cities = JSON.parse(window.localStorage.getItem("cities")) || []; 
var submitHandler = function(event) {
    event.preventDefault(); 
    // pulls from input 
    const cityName = cityInputEl.value.trim();

    // this will push city name into cities array. it will also save to the user's local storage
    if (cityName) {
        getCityWeather(cityName);
        cities.push(cityName);
        window.localStorage.setItem("cities", JSON.stringify(cities));
        cityInputEl.value = "";
        // this will add recently searched cities as buttons
        var savedCitySearchesButton = document.createElement("button");
        savedCitySearchesButton.classList = "btn btn-light btn-block mt-2";
        savedCitySearchesButton.setAttribute("type", "submit");
        savedCitySearchesButton.innerText = cityName;
        recentSearchHistoryEl.appendChild(savedCitySearchesButton);
        savedCitySearchesButton.addEventListener("click", function() {
            getCityWeather(cityName);
        });
    }
    else {
        alert("Please type in a city name");
    }
};

// this will show the current weather for the searched city
var showWeather = function(info, city) {
    currentWeatherEl.textContent = "";

    var currentWeather = document.createElement("div");
    var card = document.createElement("div");
    var currentCity = document.createElement("h4");
    var currentDate = moment(info.current.dt *1000).format("M/D/YYYY");
    var weatherImage = info.current.weather[0].icon;
    var weatherImageEl = document.createElement("span");
    var currentTemperature = document.createElement("p");
    var currentWindMph = document.createElement("p");
    var currentHumidity = document.createElement("p");
    var currentUvIndex = document.createElement("p");
    var currentUvIndexEl = document.createElement("div");
    var UvIndex = info.current.uvi;

    currentWeather.setAttribute("class", "card");
    card.setAttribute("class", "card-body");
    currentCity.setAttribute("class", "card-title");
    currentCity.textContent = city + "(" + currentDate +")";
    weatherImageEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + weatherImage + ".png'>"
    currentTemperature.textContent = "Temperature: " + info.current.temp + "°F";
    currentWindMph.textContent = "Wind Speed: " + info.current.wind_speed + " MPH";
    currentHumidity.textContent = "Humidity: " + info.current.humidity + "%";
    currentUvIndex.textContent = "UV Index: ";
    currentUvIndex.classList = "d-flex flex-row";
    currentUvIndexEl.textContent = UvIndex;

    currentUvIndex.appendChild(currentUvIndexEl);
    currentCity.appendChild(weatherImageEl);
    card.append(currentCity, currentTemperature, currentWindMph, currentHumidity, currentUvIndex);
    currentWeather.appendChild(card);
    currentWeatherEl.appendChild(currentWeather);
    
    

}












searchEl.addEventListener("submit", submitHandler);