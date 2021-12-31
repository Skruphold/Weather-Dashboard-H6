var searchInput = $('#search-input');
var searchBtn = $('#search-city-btn');
var searchHistory = $('#search-history');
var currentCity = $('#current-city');
var currentTemp = $('#current-temp');
var currentHumidity = $('#current-humidity');
var currentWind = $('#current-wind-speed');
var UVindex = $('#uv-index');
var weatherContent = $('#weather-content');
var cityArray = [];

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
    })
}