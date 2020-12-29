
var APIKey = "78caea59c91a7db4d28883099674f1c2";
var units = 'imperial';
var zip = '44311';

function urlCall(baseUrl) {
    return baseUrl + 'zip=' + zip + '&appid=' + APIKey + '&units=' + units;
}

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: urlCall('http://api.openweathermap.org/data/2.5/weather?'),
        
        success: function(data) {
            $('#conditionsIn').text('Current Conditions in ' + data.name);
            $('#conditionImg').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
            $('#conditionDisplay').text(data.weather[0].main + ': ' + data.weather[0].description);
            
            if (units === 'imperial') {
                $('#tempDisplay').text('Temperature: ' + data.main.temp + '°F');
                $('#windDisplay').text('Wind: ' + data.wind.speed + ' mi/hr');
            } else if (units === 'metric') {
                $('#tempDisplay').text('Temperature: ' + data.main.temp + '°C');
                $('#windDisplay').text('Wind: ' + data.wind.speed + '  m/s');
            }
            $('#humidDisplay').text(data.main.humidity + '%');
        },
        
        error: function(xhr, status, error) {
            console.log(status);
        }
    });
});
