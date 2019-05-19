<?php
/*
Festplayer v0.2.1 - getsongs.php
by rdb-github
*/
require_once('./getid3/getid3.php');
header('Content-Type: application/json');
$dir = "../../songs"; 
$infodir = new SplFileInfo($dir);
$lastmodif = date('d/m/Y H:i:s', $infodir->getMTime());
$list = array(); 
$filename = 'latestresults.json';
/*$countFiles = 0;
$files = glob($dir . "/*.mp3");
if ($files){
    $countFiles = count($files);
}*/

function getlist(){
    $dir = "../../songs";
    $infodir = new SplFileInfo($dir);
    $lastmodif = date('d/m/Y H:i:s', $infodir->getMTime());
    $files = glob($dir . "/*.mp3");
    $list = array(); 
    $countFiles = 0;
    $filename = 'latestresults.json';
    if ($files){
        $countFiles = count($files);
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
            file_put_contents($filename, json_encode($list));
            /*file_put_contents('filecount', $countFiles);*/
            file_put_contents('lastmodified', $lastmodif);
        }
    } else {
        echo "NIGHT_EMPTY";
    }
}

if (file_exists($filename)/* && file_exists("filecount")*/ && file_exists("lastmodified")) {
    /*if($countFiles != file_get_contents("filecount")){
        getlist();
    } else */
    if($lastmodif != file_get_contents("lastmodified")){
        getlist();
    } else {
        echo file_get_contents('latestresults.json');
    }
} else {
    getlist();
};


?>