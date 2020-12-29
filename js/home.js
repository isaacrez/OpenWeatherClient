
var APIKey = "78caea59c91a7db4d28883099674f1c2";
var units = 'imperial';
var zip = '44311';

function urlCall(baseUrl) {
    return baseUrl + 'zip=' + zip + '&appid=' + APIKey + '&units=' + units;
}

function updateCurrentWeather(data) {
    $('#conditionsIn').text('Current Conditions in ' + data.name);
    $('#conditionImg').attr('src', getIconSrc(data));
    $('#conditionDisplay').text(data.weather[0].main + ': ' + data.weather[0].description);

    $('#tempDisplay').text('Temperature: ' + data.main.temp + getTempUnits());
    $('#humidDisplay').text('Humidity: ' + data.main.humidity + '%');
    $('#windDisplay').text('Wind: ' + data.wind.speed + ' ' + getSpeedUnits());
}

function addForecastEntry(data, dayOffset) {
    var entry = '<div class="col d-flex flex-column align-items-center">';
        entry += '<p><b>' + getDate(dayOffset) + '</b></p>';
        entry += '<div class="row align-items-center">';
            entry += '<img src="' + getIconSrc(data) + '" />';
            entry += '<p>' + data.weather[0].main + '</p>';
        entry += '</div>';
        entry += '<p class="mb-0"><b>[H]</b> ' + data.main.temp_max + ' ' + getTempUnits() + '</p>';
        entry += '<p><b>[L]</b> ' + data.main.temp_min + ' ' + getTempUnits() + '</p>';
    entry += '</div>';

    $('#forecastData').append(entry);
}

function getDate(dayOffset) {    
    var d = new Date();
    d.setDate(d.getDate() + dayOffset);

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (d.getDate()) + ' ' + months[d.getMonth()];
}

function getIconSrc(data) {
    return 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
}

function getTempUnits() {
    return units === 'imperial' ? '°F' : '°C';
}

function getSpeedUnits() {
    return units === 'imperial' ? 'mi/hr' : 'm/s';
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
            $('#forecastData').empty();
            for (var i = 7; i < data.cnt; i += 8) {
                var day = (i + 1) / 8;
                addForecastEntry(data.list[i], day);
            }
        },
        
        error: function() {
            console.log(status);
        }
    })
});
