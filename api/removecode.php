<?php
/*
   This file, which includes code (mostly written by Rafael Bitca (https://github.com/rdb-github)), is part of Festplayer (https://github.com/rdb-github/festplayer).
 
    Festplayer is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   Please check LICENSE or README.md, which are in the main directory of Festplayer, for more information.
*/
require_once("credentials.php");
$CODE = $_GET["code"];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "DELETE FROM `to_be_connected` WHERE CODE = '$CODE'";

$result = $conn->query($sql);

header('Content-Type: application/json');

if ($result === TRUE) {
    $fin = array("status" => true);
} else {
    $fin = array("status" => false);
}

echo json_encode($fin);
$conn->close();

?>