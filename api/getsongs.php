<?php
require_once('./getid3/getid3.php');
header('Content-Type: application/json');
$dir = "../../songs"; 
$list = array(); 
if(is_dir($dir)){
    if($dh = opendir($dir)){
        while(($file = readdir($dh)) != false){
            if($file == "." or $file == ".."){
             //no
            } else {
				$getID3 = new getID3;
				$ThisFileInfo = $getID3->analyze($dir . '/' . $file);
				$len= @$ThisFileInfo['playtime_string'];
                $list3 = array(
                'file' => $file,
				'duration' => $len);
                array_push($list, $list3);
            }
        }
    }
	
    echo json_encode($list);
}

?>