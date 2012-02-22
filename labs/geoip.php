<?php
 
require 'Slim/Slim.php';
 
$app = new Slim();
 
$app->get('/ip/default',  'getDefaultIP');
$app->get('/ip/:ipaddress',  'getGeoIP');
$app->run(); 
 
function getGeoIP($ipaddress) {
 
  try {
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
  
  } catch (Exception $e) {
  	  
  }
}

function getDefaultIP() {
  $ip = getenv("REMOTE_ADDR") ;
  print "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
  print "<root>";
  print "<IP>".$ip."</IP>";
  print "</root>";
}

?>