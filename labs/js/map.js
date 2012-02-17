// The root URL for the RESTful services
var rootURL = "http://localhost/labs/geoip.php/";
var currentLocation;

console.log("root");
$(document).ready(getDefaultIp);

// Register listeners onClick
$('#btnSearch').click(function() {
console.info("btnsearch clicked");
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
	console.log('findById: ' + ip);
	$.ajax({
		type: 'GET',
		url: rootURL + 'ip/' + ip,
		dataType: "xml",
		success: function(data){
			console.log("success", data);
			var IP = $(data).find('IP').text()
			var countryName = $(data).find('CountryName').text();
			console.log("IP", IP);
			console.log("CountryName", countryName);
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
	console.log('getDefaultIp: ');
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
console.log("status", google.maps.GeocoderStatus.OK);
  if (status == google.maps.GeocoderStatus.OK) {
  console.log(results[0].geometry.location.lat);
	initializeMap(results[0].geometry.location, countryName, ip);
	};
  })
}

// Initialize map object
function initializeMap(address, countryName, ip) {
console.log("address", address);
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
		$('#error').show();
		$('#error').text(error);		
	} else {
		$('#error').hide();
	}
}