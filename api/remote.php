<?php

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

$servername = "localhost";
$username = "newuser";
$password = "default_change_please@";
$dbname = "remote_codes";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$code = generate_string($permitted_chars, 7);
$randomcode = array("code" => $code);
$date = date("Y-m-d h:i:sa");
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