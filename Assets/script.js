var searchInput = $('#search-input');
var searchBtn = $('#search-city-btn');
var searchHistory = $('#search-history');
var currentCity = $('#current-city');
var currentTemp = $('#current-temp');
var currentHumidity = $('#current-humidity');
var currentWind = $('#current-wind-speed');
var currentColor = $('#current-card');
var UVindex = $('#uv-index');
var weatherContent = $('#weather-content');
var APIkey = "e4263641413f8c342d1e4be83dc88bb7";
var currentDate = moment().format('L');
$('#current-date').text("("+ currentDate +")");
var cityList = [];

searchBtn.on("click", function(event){
    event.preventDefault();
    var searchValue = searchInput.val().trim();
    weatherConditionsreq(searchValue);
    cityHistory(searchValue);
    searchInput.val("");
})

function weatherConditionsreq(searchValue) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var bgColor = (response.weather[0].icon)
        if (bgColor === '04d') {
            currentColor.addClass("cloudy");
        }if (bgColor === '02d') {
            currentColor.addClass("partlyCloudy");
        }if (bgColor === '01d') {
            currentColor.addClass("clear");
        }
        currentCity.text(response.name);
        $("#current-date").text("("+ currentDate +")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />")
        currentTemp.text(response.main.temp);
        currentTemp.append(" deg; F");
        currentHumidity.text(response.main.humidity + "%");
        currentWind.text(response.wind.speed + " MPH");
        currentCity.append("<small class='text-muted' id='current-date'> ");
        
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            UVindex.text(response.value);
        })

        var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: forecastUrl,
            method: "GET"
        }).then(function(response){
            console.log(response);
            $('#five-day').empty();
            for( var i = 0; i < response.list.length; i+=8) {
                var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                var forecastCard = $("<div class='card'>");
                var forecastCardbody = $("<div class='card-body'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='card-text mb-0'>");
                var forecastHum = $("<p class='card-text mb-0'>");
                var forecastWind = $("<p class='card-text mb-0'>");
                var forecastDate = $("<h4 class='card-date'>")
                var forecastDates = moment(response.list[i].dt_txt).format("L");
                console.log(forecastDates);
                var forecastColor = (response.list[i].weather[0].icon);
              
                $('#five-day').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardbody);
                forecastCardbody.append(forecastDate);
                forecastCardbody.append(forecastIcon);
                forecastCardbody.append(forecastTemp);
                forecastCardbody.append(forecastHum);
                forecastCardbody.append(forecastWind);

                if (forecastColor === '04d') {
                    forecastCard.addClass("cloudy");
                }if (forecastColor === '02d' ) {
                    forecastCard.addClass("partlyCloudy");
                }if (forecastColor === '01d') {
                    forecastCard.addClass("clear");
                }

                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main);
                forecastDate.text(forecastDates);
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("temp: ");
                forecastTemp.append(" deg; F");
                forecastHum.text(response.list[i].main.humidity);
                forecastHum.prepend("Humidity: ");
                forecastHum.append("%");
                forecastWind.text(response.list[i].wind.speed);
                forecastWind.prepend("Wind Speed: ");
                forecastWind.append(" MPH");
            }
        });
    });
};

function cityHistory(searchValue) {
    if (searchValue) {
        if (cityList.indexOf(searchValue) == -1) {
            cityList.push(searchValue);
            listArr();
            weatherContent.removeClass("hide");
        } else {
            var removeItem = cityList.indexOf(searchValue);
            cityList.splice(removeItem, 1);
            cityList.push(searchValue);
            listArr();
            weatherContent.removeClass("hide");
        }
    }
}

function listArr() {
    searchHistory.empty();
    cityList.forEach(function(city) {
        var cityHistoryitem = $('<li class="list-group-item city-btn">');
        cityHistoryitem.attr("data-value", city);
        cityHistoryitem.text(city);
        searchHistory.prepend(cityHistoryitem)
    });
    localStorage.setItem("cities", JSON.stringify(cityList));
}

function initHistory() {
    if (localStorage.getItem("cities")) {
        cityList = JSON.parse(localStorage.getItem("cities"));
        listArr();
    }
}

searchHistory.on("click","li.city-btn", function() {
    console.log($(this).data("value"));
    var value = $(this).data("value");
    weatherConditionsreq(value);
    cityHistory(value);
})

initHistory();