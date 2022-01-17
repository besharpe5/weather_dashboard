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
        getWeatherInfo(cityName);
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

    checkUvIndex(currentUvIndexEl, UvIndex);
};

// this will check for a low, moderate, or high uv index level
var checkUvIndex = function(currentUvIndexEl, UvIndex) {
    if (UvIndex < 3) {
        $(currentUvIndexEl).removeClass("uv-index-moderate uv-index-high");
        $(currentUvIndexEl).addClass("uv-index-low");
    }
    else if (UvIndex >= 3 && UvIndex < 8) {
        UvIndex.removeClass("uv-index-low uv-index-high");
        UvIndex.addClass("uv-index-moderate");
    }
    else if (UvIndex >= 8) {
        UvIndex.removeClass("uv-index-moderate uv-index-low");
        UvIndex.addClass("uv-index-high");
    }
};

// this will show the 5 day forecast for the selected city
var showForecastResults = function(info) {
    var forecastResultsEl = document.createElement("div");
    var forecastResultsTitle = document.createElement("h5");
    var forecastResultsCardEl = document.createElement("div");
    forecastResultsTitle.textContent = "5-Day Forecast:";
    forecastResultsTitle.setAttribute("class", "mt-3");
    forecastResultsCardEl.classList = "card-deck";
    forecastResultsEl.appendChild(forecastResultsTitle);
    currentWeatherEl.appendChild(forecastResultsEl);
    currentWeatherEl.appendChild(forecastResultsCardEl);

    // for loop for daily forecasts
    for (var i= 1; i < 6; i++) {
        var currentDate = moment(info.daily[i].dt *1000).format("M/DD/YYYY");

        var day = document.createElement("div");
        var dayBody = document.createElement("div");
        var dayDate = document.createElement("h5");
        var dayImage = info.daily[i].weather[0].icon;
        var dayImageEl = document.createElement("span");
        var dayTemperature = document.createElement("p");
        var dayWindMph = document.createElement("p");
        var dayHumidity = document.createElement("p");

        day.classList = "card text-white bg-info mb-3";
        dayBody.classList = "card-body";
        dayDate.classList = "card-title"
        dayDate.textContent = currentDate;
        dayImageEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + dayImage + ".png'>"
        dayTemperature.classList = "card-text";
        dayTemperature.textContent = "Temperature: " + info.daily[i].temp.day + "°F";
        dayWindMph.classList = "card-text";
        dayWindMph.textContent = "Wind Speed: " + info.daily[i].wind_speed + " MPH";
        dayHumidity.classList = "card-text";
        dayHumidity.textContent = "Humidity: " + info.daily[i].humidity + "%";

        dayDate.appendChild(dayImageEl);
        dayBody.append(dayDate, dayTemperature, dayWindMph, dayHumidity);
        day.appendChild(dayBody);
        forecastResultsCardEl.appendChild(day);
    }
};

// this will load recently searched cities
var loadRecentCities = function() {
    var showRecentCities = JSON.parse(window.localStorage.getItem("cities")) || [];

    // this will create buttons for the recently viewed cities
    for (var i = 0; i < showRecentCities.length; i++) {
        var recentCitiesButton = document.createElement("button");
        recentCitiesButton.classList = "btn btn-secondary btn-block mt-2";
        recentCitiesButton.innerText = showRecentCities[i];
        const cityText = showRecentCities[i];
        recentSearchHistoryEl.appendChild(recentCitiesButton);
        recentCitiesButton.addEventListener("click", function() {
            getWeatherInfo(cityText);
        });
    }
};

searchEl.addEventListener("submit", submitHandler);

loadRecentCities();