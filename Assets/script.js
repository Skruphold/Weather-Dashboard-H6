var searchInput = $('#search-input');
var searchBtn = $('#search-city-btn');
var searchHistory = $('#search-history');
var currentCity = $('#current-city');
var currentTemp = $('#current-temp');
var currentHumidity = $('#current-humidity');
var currentWind = $('#current-wind-speed');
var UVindex = $('#uv-index');
var weatherContent = $('#weather-content');
var APIkey = "e4263641413f8c342d1e4be83dc88bb7";
var currentDate = moment().format('L');
$('#current-date').text("("+ currentDate +")");

searchBtn.on("click", function(event){
    event.preventDefault();
    var searchValue = searchInput.val().trim();
    weatherConditionsreq(searchValue);
    searchInput.val("");
})

function weatherConditionsreq(searchValue) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
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

                $('#five-day').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardbody);
                forecastCardbody.append(forecastIcon);
                forecastCardbody.append(forecastTemp);
                forecastCardbody.append(forecastHum);
                forecastCardbody.append(forecastWind);

                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main);
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
        })
        
    })
}