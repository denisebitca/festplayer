<?php

$servername = "localhost";
$username = "newuser";
$password = "default_change_please@";
$dbname = "remote_codes";
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