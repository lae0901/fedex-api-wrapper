<?php
// $vendorDir = dirname(__DIR__) . '/vendor';
$vendorDir = dirname(dirname(dirname(__DIR__))) ;

// bgnTemp
echo 'bootstarp.php  vendorDir:' . $vendorDir . '<br>' ;
// endTemp

require_once $vendorDir . '/autoload.php';
