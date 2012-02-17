<?php
 
require 'Slim/Slim.php';
 
$app = new Slim();
 
$app->get('/ip/:ipaddress',  'getGeoIP'); 
$app->get('/location/:location',  'getGeoCodingLocation'); 
$app->run(); 
 
function getGeoIP($ipaddress) {
  $client = new SoapClient("http://www.webservicex.net/geoipservice.asmx?WSDL");
  $result = $client->GetGeoIP(array('IPAddress'=>$ipaddress));  
  $response = $result->GetGeoIPResult;
  
  print "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
  print "<root>";
  print "<IP>".$response->IP."</IP>";
  print "<ReturnCode>".$response->ReturnCode."</ReturnCode>";
  print "<ReturnCodeDetails>".$response->ReturnCodeDetails."</ReturnCodeDetails>";
  print "<CountryName>".$response->CountryName."</CountryName>";
  print "<CountryCode>".$response->CountryCode."</CountryCode>";
  print "</root>";
  
}

function getGeoCodingLocation($location){
	//$location = str_replace("_", "*", $location);
	//print $location;
	$url = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$location.'&sensor=false';
	$curl = curl_init();

		// set URL and other appropriate options
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HEADER, false);

 		
		// grab URL and pass it to the browser

		print curl_exec($curl);

		if (curl_errno($curl)) {
    		print curl_error($curl);
		} else {
    		curl_close($curl);
		}

		// close cURL resource, and free up system resources
		//curl_close($ch);
}
 
?>