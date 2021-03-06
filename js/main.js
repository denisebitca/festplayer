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

console.log("Festplayer v0.1bis");

var resultarray = [];
var playings = false;
var music;
var volumes;
var interval;
var resultvar;
var loop = false;

function playpause(){
    return music.playing() ? music.pause() : music.play();
}

function isOpen(ws) { return ws.readyState === ws.OPEN }

function notify(text, type){
    var n = new Noty({text: text,type: type});
    n.setTimeout(4500);
    n.show();
}

function notifypopup(modaltext, reload){
    function DoThis(){
        if(reload){
            location.reload()
        }
    }
    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onClose: function() {
            DoThis();
        }
    });
    modal.setContent('<h1>' + modaltext + '</h1>');
    
    modal.addFooterBtn('Close', 'tingle-btn tingle-btn--primary', function() {
        modal.close();
    });

    modal.open();
}

function currentSong(){
    for(i=0; $(".song").length > i; i++){
        if($('.song')[i].getAttribute("name") == "selected"){
            return i;
        }
    }
}

function percentage(){
     var percentageplayed = (music.seek()/(($('#songcontainer > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div[name="selected"] > div > h1.songduration')[0].innerHTML.split(':')[0]*60) + ($('#songcontainer > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div[name="selected"] > div > h1.songduration')[0].innerHTML.split(':')[1]*1))*100);
    return percentageplayed;
}

function skipforwards(){
    if(resultarray.length > currentSong() + 1){
         selectSong(currentSong() + 1, true);
         $(".song")[currentSong()].scrollIntoView({
             behaviour: 'smooth'
         });
    }
}

function skipbackwards(){
    if(currentSong() - 1 >= 0){
        selectSong(currentSong() - 1, true);
        $(".song")[currentSong()].scrollIntoView({
            behaviour: 'smooth'
        });
    }
}

function selectSong(song, autoplay, firsttime) {
    if (currentSong() == song) {
        playpause();
    } else {
            $(".line2")[0].setAttribute("style","width:0%");
            if(!firsttime){
                music.stop()
                $('.song[name=selected]')[0].setAttribute("style", "");
                $('.song[name=selected]')[0].setAttribute("name", "");
                clearInterval(interval);
                Howler.unload()
            }
            music = new Howl({
                src: [resultarray[song]],
                html5: true,
                autoplay: autoplay,
                loop: loop,
                volume: Howler.volume(),
                onplay: function(){document.title = $(".songname")[song].innerHTML + " | Festplayer"; document.getElementById("playpause").innerHTML = "pause_circle_filled";interval = setInterval(function(){$(".line2")[0].setAttribute("style","width:" + percentage() + "%")}, 1000);},
                onpause: function(){document.title = "Festplayer"; document.getElementById("playpause").innerHTML = "play_circle_filled";clearInterval(interval);}
            });
            $("#loading_player").show()
            music.on('load', function(){
                $("#loading_player").hide();
            });
            $('.song')[song].setAttribute("style", "filter: invert(1)");
            $('.song')[song].setAttribute("name", "selected");
    }
}

function repeat() {
    var repeatelem = document.getElementById("repeat")
	if (repeatelem.getAttribute("name") == "norepeat") {
		repeatelem.setAttribute("name", "repeat-one");
		music.loop(true);
		loop = true;
	} else if (repeatelem.getAttribute("name") == "repeat-one") {
		repeatelem.setAttribute("name", "norepeat");
		music.loop(false);
		loop = false;
	}
}

function volume() {
    if (document.getElementById("volume").getAttribute("name") == "slidershow") {
        document.getElementById("speech-bubble").setAttribute("style", "display:none");
        document.getElementById("volume").setAttribute("name", "sliderhide");
    } else if (document.getElementById("volume").getAttribute("name") == "sliderhide") {
        document.getElementById("speech-bubble").setAttribute("style", "display:flex");
        document.getElementById("volume").setAttribute("name", "slidershow");
    }
}

function setVolume(svolume) {
    Howler.volume(svolume / 100);
}

(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

$.ajax({
    type: "get",
    url: "./api/getsongs.php",
    async: true,
    success: function(data) {
            $('#footer').children().hide();
            result = data;
            if (result == "NIGHT_EMPTY") {
                notify("No songs have been located on this server. Try again.", "error")
                console.log("test")
            } else {
                var amountofarticles = result.length;
                for (i = 0; amountofarticles > i; i++) {
                    var musics = result[i].file;
                    resultarray.push(
                        "./songs/" + musics
                    );
                }
                console.log(resultarray);
                for (i = 0; amountofarticles > i; i++) {
                    if (i == 0) {
                        document.getElementsByClassName("loadingcontainer")[0].style.display = "none";
                    }
                    var article = $("<div></div>").addClass('song');
                    $('#songcontainer').append(article);
                    //song position
                    var articlepos = document.createElement("h1");
                    articlepos.classList.add("songposition");
                    var text1 = document.createTextNode(i + 1);
                    articlepos.appendChild(text1);
                    $(".song")[i].append(articlepos);
                    //no
                    var article1 = $("<div></div>").addClass('songinfo');
                    article.append(article1);
                    //song name
                    var articletitle = document.createElement("h1");
                    articletitle.classList.add("songname");
                    var text2 = document.createTextNode(result[i].file.substr(0, result[i].file.length - 4));
                    articletitle.appendChild(text2);
                    $(".songinfo")[i].append(articletitle);
                    //duration
                    var articleduration = document.createElement("h1");
                    articleduration.classList.add("songduration");
                    var text3 = document.createTextNode(result[i].duration);
                    articleduration.appendChild(text3);
                    $(".songinfo")[i].append(articleduration);
                    //other
                    $(".song")[i].setAttribute("onclick", "selectSong('" + i + "',true, false)");
                }
                new SimpleBar($('#songcontainer')[0]);
                selectSong(0, false, true)
                Howler.volume(0.5);
                $("#footer").children().show();
                $(".playerbuttons").attr("style","display:flex;");
                $("#loading_player").hide();
            }
    },
    error: function(error) {
        notify("Server error, try again later.","error")
    }
});
