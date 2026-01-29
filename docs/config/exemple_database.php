<?php
$dsn = "mysql:host=localhost;dbname=my_cinema;charset=utf8mb4"; // change dbname="your database name"
$user = "root";	//change user = "your user in database"
$pass = ""; // change pass = "your user password"
$pdo = new PDO(dsn: $dsn, username: $user, password: $pass, options: [
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);
?>