// The root URL for the RESTful services
var rootURL = "http://localhost/labs/geoip.php/";
var currentLocation;

// GetDefaultIp onLoad event
$(document).ready(getDefaultIp);

// Register listeners onClick
$('#btnSearch').click(function() {
	findByIp($('#ipaddress').val());
	return false;
});

// Register listeners onEnter
$('#ipaddress').keypress(function(e){
	if(e.which == 13){
		findByIp($('#ipaddress').val());
	 }
});

// AJAX call to WebService
function findByIp(ip) {
	$.ajax({
		type: 'GET',
		url: rootURL + 'ip/' + ip,
		dataType: "xml",
		success: function(data){
			console.log("success", data);
			var IP = $(data).find('IP').text()
			var countryName = $(data).find('CountryName').text();
			convertToGeoCode(countryName, ip);
			
			toggleError();
		},
		error: function(data){
			var error = $(data.responseText).find('ReturnCodeDetails').text();
			toggleError(error);
		}
	});
}

// Fill IP address by default
function getDefaultIp() {
	$.ajax({
		type: 'GET',
		url: rootURL + 'ip/default',
		dataType: "xml",
		success: function(data){
			var IP = $(data).find('IP').text();
			$('#ipaddress').val(IP);
			findByIp(IP);
		}
	});
}

// Convert Country name to Geocode
function convertToGeoCode(countryName, ip) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': countryName}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			initializeMap(results[0].geometry.location, countryName, ip);
		};
	})
}

// Initialize map object
function initializeMap(address, countryName, ip) {
  var myOptions = {
	zoom: 6,
	mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
	  myOptions);
	  
	var options = {
	  map: map,
	  position: new google.maps.LatLng(address.Qa, address.Ra),
	  content: "IP: " + ip  + "<br/> Country: " + countryName
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
	
}

// Show or Hide error
function toggleError(error) {
	if(error != null){
		$('#error').show().addClass("error");
		$('#error').text(error);		
	} else {
		$('#error').removeClass("error").hide();
	}
}