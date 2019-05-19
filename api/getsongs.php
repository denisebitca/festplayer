<?php
require_once('./getid3/getid3.php');
header('Content-Type: application/json');
$dir = "../../songs"; 
$list = array(); 
$filename = 'latestresults.json';
$countFiles = 0;
$files = glob($dir . "/*.mp3");
if ($files){
    $countFiles = count($files);
}

function getlist(){
    $dir = "../../songs";
    $files = glob($dir . "/*.mp3");
    $list = array(); 
    $filename = 'latestresults.json';
    $countFiles = 0;
    if(is_dir($dir)){
        if($dh = opendir($dir)){
            while(($file = readdir($dh)) != false){
                $info = new SplFileInfo($file);
                $extension = pathinfo($info->getFilename(), PATHINFO_EXTENSION);
                if($file == "." or $file == ".."){
                //no
                } elseif($extension != "mp3") {
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
        file_put_contents('latestresults.json', json_encode($list));
        if ($files){
        $countFiles = count($files);
        }
        file_put_contents('filecount', $countFiles);
    }
}

if (file_exists($filename) && file_exists("filecount")) {
    if($countFiles != file_get_contents("filecount")){
        getlist();
    } else {
        echo file_get_contents('latestresults.json');
    }
} else {
    getlist();
};


?>