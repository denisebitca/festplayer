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

$permitted_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 
function generate_string($input, $strength = 16) {
    $input_length = strlen($input);
    $random_string = '';
    for($i = 0; $i < $strength; $i++) {
        $random_character = $input[mt_rand(0, $input_length - 1)];
        $random_string .= $random_character;
    }
 
    return $random_string;
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$code = generate_string($permitted_chars, 7);
$randomcode = array("code" => $code);
$date = date("Y-m-d");
$computerip = $_SERVER['REMOTE_ADDR']; 

$sql = "INSERT INTO to_be_connected (CODE, IPCOMP, DATE)
VALUES ('$code', '$computerip', '$date')";

if ($conn->query($sql) === TRUE) {
    echo json_encode($randomcode);
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>