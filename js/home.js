
var APIKey = "Add Your Own Here :)";
var units = 'imperial';
var zip = '44311';

$(document).ready(function () {
    hideWeatherDataDisplay();
    $('#getWeatherBtn').click(function() {
        updateWeather();
    });
});

function hideWeatherDataDisplay() {
    $('#pageContent').children().hide();
    $('.base').show();
}

function unhideEverything() {
    $('#pageContent').children().show();
}

function updateWeather() {
    zip = $('#zipcodeInput').val();
    units = $('#unitInput').val();
    
    if (validZip()) {
        unhideEverything();
        updateCurrentWeather();
        updateForecast();
    } else {
        hideWeatherDataDisplay();
        addErrorMessage('Please use a valid, 5-digit zipcode.');
    }
}

function validZip() {
    return /^[0-9]{5}$/.test(zip);
}

function updateCurrentWeather() {
    $.ajax({
        type: 'GET',
        url: urlCall('http://api.openweathermap.org/data/2.5/weather?'),
        
        success: function(data) {
            $('#errorMessages').empty();
            $('#conditionsIn').text('Current Conditions in ' + data.name);
            $('#conditionImg').attr('src', getIconSrc(data));
            $('#conditionDisplay').text(data.weather[0].main + ': ' + data.weather[0].description);

            $('#tempDisplay').html(data.main.temp + ' ' + getTempUnits());
            $('#humidDisplay').html(data.main.humidity + '%');
            $('#windDisplay').html(data.wind.speed + ' ' + getSpeedUnits());
        },
        
        error: function(xhr, status, error) {
            hideWeatherDataDisplay();
            if (xhr.status == 404) {
                addErrorMessage('Zipcode could not be found!');
            } else {
                addErrorMessage('Error communicating with database, please try again later.');
            }
        }
    });
}

function addErrorMessage(msg) {
    $('#errorMessages')
        .append($('<li>')
        .attr({class: 'list-group-item list-group-item-danger mb-1'})
        .text(msg));   
}

function updateForecast() {
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
            hideWeatherDataDisplay();
        }
    });
}

function addForecastEntry(data, dayOffset) {
    var entry = '<div class="container-sm col d-flex flex-column align-items-center img-thumbnail">';
        entry += '<p><b>' + getDate(dayOffset) + '</b></p>';
        entry += '<div class="row align-items-center justify-content-center">';
            entry += '<div class="col"><img class="img-fluid" src="' + getIconSrc(data) + '" /></div>';
            entry += '<p class="col">' + data.weather[0].main + '</p>';
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

function urlCall(baseUrl) {
    return baseUrl + 'zip=' + zip + '&appid=' + APIKey + '&units=' + units;
}
