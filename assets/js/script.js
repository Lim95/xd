var savedLocation=[];
var getCity = function (string) {
	$.get('https://cors-anywhere.herokuapp.com/https://trends24.in' +string, function(response) {
		var currentLocation = parseLocation($(response).find('#app-bar-toggle').first().text());
		$("#city-name").text(currentLocation);
		var parsedTrendList = [];
		var trendList = [];
		$("#trending-ul").empty();
		for (var i = 1; i < 11; i++) {
			var trend = $(response).find('#trend-list > div:nth-child(1) > ol > li:nth-child(' + i +') > a').text();
			parsedTrend = parseTrends(trend);
			parsedTrendList.push(parsedTrend);
			trendList.push(trend);
			createTrendListHTML(trend);
		};
		$("#searched-trend").text(trendList[0]);
		$("#city").empty();
		$("#city").append("<option id='world-wide'>...</option>");
		var locationLength = $(response).find('.suggested-locations__list li').length;
		var currentLocationUrl;
		for (var i = 1; i <= locationLength; i++) {

			var location = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').text();
			var locationUrl = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').attr('href');
			createLocationHTML(location, locationUrl);
		}
	});
}

var saveCurrentLocation = function () {
  localStorage.setItem("currentLocation", JSON.stringify(savedLocation));
};
var loadCurrentLocation = function () {
	var saved = JSON.parse(localStorage.getItem("currentLocation"));

	if(!saved) {
		savedLocation = [''];
		return false;
	}
	savedLocation= saved;
}
var createLocationHTML = function (location, locationUrl) {
	$("#city").append("<option id='" + locationUrl + "'>" + location + "</option>");
};

var createTrendListHTML = function (string) {
	$("#trending-ul").append( "<li class='list-item tag-list' id='" +string + "'>" + string + "</li>");
};
var parseTrends = function (string) {
	var result;
	var temp = string;

	// if the string starts with hastag, remove it
	if (string.startsWith('#')) {
		temp = temp.substring(1);
	}
	// check if non alphaneumeric values
	if (!temp.match(/^[A-Za-z\d\s\w]+$/)) {
		result = temp;
	}
	else {
		//break the string if all in one word
		var arr = temp.match(/[A-Z][a-z]+/g);
		if(arr) {
			result = arr.join(' ');
		}
		else {
			result = temp;
		}

	}
	return result;
};

var parseLocation=function(string) {
	var result;
	var sIndex = string.indexOf(' ');

	// checks if this is a city
	if (sIndex >= 0) {
		result = string.slice(0,sIndex-1);
	}
	// this is a country
	else {
		result = string;
	}
	return result;
};

$("#city-form").submit(function (event) {
	event.preventDefault();
	var selectedCity =$("#city option:selected").attr('id');
	
	if (selectedCity === "world-wide"){
		getCity('');
		savedLocation[0] = '';
	} else {
		getCity(selectedCity);
		savedLocation[0] = selectedCity;
	}
	saveCurrentLocation();
});

$("#trending").on("click", function(event){

	$("#searched-trend").text( event.target.id);
});


var pageLoad = function () {
	loadCurrentLocation();
	getCity(savedLocation);
};
pageLoad();

