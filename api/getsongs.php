<?php
/*
   This file, which includes code (mostly written by Denise Bitca (https://github.com/denisebitca)), is part of Festplayer (https://github.com/denisebitca/festplayer).
 
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
require_once('./getid3/getid3.php');
$dir = "../songs"; 
$infodir = new SplFileInfo($dir);
$lastmodif = date('d/m/Y H:i:s', $infodir->getMTime());
$list = array(); 
$filename = 'latestresults.json';

function getlist(){
    $dir = "../songs";
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
                    if($file != "." or $file != ".." ) {
                        if ($extension == "mp3") {
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
            }
            header('Content-Type: application/json');
            echo json_encode($list);
            file_put_contents($filename, json_encode($list));
            file_put_contents('lastmodified', $lastmodif);
        }
    } else {
        echo "NIGHT_EMPTY";
    }
}

if (file_exists($filename) && file_exists("lastmodified")) {
    if($lastmodif != file_get_contents("lastmodified")){
        getlist();
    } else {
        header('Content-Type: application/json');
        echo file_get_contents('latestresults.json');
    }
} else {
    getlist();
};


?>
