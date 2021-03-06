<?php

// localhost/vendor/jeremy-dunn/php-fedex-api-wrapper/examples/address-validation.php

require_once 'credentials.php';
require_once 'bootstrap.php';

use FedEx\AddressValidationService\Request;
use FedEx\AddressValidationService\ComplexType;
use FedEx\AddressValidationService\SimpleType;

$getJson  = isset($_POST["getJson"]) ? $_POST["getJson"] : 'N'; 
$addr1  = isset($_POST["addr1"]) ? $_POST["addr1"] : '12345 Main Street'; 
$addr2  = isset($_POST["addr2"]) ? $_POST["addr2"] : ''; 
$city  = isset($_POST["city"]) ? $_POST["city"] : 'Anytown'; 
$state  = isset($_POST["state"]) ? $_POST["state"] : 'NJ'; 
$zip  = isset($_POST["zip"]) ? $_POST["zip"] : ''; 

$addressValidationRequest = new ComplexType\AddressValidationRequest();

// User Credentials
$addressValidationRequest->WebAuthenticationDetail->UserCredential->Key = FEDEX_KEY;
$addressValidationRequest->WebAuthenticationDetail->UserCredential->Password = FEDEX_PASSWORD;

// Client Detail
$addressValidationRequest->ClientDetail->AccountNumber = FEDEX_ACCOUNT_NUMBER;
$addressValidationRequest->ClientDetail->MeterNumber = FEDEX_METER_NUMBER;

// Version
$addressValidationRequest->Version->ServiceId = 'aval';
$addressValidationRequest->Version->Major = 4;
$addressValidationRequest->Version->Intermediate = 0;
$addressValidationRequest->Version->Minor = 0;

// Address(es) to validate.
$addressValidationRequest->AddressesToValidate = [new ComplexType\AddressToValidate()]; // just validating 1 address in this example.
$addressValidationRequest->AddressesToValidate[0]->Address->StreetLines = [$addr1, $addr2];
$addressValidationRequest->AddressesToValidate[0]->Address->City = $city;
$addressValidationRequest->AddressesToValidate[0]->Address->StateOrProvinceCode = $state;
$addressValidationRequest->AddressesToValidate[0]->Address->PostalCode = $zip;
$addressValidationRequest->AddressesToValidate[0]->Address->CountryCode = 'US';

$request = new Request();
//$request->getSoapClient()->__setLocation(Request::PRODUCTION_URL);
$request->getSoapClient()->__setLocation(Request::TESTING_URL);
$addressValidationReply = $request->getAddressValidationReply($addressValidationRequest, true);

echo json_encode( get_object_vars($addressValidationReply));
// var_dump($addressValidationReply);
