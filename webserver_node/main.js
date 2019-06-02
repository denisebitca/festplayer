'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

function noop() {}

const args = process.argv[2];

const uuidv4 = require('uuid/v4');
const rp = require('request-promise');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

var validcode;
var compid;

var desmond = [];
var moonbear = [];

const server = createServer(app);
const wss = new WebSocket.Server({ server });

if(args === undefined || args === "" || args === null){
    throw("Correct syntax is: node main.js ip")
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function heartbeat() {
    this.isAlive = true;
}

function checkCodeValidity(code){
    var options = {
        uri: 'http://' + args + '/festplayer/api/verifycode.php',
        qs: {
            code: code
        },
        json: true
    };
     
    rp(options)
        .then(function (response) {
            var answer = response;
            if(answer.validity){
                validcode = true;
            } else {
                validcode = false;
            }
        })
        .catch(function (err) {
            console.error("Code verification failed.")
    });
}

function removeCode(code){
    var options = {
        uri: 'http://' + args + '/festplayer/api/removecode.php',
        qs: {
            code: code
        },
        json: true
    };
     
    rp(options)
        .then(function (response) {
            var answer = response;
            if(answer.status){
                return true;
            } else {
                console.error("Code removal failed.")
            }
        })
        .catch(function (err) {
            console.error("Code removal failed.")
    });
}

function phoneRegister(i){
    wss.clients.forEach(function each(client){
        if(moonbear[i].phoneid == client.id){
           client.registered = true;
        }
    })
}

function clientRegister(i){
    wss.clients.forEach(function each(client){
        if(desmond[i].clientid == client.id){
           client.registered = true;
        }
    })
}

function isphoneRegistered(id){
    wss.clients.forEach(function each(client){
        if(id == client.id){
           if(client.registered == true){
                return true;
           } else {
                return false;
           }
        }
    })
}

function isclientregistered(id){
    wss.clients.forEach(function each(client){
        if(id == client.id){
            if(client.registered == true){
                return true;
            } else {
                return false;
            }
        }
    })
}

wss.on('connection', function(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.id = uuidv4();
    console.log(ws.id + " has connected.")
    ws.send('[{"status":"awaiting"}]');

    ws.on('message', async function incoming(data){
        try {
            var data = JSON.parse(data);
        } catch(error){
            ws.send('[{"status":"invalid_query"}]');
            return;
        }
        if(!data[0].onmobile){
            if(data[0].hasOwnProperty("remotecode")){
                var stringtest = data[0].remotecode.replace(/[^A-Za-z0-9]+/gm, "");
                if(stringtest.length != 7){
                    ws.send('[{"status":"invalid_code"}]');
                    return;
                }
                if(data[0].remotecode.length === 7){
                    for(var i=0;i<desmond.length;i++){
                        if(desmond[i].clientid == ws.id){
                            if(desmond[i].remoteid == data[0].remotecode){ 
                                ws.send('[{"status":"this_is_yours"}]');
                                console.log(ws.id + " attempted to reregister his code " + data[0].remotecode)
                                return;
                            } else {
                                ws.send('[{"status":"already_registered"}]');
                                console.log(ws.id + " attempted to register code " + data[0].remotecode + " even though he already registered " + desmond[i].remoteid)
                                return;
                            }
                        }
                        if(desmond[i].remoteid == data[0].remotecode){
                            ws.send('[{"status":"code_already_registered"}]');
                            console.log(ws.id + " attempted to register code " + data[0].remotecode + " from " + desmond[i].clientid)
                            clientRegister(i);
                            return;
                        }
                    }
                    ws.send('[{"status":"registering"}]');
                    console.log(ws.id + " is attempting to register code " + data[0].remotecode)
                    checkCodeValidity(data[0].remotecode);
                    await sleep(2500)
                    if(!isclientregistered()){
                        if(validcode){
                            desmond.push({
                                clientid : ws.id,
                                remoteid : data[0].remotecode
                            })
                            ws.send('[{"status":"successfully_registered"}]')
                            console.log(ws.id + " registered code " + data[0].remotecode)
                            if (ws.readyState != ws.OPEN) {
                                for(var i=0;i<desmond.length;i++){
                                    if(desmond[i].clientid == ws.id){
                                        removeCode(desmond[i].remoteid)
                                        console.log(desmond[i].remoteid + " has been revoked because " + ws.id + " disconnected.")
                                        desmond.splice(i,i+1);
                                    }
                                }
                            }
                        } else {
                            ws.send('[{"status":"invalid_code"}]')
                            console.log(ws.id + " tried to register invalid code " + data[0].remotecode)
                        }
                    }
                }
            } else if(data[0].hasOwnProperty("duration")){
                if(isNaN(data[0].duration)) return;
                var durationcheck = false;
                for(var i=0;i<moonbear.length;i++){
                    if(moonbear[i].computerid == ws.id){
                        wss.clients.forEach(function each(client){
                            if(moonbear[i].phoneid == client.id){
                                client.send('[{"duration":"' + data[0].duration + '"}]')
                                durationcheck = true;
                            }
                        })
                    }
                }
                if(!durationcheck){
                    ws.send('[{"status":"invalid_query_durationcheck"}]');
                }
            } else if(data[0].hasOwnProperty("loading")){
                var loading = data[0].loading;
                if (typeof loading === "boolean"){
                    var loadingcheck = false;
                    for(var i=0;i<moonbear.length;i++){
                        if(moonbear[i].computerid == ws.id){
                            wss.clients.forEach(function each(client){
                                if(moonbear[i].phoneid == client.id){
                                    if(loading){
                                        client.send('[{"status":"loading"}]')
                                    } else if(!loading){
                                        client.send('[{"status":"loaded"}]')
                                    } else {
                                        return;
                                    }
                                    loadingcheck = true;
                                }
                            })
                        }
                    }
                    if(!loadingcheck){
                        ws.send('[{"status":"invalid_query_loadingcheck"}]');
                    }
                } else {
                    ws.send('[{"status":"invalid_command"}]')
                    return; 
                }
            } else if(data[0].hasOwnProperty("playing")){
                var playing = data[0].playing;
                if (typeof playing === "boolean"){
                    var playingcheck = false;
                    for(var i=0;i<moonbear.length;i++){
                        if(moonbear[i].computerid == ws.id){
                            wss.clients.forEach(function each(client){
                                if(moonbear[i].phoneid == client.id){
                                    if(playing || !playing){
                                        client.send('[{"playing":' + playing + '}]')
                                    } else {
                                        return;
                                    }
                                    playingcheck = true;
                                }
                            })
                        }
                    }
                    if(!playingcheck){
                        ws.send('[{"status":"invalid_query_playingcheck"}]');
                    }
                } else {
                    ws.send('[{"status":"invalid_command"}]')
                    return; 
                }              
            } else if(data[0].hasOwnProperty("repeat")){
                var repeat = data[0].repeat;
                if (typeof repeat === "boolean"){
                    var repeatcheck = false;
                    for(var i=0;i<moonbear.length;i++){
                        if(moonbear[i].computerid == ws.id){
                            wss.clients.forEach(function each(client){
                                if(moonbear[i].phoneid == client.id){
                                    if(repeat || !repeat){
                                        client.send('[{"repeat":' + repeat + '}]')
                                    } else {
                                        return;
                                    }
                                    repeatcheck = true;
                                }
                            })
                        }
                    }
                    if(!repeatcheck){
                        ws.send('[{"status":"invalid_query_repeatcheck"}]');
                    } 
                } else {
                    ws.send('[{"status":"invalid_command"}]')
                    return; 
                }               
            } else if(data[0].hasOwnProperty("song")){
                if(isNaN(data[0].song)) return;
                var songcheck = false;
                for(var i=0;i<moonbear.length;i++){
                    if(moonbear[i].computerid == ws.id){
                        wss.clients.forEach(function each(client){
                            if(moonbear[i].phoneid == client.id){
                                client.send('[{"song":"' + data[0].song + '"}]')
                                songcheck = true;
                            }
                        })
                    }
                }
                if(!songcheck){
                    ws.send('[{"status":"invalid_query_songcheck"}]');
                }               
            } else {
                ws.send('[{"status":"invalid_command"}]')
                return;
            }
        } else if (data[0].onmobile){
            for(var i=0;i<moonbear.length;i++){
                if(moonbear[i].phoneid == ws.id){
                    phoneRegister(i);
                    if(data[0].hasOwnProperty("volume")){
                        var volume = data[0].volume;
                        if(!isNaN(volume) && 0 <= volume && volume <= 100){
                            wss.clients.forEach(function each(client){
                                if(moonbear[i].computerid == client.id){
                                    client.send('[{"volume":"' + volume + '"}]')
                                    ws.send('[{"status":"command_successful"}]')
                                    console.log(ws.id + " set volume on " + moonbear[i].computerid + " to " + volume)
                                }
                            })
                            return;
                        } else {
                            ws.send('[{"status":"invalid_command"}]')
                            return;
                        }
                    } else if(data[0].hasOwnProperty("playing")) {
                        var playing = data[0].playing;
                        if (typeof playing === "boolean"){
                            wss.clients.forEach(function each(client){
                                if(moonbear[i].computerid == client.id){
                                    if (playing){
                                        client.send('[{"status":"play"}]')
                                        ws.send('[{"status":"command_successful"}]')
                                        console.log(ws.id + " resumed playback on " + moonbear[i].computerid)
                                    } else if (!playing) {
                                        client.send('[{"status":"pause"}]')
                                        ws.send('[{"status":"command_successful"}]')
                                        console.log(ws.id + " paused playback on " + moonbear[i].computerid)
                                    }
                                }
                            })
                            return;
                        } else {
                            ws.send('[{"status":"invalid_command"}]')
                            return;
                        }
                    } else if(data[0].hasOwnProperty("repeat")) {
                        var repeat = data[0].repeat;
                        if (typeof repeat === "boolean"){
                            wss.clients.forEach(function each(client){
                                if(moonbear[i].computerid == client.id){
                                    client.send('[{"repeat":"' + repeat + '"}]')
                                    ws.send('[{"status":"command_successful"}]')
                                    console.log(ws.id + " set repeat on " + moonbear[i].computerid + " to " + repeat)
                                }
                            })
                            return;
                        } else {
                            ws.send('[{"status":"invalid_command"}]')
                            return;
                        }
                    } else if(data[0].hasOwnProperty("song")){
                        var song = data[0].song;
                        if(!isNaN(song)){
                            wss.clients.forEach(function each(client){
                                if(moonbear[i].computerid == client.id){
                                    client.send('[{"song":"' + song + '"}]')
                                    ws.send('[{"status":"command_successful"}]')
                                    console.log(ws.id + " set the song on " + moonbear[i].computerid + " to song number " + song)
                                }
                            })
                            return;
                        } else {
                            ws.send('[{"status":"invalid_command"}]')
                            return;
                        }
                    } else {
                        ws.send('[{"status":"invalid_command"}]')
                    } 
                    return;
                } else if(moonbear[i].remoteid == data[0].remotecode){
                    phoneRegister(i);
                    ws.send('[{"status":"already_paired_code"}]');
                    console.log(ws.id + " tried to pair with " + moonbear[i].computerid + ", using code " + data[0].remotecode + ", both already paired with " + moonbear[i].phoneid)
                    return;
                }
            }
            if(data[0].hasOwnProperty("remotecode")){
                if(data[0].remotecode.length === 7){
                    if(desmond.length == 0){
                        ws.send('[{"status":"impossible"}]');
                        return;
                    }
                    for(var i=0;i<desmond.length;i++){
                        if(desmond[i].remoteid == data[0].remotecode){
                            compid = desmond[i].clientid;
                        }
                    }
                    ws.send('[{"status":"pairing"}]');
                    checkCodeValidity(data[0].remotecode);
                    await sleep(2500)
                    if(!isphoneRegistered(ws.id)){
                        if(validcode){
                            ws.send('[{"status":"establishing_connection"}]');
                            console.log(ws.id + " is attempting to pair with " + compid);
                            moonbear.push({
                                phoneid : ws.id,
                                computerid : compid,
                                remoteid : data[0].remotecode
                            })
                            for(var i=0;i<moonbear.length;i++){
                                if(moonbear[i].phoneid == ws.id){
                                        wss.clients.forEach(function each(client){
                                            if(moonbear[i].computerid == client.id){
                                                client.send('[{"status":"successfully_paired_with_phone"}]')
                                                ws.send('[{"status":"successfully_paired_with_computer"}]')
                                                console.log(moonbear[i].computerid + " (computer) and " + moonbear[i].phoneid + " (phone) have paired together")
                                                client.type = "computer";
                                                ws.type = "phone";
                                                //pairCode(moonbear[i].remoteid);
                                            }
                                        })
                                }
                            }
                        } else {
                            ws.send('[{"status":"invalid_code"}]')
                        }
                    } else {
                        console.log("ruhoh")
                    }
                }
            }
        }
   });

    ws.on('close', function(data) {
        var dealt = false;
        for(var i=0;i<moonbear.length;i++){
            if(moonbear[i].phoneid == ws.id){
                wss.clients.forEach(function each(client){
                    if(moonbear[i].computerid == client.id){
                        client.send('[{"status":"phone_disconnected"}]')
                    }
                })
                console.log(moonbear[i].phoneid + " (phone) has disconnected, therefore losing connection with " + moonbear[i].computerid + " (computer)")
                console.log(moonbear[i].remoteid + " has been revoked")
                removeCode(moonbear[i].remoteid)
                for(var f=0;f<desmond.length;f++){
                    if(moonbear[i].remoteid == desmond[f].remoteid){
                        desmond.splice(f,f+1)
                    }
                }
                moonbear.splice(i,i+1)
                dealt = true;
            } else if(moonbear[i].computerid == ws.id){
                wss.clients.forEach(function each(client){
                    if(moonbear[i].phoneid == client.id){
                        client.send('[{"status":"computer_disconnected"}]')
                    }
                })
                console.log(moonbear[i].computerid + " (computer) has disconnected, therefore losing connection with " + moonbear[i].phoneid + " (phone)")
                console.log(moonbear[i].remoteid + " has been revoked")
                removeCode(moonbear[i].remoteid)
                moonbear.splice(i,i+1)
                dealt = true;
            }
        }
        if(dealt){
            return;
        } else {
            for(var i=0;i<desmond.length;i++){
                if(desmond[i].clientid == ws.id){
                    removeCode(desmond[i].remoteid)
                    console.log(desmond[i].remoteid + " has been revoked")
                    desmond.splice(i,i+1);
                }
            }
        }
        console.log(ws.id + " has disconnected.");
    });

});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false){
            ws.terminate();
        }
      ws.isAlive = false;
      ws.ping(console.log(ws.id + " has been pinged"));
    });
  }, 60000);

server.listen(3210, function() {
  console.log('Listening on http://' + args + ':3210');
});