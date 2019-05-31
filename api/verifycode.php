<?php

require_once("credentials.php");

$CODE = $_GET["code"];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM `to_be_connected` WHERE CODE = '$CODE'";

$result = $conn->query($sql);

header('Content-Type: application/json');

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $fin = array('code' => $CODE, 'validity' => true);
    }
} else {
        $fin = array('code' => $CODE, 'validity'=> false);
}

echo json_encode($fin);
$conn->close();
