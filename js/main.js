/*
Festplayer v1 - main.js
by rdb-github
*/
var resultarray = [];
console.log("Festplayer v1");

window.onload = function() {
    document.getElementById('remote').addEventListener('click', function(e) {
        remotecontrol();
    });
    document.getElementById("loading").style.display = "block";
};

var socket;
var remote = false;
var remoteaccess;
var remotephone = false;
var playings = false;
var sound;
var resultvar;
var loop = false;

function isOpen(ws) { return ws.readyState === ws.OPEN }

function steamrolla(modaltext, reload){
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

function closepopup(){
    $(".tingle-modal__close")[0].click()
}

$.get('./api/getsongs.php', function(result) {
    resultvar = result
}).then(setTimeout(function(result){
    result = resultvar;
    if (result == "NIGHT_EMPTY") {
        steamrolla("No songs have been located on this server. Try again.",false)
        console.log("test")
    } else {
        var amountofarticles = result.length;
        for (i = 0; amountofarticles > i; i++) {
            var music = result[i].file;
            resultarray.push(
                "../songs/" + music
            );
        }
        console.log(resultarray);
        for (i = 0; amountofarticles > i; i++) {
            if (i == 0) {
                document.getElementById("loading").style.display = "none";
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
            $(".song")[i].setAttribute("onclick", "selectSong('" + i + "')");
        }
        $('.song')[0].setAttribute("style", "filter: invert(1)");
        $('.song')[0].setAttribute("name", "selected");
        /*audiojs.events.ready(function() {
            var as = audiojs.createAll();
        });*/
        sound = new Howl({
            src: [resultarray[0]],
            html5: true,
            autoplay: false,
            loop: loop
        });
        new SimpleBar($('#songcontainer')[0]);
        var buttons = $('<i></i>').attr({
            "class": "material-icons",
            "onclick": "playPause()",
            "id": "playpause",
            "name": "play_circle_filled"
        })
        buttons.text("play_circle_filled");
        var repeat = $('<i></i>').attr({
            "class": "material-icons",
            "onclick": "repeat()",
            "id": "repeat",
            "name": "norepeat"
        });
        repeat.text("repeat_one");
        var slider = $('<input></input>').attr({
            "id": "vol-control",
            "type": "range",
            "min": "0",
            "max": "100",
            "step": "1",
            "oninput": "setVolume(this.value)"
        });
        var volume = $('<i></i>').attr({
            "class": "material-icons",
            "onclick": "volume()",
            "id": "volume",
            "name": "sliderhide"
        });
        volume.text("volume_up");
        $('#footer').append(buttons);
        $('#footer').append(repeat);
        $('#footer').append(slider);
        $('#footer').append(volume);
    }
}, 3000));

function selectSong(song) {
    if ($(".song")[song].getAttribute("name") == "selected") {
        playPause();
    } else {
        if(!remotephone){
            $('.song[name=selected]')[0].setAttribute("style", "");
            $('.song[name=selected]')[0].setAttribute("name", "");
            if(playings == true){
                sound.pause()
                sound = undefined;
                playings = false;
            }
            sound = new Howl({
                src: [resultarray[song]],
                html5: true,
                autoplay: true,
                loop: loop,
                onplay: function(){document.title = $(".songname")[song].innerHTML + " | Festplayer"},
                onpause: function(){document.title = "Festplayer"}
            });
            document.getElementById("playpause").innerHTML = "pause_circle_filled";
            playings = true;
            $('.song')[song].setAttribute("style", "filter: invert(1)");
            $('.song')[song].setAttribute("name", "selected");
            $('.song')[song].scrollIntoView();
        } else {
            $('.song[name=selected]')[0].setAttribute("style", "");
            $('.song[name=selected]')[0].setAttribute("name", "");
            document.title = "Festplayer";
            document.title = resultarray[song].replace("../songs/", "").replace(".mp3", "") + " | Festplayer";
            $('.song')[song].setAttribute("style", "filter: invert(1)");
            $('.song')[song].setAttribute("name", "selected");
            playings = true;
            if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
            socket.send('[{"onmobile":true,"song":' + song + '}]');
            document.getElementById("playpause").innerHTML = "pause_circle_filled";
        } 
    }
}

function repeat() {
    if(remotephone){
        if (document.getElementById("repeat").getAttribute("name") == "norepeat") {
            document.getElementById("repeat").setAttribute("name", "repeat-one");
            if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
            socket.send('[{"onmobile":true,"repeat":true}]');
        } else if (document.getElementById("repeat").getAttribute("name") == "repeat-one") {
            document.getElementById("repeat").setAttribute("name", "norepeat");
            if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
            socket.send('[{"onmobile":true,"repeat":false}]');
        }
    } else {
        if (document.getElementById("repeat").getAttribute("name") == "norepeat") {
            document.getElementById("repeat").setAttribute("name", "repeat-one");
            sound.loop(true);
            loop = true;
        } else if (document.getElementById("repeat").getAttribute("name") == "repeat-one") {
            document.getElementById("repeat").setAttribute("name", "norepeat");
            sound.loop(false);
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
        if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
        socket.send('[{"onmobile":true,"volume":' + svolume + '}]');
    } else {
        if(Howler.state === "running"){
            sound.volume(svolume / 100);
        }
    }
}

function playPause(){
    if(remotephone){
        if(playings == true){
            document.getElementById("playpause").innerHTML = "play_circle_filled"
            if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
            socket.send('[{"onmobile":true,"playing":false}]');   
            playings = false;   
        } else {
            document.getElementById("playpause").innerHTML = "pause_circle_filled"
            if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
            socket.send('[{"onmobile":true,"playing":true}]'); 
            playings = true;
        }
    } else {
        if(playings == true){
            document.getElementById("playpause").innerHTML = "play_circle_filled"
            sound.pause();
            playings = false;   
        } else {
            document.getElementById("playpause").innerHTML = "pause_circle_filled"
            sound.play();
            playings = true;
        }
    }
}

(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);


function checkCode(code){
    socket = new WebSocket('ws://' + location.hostname + ':3210');

    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    socket.onmessage = function (event) {
        if(JSON.parse(event.data)[0].hasOwnProperty("status")){
            var status = JSON.parse(event.data)[0].status;
            if(status == "awaiting"){
                $.get('./api/verifycode.php?code=' + code, function(result) {
                    if(result.validity){
                        console.log("yay")
                    } else {
                        throw("error");
                    }
                }).then(function(){
                    if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
                    socket.send('[{"onmobile":true,"remotecode":"' + code + '"}]');
                })
                setInterval(function(){
                    if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
                },30000)
            } else if(status == "pairing"){

            } else if(status == "establishing_connection"){
                
            } else if(status == "successfully_paired_with_computer"){
                remotephone = true;
                $("#remotepagemobile").hide();
                /*$("#audiojs_wrapper0").hide();
                $("#playpause").show();*/
                $("#mainpage").show();
                steamrolla("Remote control has been enabled. Click on the remote to disconnect.", false)
            } else if(status == "command_successful"){
                console.log("Command successful")
            
            } else if (status == "computer_disconnected") {
                steamrolla("Your computer disconnected.", true)
                return;
            } else if (status == "invalid_code") {
                steamrolla("Wrong code, please try again.", false)
                return;
            } else {
                console.error("Odd error, please check websocket error message: " + status);
                return;
            }
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
                    if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
                    socket.send('[{"remotecode":"' + code + '"}]');
                })
                setInterval(function(){
                    if (!isOpen(socket)) steamrolla("You've been disconnected. Your page will reload now.", true)
                },30000)
            } else if(status == "registering"){
                console.log("Code is being registered");
            } else if(status == "successfully_registered"){
                console.log("Code registered successfully!");
                document.getElementById("code").innerHTML = code;
                $("#elementspc > h1:nth-child(1)").show();
                $("#elementspc > h1:nth-child(3)").show();
                $("#elementspc > h1:nth-child(4)").show();
            } else if(status == "successfully_paired_with_phone"){
                $("#elementspc > h1:nth-child(1)").hide();
                $("#elementspc > h1:nth-child(3)").hide();
                $("#elementspc > h1:nth-child(4)").hide();
                $(".material-icons")[0].setAttribute("style","pointer-events:none");
                $(".material-icons")[1].setAttribute("style","pointer-events:none");
                for (i = 0; resultarray.length > i; i++) {
                    $(".song")[i].setAttribute("onclick","");
                }
                $("#remotepagecomputer").hide();
                document.getElementById("code").innerHTML = "Loading...";
                steamrolla("Remote control has been enabled. Click on the remote to disconnect. The buttons on your computer have been disabled, use your phone to control the player instead.", false)
                setTimeout(closepopup,5000)
                remoteaccess = true;
                $("#mainpage").show();
            } else if(status == "phone_disconnected"){
                if(sound.playing()){
                    playPause();
                }
                steamrolla("Your phone disconnected.", true)
                remoteaccess = false;
            } else if(status == "pause"){
                playPause();
            } else if(status == "play"){
                playPause();
            } else {
                console.error("Odd error, please check websocket error message: " + status);
                return;
            }
        } else if(remoteaccess){
            if (JSON.parse(event.data)[0].hasOwnProperty("volume")){
                setVolume(JSON.parse(event.data)[0].volume);
            } else if(JSON.parse(event.data)[0].hasOwnProperty("song")){
                selectSong(JSON.parse(event.data)[0].song)
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
    if(sound.playing()){
        playPause();
    }
    if (jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "remote") {
        document.getElementById("remote").setAttribute("name", "clicked");
        $("#mainpage").hide();
        $("#remotepagemobile").attr("style", "display:flex;");
    } else if (!jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "remote") {
        $("#mainpage").hide();
        $("#remotepagecomputer").attr("style", "display:flex;");
        document.getElementById("remote").setAttribute("name", "clicked");
        getCode();
    } else if (jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "clicked") {
        if(remotephone){
            //do things
            if(!confirm("Are you sure you want to interrupt your current connection?")){
                return;
            } else {
                location.reload()
            }
        }
        document.getElementById("remote").setAttribute("name", "remote");
        $("#remotepagemobile").hide();
        $("#mainpage").show();
        if(remotephone){
            socket.close();
        }
    } else if (!jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "clicked") {
        if(remoteaccess){
            //do things
            if(!confirm("Are you sure you want to interrupt your current connection?")){
                return;
            } else {
                location.reload()
            }
        }
        document.getElementById("remote").setAttribute("name", "remote");
        $("#elementspc > h1:nth-child(1)").hide();
        $("#elementspc > h1:nth-child(3)").hide();
        $("#elementspc > h1:nth-child(4)").hide();
        $("#remotepagecomputer").hide();
        document.getElementById("code").innerHTML = "Loading...";
        $("#mainpage").show();
        socket.close();
    }
}