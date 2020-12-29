
var APIKey = "78caea59c91a7db4d28883099674f1c2";
var units = 'imperial';
var zip = '44311';

function urlCall(baseUrl) {
    return baseUrl + 'zip=' + zip + '&appid=' + APIKey + '&units=' + units;
}

function updateCurrentWeather(data) {
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
    $('#humidDisplay').text('Humidity: ' + data.main.humidity + '%');
}

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: urlCall('http://api.openweathermap.org/data/2.5/weather?'),
        
        success: function(data) {
            updateCurrentWeather(data);
        },
        
        error: function(xhr, status, error) {
            console.log(status);
        }
    });
    
    $.ajax({
        type: 'GET',
        url: urlCall('http://api.openweathermap.org/data/2.5/forecast?'),
        
        success: function(data) {
            console.log('Received forecast data!');
            var d = new Date();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            for (var i = 0; i < data.cnt; i += 8) {
                console.log('Adding data...');
                var entry = '<div class="col d-flex flex-column align-items-center">';
                entry += '<p>' + d.getDay() + ' ' + months[d.getMonth()] + '</p>';
                entry += '<div class="row">';
                entry += '<img src="http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png" />';
                entry += '<p>' + data.list[i].weather[0].main + '</p>';
                entry += '</div>';
                entry += '<p>H: ' + data.list[i].main.temp_max + '</p>';
                entry += '<p>L: ' + data.list[i].main.temp_min + '</p>';
                entry += '</div>';
                
                $('#forecastData').append(entry);
            }
        },
        
        error: function() {
            console.log(status);
        }
    })
});
