﻿<?php

//dbconnect.php ; DB接続

	define('DB_HOST','sv2.php.xdomain.ne.jp');
	define('DB_NAME','kiisenglish_01');
	define('DB_USER','kiisenglish_1');
	define('DB_PASSWORD','binmin49');

   $options = array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET CHARACTER SET 'utf8'");
   error_reporting(E_ALL & ~E_NOTICE);

	try{
		$dbh = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD,$options);
		$dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
	}catch(PDOException $e){
		echo $e->getMessage();
		exit;
	}

	date_default_timezone_set('Asia/Tokyo');
//	header("Content-Type: text/html; charset=UTF-8");
//	echo "db connect....<br>";
?>


