/*
Festplayer v1 - main.js
by rdb-github
*/

window.onload = function() {
    document.getElementById('remote').addEventListener('click', function(e) {
        remotecontrol();
    });
};

console.log("Festplayer v1");

var resultarray = [];
var socket;
var remotefirst = true;
var remoteaccess;
var remotephone = false;
var playings = false;
var music;
var volumes;
var interval;
var resultvar;
var loop = false;

function isOpen(ws) { return ws.readyState === ws.OPEN }

function notify(text, type){
    var n = new Noty({text: text,type: type});
    n.setTimeout(4500);
    n.show();
}

function socketsend(number, value){
    if (!isOpen(socket)){notifypopup("You've been disconnected. Your page will reload now.", true); return;}
    var arrays = ['[{"duration":"' + value + '"}]','[{"loading":true}]','[{"loading":false}]','[{"onmobile":true,"song":' + value + '}]','[{"onmobile":true,"repeat":true}]','[{"onmobile":true,"repeat":false}]','[{"onmobile":true,"volume":' + value + '}]','[{"onmobile":true,"playing":false}]','[{"onmobile":true,"playing":true}]','[{"onmobile":true,"remotecode":"' + value + '"}]','[{"remotecode":"' + value + '"}]']
    socket.send(arrays[number]);
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

function percentage(/*song*/){
    /*if(currentSong() == song){*/
    var percentageplayed = (music.seek()/(($('#songcontainer > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div[name="selected"] > div > h1.songduration')[0].innerHTML.split(':')[0]*60) + ($('#songcontainer > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div[name="selected"] > div > h1.songduration')[0].innerHTML.split(':')[1]*1))*100);
    if (remoteaccess) socketsend(0, percentageplayed)
    return percentageplayed;
    /*} else {
        var percentageplayed = (music.seek()/($('.songduration')[song].innerHTML.split(':')[0] * 60 + ($('.songduration')[song].innerHTML.split(':')[1]*1)))*100;
        if (remoteaccess) socket.send('[{"duration":"' + percentageplayed + '"}]')
        return percentageplayed;
    }*/
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
    if (currentSong() == song && remotefirst) {
        playPause();
    } else {
        if(!remotephone){
            if(!firsttime){
                $(".line2")[0].setAttribute("style","width:0%")
                $('.song[name=selected]')[0].setAttribute("style", "");
                $('.song[name=selected]')[0].setAttribute("name", "");
                if(playings == true){
                    music.pause()
                    playings = false;
                    clearInterval(interval)
                }
                clearInterval(interval);
                Howler.unload()
            }
            music = new Howl({
                src: [resultarray[song]],
                html5: true,
                autoplay: autoplay,
                loop: loop,
                volume: Howler.volume(),
                onplay: function(){document.title = $(".songname")[song].innerHTML + " | Festplayer"},
                onpause: function(){document.title = "Festplayer"}
            });
            $("#loading_player").show()
            if(remoteaccess) socketsend(1)
            music.on('load', function(){
                $("#loading_player").hide();
                if(remoteaccess) socketsend(2)
            });
            if(!firsttime) {
                document.getElementById("playpause").innerHTML = "pause_circle_filled";
                playings = true;
            }
            $('.song')[song].setAttribute("style", "filter: invert(1)");
            $('.song')[song].setAttribute("name", "selected");
            if(remoteaccess) $('.song')[song].scrollIntoView();
            interval = setInterval(function(){$(".line2")[0].setAttribute("style","width:" + percentage(/*song*/) + "%")}, 1000)
        } else {
            $('.song[name=selected]')[0].setAttribute("style", "");
            $('.song[name=selected]')[0].setAttribute("name", "");
            document.title = "Festplayer";
            document.title = resultarray[song].replace("../songs/", "").replace(".mp3", "") + " | Festplayer";
            $('.song')[song].setAttribute("style", "filter: invert(1)");
            $('.song')[song].setAttribute("name", "selected");
            playings = true;
            socketsend(3, song)
            $(".line2")[0].setAttribute("style","width:0%")
            document.getElementById("playpause").innerHTML = "pause_circle_filled";
        } 
    }
}

function repeat() {
    var repeatelem = document.getElementById("repeat")
    if(remotephone){
        if (repeatelem.getAttribute("name") == "norepeat") {
            repeatelem.setAttribute("name", "repeat-one");
            socketsend(4)
        } else if (repeatelem.getAttribute("name") == "repeat-one") {
            repeatelem.setAttribute("name", "norepeat");
            socketsend(5);
        }
    } else {
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
}

function volume() {
    if (document.getElementById("volume").getAttribute("name") == "slidershow") {
        document.getElementById("vol-control").setAttribute("style", "display:none");
        document.getElementById("volume").setAttribute("name", "sliderhide");
    } else if (document.getElementById("volume").getAttribute("name") == "sliderhide") {
        document.getElementById("vol-control").setAttribute("style", "display:block");
        document.getElementById("volume").setAttribute("name", "slidershow");
    }
}

function setVolume(svolume) {
    if(remotephone){
        socketsend(6, svolume)
    } else {
        Howler.volume(svolume / 100);
    }
}

function playPause(){
    if(remotephone){
        if(playings == true){
            document.getElementById("playpause").innerHTML = "play_circle_filled"
            socketsend(7);   
            document.title = "Festplayer";
            playings = false; 
        } else {
            document.getElementById("playpause").innerHTML = "pause_circle_filled"
            socketsend(8); 
            document.title = $('#songcontainer > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div[name="selected"] > div > h1.songname')[0].innerHTML + ' | Festplayer'
            playings = true;
        }
    } else {
        if(playings == true){
            document.getElementById("playpause").innerHTML = "play_circle_filled"
            music.pause();
            playings = false;
            /*clearInterval(interval)
            interval = setInterval(function(){$(".line2")[0].setAttribute("style","width:" + percentage(currentSong()) + "%")}, 1000)*/
        } else {
            document.getElementById("playpause").innerHTML = "pause_circle_filled"
            music.play();
            playings = true;
            /*clearInterval(interval)
            interval = setInterval(function(){$(".line2")[0].setAttribute("style","width:" + percentage(currentSong()) + "%")}, 1000)*/
        }
    }
}

(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function checkCode(code){
    code = code.replace(/[^A-Za-z0-9]+/gm, "");
    var wongcode = false;

    if(code.length != 7){
        notify("Invalid code, please try again.", "error")
        wongcode = true;
        return;
    }

    if (wongcode){
        return;
    }

    socket = new WebSocket('ws://' + location.hostname + ':3210');

    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    socket.onmessage = function (event) {
        if(JSON.parse(event.data)[0].hasOwnProperty("status")){
            var status = JSON.parse(event.data)[0].status;
            if(status == "awaiting"){
                $("#remotepagemobile").hide();
                $("#elementspc>h1").hide();
                document.getElementsByClassName("loadingcontainer")[1].style.display = "flex";
                $("#remotepagecomputer").show();
                $.get('./api/verifycode.php?code=' + code, function(result) {
                    if(result.validity){
                        console.log("yay")
                    } else {
                        $("#remotepagecomputer").hide();
                        $("#remotepagemobile").show();
                        notify("Wrong code, double-check what you wrote and try again.", "error");
                        socket.close();
                        wongcode = true;
                        return;
                    }
                }).then(function(){
                    if (!isOpen(socket)){
                        if (wongcode){
                            return;
                        }
                        notifypopup("You've been disconnected. Your page will reload now.", true)
                    }
                    if (wongcode){
                        return;
                    }
                    socketsend(9, code);
                })
                if (wongcode){
                    socket.close();
                    return;
                }
            } else if(status == "pairing"){
                document.getElementsByClassName("loadingcontainer")[1].querySelector("#loading").setAttribute("class","ld ld-ring ld-spin huge")
            } else if(status == "establishing_connection"){
                //something
            } else if(status == "successfully_paired_with_computer"){
                document.querySelector("#navbar").style.backgroundColor = "#a541be";
                remotephone = true;
                document.getElementsByClassName("loadingcontainer")[1].querySelector("#loading").setAttribute("class","ld ld-ring ld-cycle huge")
                document.getElementsByClassName("loadingcontainer")[1].style.display = "none";
                $("#remotepagecomputer").hide();
                $("#mainpage").show();
                notify("Remote control has been enabled. Click on the remote to disconnect.", "success")
            } else if(status == "command_successful"){
                console.log("Command successful")
            } else if (status == "computer_disconnected") {
                socket.close();
                notifypopup("Your computer disconnected.", true)
            } else if (status == "invalid_code") {
                notify("Wrong code, double-check what you wrote and try again.", "error")
                return;
            } else if (status == "loading"){
                $("#loading_player").show()
            } else if (status == "loaded"){
                $("#loading_player").hide()
            } else {
                console.error("Odd error, please check websocket error message: " + status);
                return;
            }
        } else if (JSON.parse(event.data)[0].hasOwnProperty("duration")){
            var duration = JSON.parse(event.data)[0].duration;
            clearInterval(interval)
            $(".line2")[0].setAttribute("style","width:" + duration + "%")
        }
    }
}


function getCode(){
    socket = new WebSocket('ws://' + location.hostname + ':3210');
    var code;

    socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error);
    };

    socket.onmessage = function (event) {
        if(JSON.parse(event.data)[0].hasOwnProperty("status")){
            var status = JSON.parse(event.data)[0].status;
            if(status == "awaiting"){
                $.get('./api/remote.php', function(result) {
                    code = JSON.parse(result).code;
                }).then(function(){
                    socketsend(10, code)
                })
            } else if(status == "registering"){
                console.log("Code is being registered");
            } else if(status == "successfully_registered"){
                console.log("Code registered successfully!");
                document.getElementById("code").innerHTML = code;
                $("#elementspc>h1").show();
                document.getElementsByClassName("loadingcontainer")[1].style.display = "none";
            } else if(status == "successfully_paired_with_phone"){
                document.querySelector("#navbar").style.backgroundColor = "#a541be";
                $("#elementspc>h1").hide();
                for(i=0;5>i;i++){
                    $(".material-icons")[i].setAttribute("style","pointer-events:none");
                }
                for (i = 0; resultarray.length > i; i++) {
                    $(".song")[i].setAttribute("onclick","");
                }
                $("#remotepagecomputer").hide();
                notify("Remote control has been enabled. Click on the remote to disconnect. The buttons on your computer have been disabled, use your phone to control the player instead.", "success")
                if(loop){
                    repeat();
                }
                remoteaccess = true;
                $("#mainpage").show();
                Howler.mute(true);
                remotefirst = false;
                selectSong(0, false);
                playPause();
                music.seek(0);
                Howler.mute(false);
                remotefirst = true;
            } else if(status == "phone_disconnected"){
                if(music.playing()){
                    playPause();
                }
                socket.close();
                remoteaccess = false;
                notifypopup("Your phone disconnected.", true)
            } else if(status == "pause" || status == "play"){
                playPause();
            } else {
                console.error("Odd error, please check websocket error message: " + status);
                return;
            }
        } else if(remoteaccess){
            if (JSON.parse(event.data)[0].hasOwnProperty("volume")){
                setVolume(JSON.parse(event.data)[0].volume);
            } else if(JSON.parse(event.data)[0].hasOwnProperty("song")){
                selectSong(JSON.parse(event.data)[0].song,true)
            } else if(JSON.parse(event.data)[0].hasOwnProperty("repeat")){
                var repeate = JSON.parse(JSON.parse(event.data)[0].repeat);
                if(repeate){
                    repeat()
                } else if (!repeate) {
                    repeat()
                }
            }
        }
    }
}


function remotecontrol() {
    if(music.playing()){
        playPause();
    }
    if (jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "remote") {
        document.getElementById("remote").setAttribute("name", "clicked");
        $("#mainpage").hide();
        $("#remotepagemobile").attr("style", "display:flex;");
    } else if (!jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "remote") {
        $("#mainpage").hide();
        $("#remotepagecomputer").attr("style", "display:flex;");
        document.getElementsByClassName("loadingcontainer")[1].style.display = "flex";
        document.getElementById("remote").setAttribute("name", "clicked");
        getCode();
    } else if (jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "clicked") {
        if(remotephone){
            if(!confirm("Are you sure you want to interrupt your current connection?")){
                return;
            } else {
                location.reload()
            }
        } else {
            document.getElementById("remote").setAttribute("name", "remote");
            $("#remotepagemobile").hide();
            document.getElementsByClassName("loadingcontainer")[1].style.display = "none";
            $("#mainpage").show();
        }
    } else if (!jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "clicked") {
        if(remoteaccess){
            if(!confirm("Are you sure you want to interrupt your current connection?")){
                return;
            } else {
                location.reload()
            }
        } else {
            document.getElementById("remote").setAttribute("name", "remote");
            $("#elementspc > h1").hide();
            $("#remotepagecomputer").hide();
            document.getElementsByClassName("loadingcontainer")[1].style.display = "none";
            $("#mainpage").show();
            socket.close();
        }
    }
}

$.get('./api/getsongs.php', function(result) {
    resultvar = result
}).then(setTimeout(function(result){
    result = resultvar;
    if (result == "NIGHT_EMPTY") {
        notify("No songs have been located on this server. Try again.", "error")
        console.log("test")
    } else {
        var amountofarticles = result.length;
        for (i = 0; amountofarticles > i; i++) {
            var musics = result[i].file;
            resultarray.push(
                "../songs/" + musics
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
            $(".song")[i].setAttribute("onclick", "selectSong('" + i + "',true)");
        }
        new SimpleBar($('#songcontainer')[0]);
        selectSong(0, false, true)
        Howler.volume(0.5)
    }
}, 3000));