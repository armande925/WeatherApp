// establish the timezone where user is access the app in order to display the correct time.
// populate the correct background to coincide with the time of day in the users timezone
// display current temperature for the area of the user based off geocode location
// provide text area for user to input the weather region they are looking for
// display current temperature, current humidity, windspeed, UV Index and 5 day forecast
// create icon to display the current weather status
// add google places api to populate guestimate of what area user is searching for
// store results in local storage and append them to area provided for previoius searches

var searchHistory = JSON.parse(localStorage.getItem('searchItems'))||[];

if (searchHistory.length > 0){
    for (let i = 0; i < searchHistory.length; i++) {
        $('#history').append(`<button class="searchResults">${searchHistory[i]}</button>`);
        
    }
}
$('#history').on("click",".searchResults" ,function(event){
    // event.preventDefault()
    console.log("on.")
    var searchText = $(this).text()
    console.log(searchText)
    weatherForecast(searchText)
});

$('#search').on('click',function(event){
event.preventDefault()
let searchText = $('#locationText').val()
searchHistory.push(searchText)
console.log(searchHistory);
localStorage.setItem('searchItems', JSON.stringify(searchHistory))
weatherForecast(searchText)
})

function weatherForecast(searchText) {
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=a126d7e96a0d4ee2f269cafd5b34ca51&units=imperial`
    $("#currentWeather").empty()
    $('#forecast').empty()
    $.ajax({
    type:'GET',
    url:url
})
.then(function(data){
    console.log(data)
    $('#currentWeather').append(`
    <h3>${Date()}</h3>
    <h2>${data.name}</h2>
    <p>${Math.floor(data.main.temp)}°F AVG, ${Math.floor(data.main.temp_min)}°F LOW, ${Math.floor(data.main.temp_max)}°F HI</p>
    <p>${data.main.humidity}% HUMIDITY</p>
    <p>${Math.floor(data.wind.speed)}MPH WIND SPEED</p>

    `)
})
let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchText}&APPID=a126d7e96a0d4ee2f269cafd5b34ca51&units=imperial`
$.ajax({
    type:'GET',
    url:queryUrl
})
.then(function(data){
    console.log(data)
    for (let i = 0; i < data.list.length; i=i+8){
        $('#forecast').append(
            `<div class="forecast">
            <h3>${data.list[i].dt_txt.split(' ')[0]}</h3>
            <p>${Math.floor(data.list[i].main.temp)}°F</p>
            <img src='http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png'/>
            <p>${data.list[i].main.humidity}%</p>
            

            </div>
            `
        )
    }
})
}

$("#clearButton").on("click", function(){
    localStorage.removeItem("searchItems")
    location.reload("/")
})