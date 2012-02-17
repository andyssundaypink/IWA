// The root URL for the RESTful services
var rootURL = "http://localhost/labs/geoip.php/";
var currentLocation;

console.log("root");

// Register listeners
$('#btnSearch').click(function() {
console.info("btnsearch clicked");
	search($('#ipaddress').val());
	return false;
});

console.log("rootx");
function search(searchKey) {	
	findById(searchKey);
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + 'ip/' + id,
		dataType: "xml",
		success: function(data){
			var IP = $(data).find('IP').text();
			var countryName = $(data).find('CountryName').text();
			console.log("IP", IP);
			console.log("CountryName", countryName);
			convertToGeoCode(countryName);
		}
	});
}

function convertToGeoCode(countryName) {
var geocoder = new google.maps.Geocoder();
geocoder.geocode({ 'address': countryName}, function(results, status) {
console.log("status", google.maps.GeocoderStatus.OK);
  if (status == google.maps.GeocoderStatus.OK) {
  console.log(results[0].geometry.location.lat);
	initializeMap(results[0].geometry.location);
	};
  })
}

function initializeMap(address) {
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
	  content: 'test content'
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
	
}