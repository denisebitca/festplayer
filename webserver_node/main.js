'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

function noop() {}

const uuidv4 = require('uuid/v4');
const rp = require('request-promise');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

var validcode;
var compid;

var desmond = [];
var moonbear = [];

var isclientregistered = false;
var isphoneregistered = false;

const server = createServer(app);
const wss = new WebSocket.Server({ server });

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
        uri: 'http://localhost/festplayer/api/verifycode.php',
        qs: {
            code: code
        },
        json: true
    };
     
    rp(options)
        .then(function (response) {
            sleep(5000)
            var answer = response;
            if(answer.validity){
                validcode = true;
            } else {
                validcode = false;
            }
        })
        .catch(function (err) {
            // API call failed...
    });
}

function removeCode(code){
    var options = {
        uri: 'http://localhost/festplayer/api/removecode.php',
        qs: {
            code: code
        },
        json: true
    };
     
    rp(options)
        .then(function (response) {
            sleep(5000)
            var answer = response;
            if(answer.status){
                return true;
            } else {
                return false;
            }
        })
        .catch(function (err) {
            // API call failed...
    });
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
            for(var i=0;i<desmond.length;i++){
                if(desmond[i].clientid == ws.id){
                    if(desmond[i].remoteid == data[0].remotecode){ 
                        ws.send('[{"status":"this_is_yours}]');
                        console.log(ws.id + " attempted to reregister his code " + data[0].remotecode)
                        return;
                    } else {
                        ws.send('[{"status":"already_registered"}]');
                        console.log(ws.id + " attempted to register code " + data[0].remotecode + " even though he already registered " + desmond[i].remoteid)
                        return;
                    }
                }
            }
            if(data[0].remotecode.length === 7){
                for(var i=0;i<desmond.length;i++){
                    if(desmond[i].remoteid == data[0].remotecode){
                        ws.send('[{"status":"code_already_registered"}]');
                        console.log(ws.id + " attempted to register code " + data[0].remotecode + " from " + desmond[i].clientid)
                        isclientregistered = true;
                        return;
                    }
                }
                ws.send('[{"status":"registering"}]');
                console.log(ws.id + " is attempting to register code " + data[0].remotecode)
                checkCodeValidity(data[0].remotecode);
                await sleep(2500)
                if(!isclientregistered){
                    if(validcode){
                        desmond.push({
                            clientid : ws.id,
                            remoteid : data[0].remotecode
                        })
                        ws.send('[{"status":"successfully_registered"}]')
                        console.log(ws.id + " registered code " + data[0].remotecode)
                    } else {
                        ws.send('[{"status":"invalid_code"}]')
                        console.log(data[0].remotecode)
                    }
                }
            }
        } else if (data[0].onmobile){
            for(var i=0;i<moonbear.length;i++){
                if(moonbear[i].phoneid == ws.id){
                    isphoneregistered = true;
                    return;
                    /*var songname = data[0].commandedsong;
                    //This is where the song commands will go
                    wss.clients.forEach(function each(client){
                        if(moonbear[i].computerid == client.id){
                            client.send('[{"commandedsong":"' + songname + '"}]')
                        }
                    })*/
                } else if(moonbear[i].remoteid == data[0].remotecode){
                    isphoneregistered = true;
                    ws.send('[{"status":"already_paired_code"}]');
                    return;
                }
            }
            if(data[0].hasOwnProperty("remotecode")){
                if(data[0].remotecode.length === 7){
                    ws.send('[{"status":"pairing"}]');
                    checkCodeValidity(data[0].remotecode);
                    await sleep(2500)
                    if(!isphoneregistered){
                        if(validcode){
                            for(var i=0;i<desmond.length;i++){
                                if(desmond[i].remoteid == data[0].remotecode){
                                    compid = desmond[i].clientid;
                                } else {
                                    ws.send('[{"status":"bored_security_researcher"}]');
                                    return;
                                }
                            }
                            moonbear.push({
                                phoneid : ws.id,
                                computerid : compid,
                                remoteid : data[0].remotecode
                            })
                            ws.send('[{"status":"establishing_connection"}]');
                            console.log(ws.id + " is attempting to pair with " + compid)
                            for(var i=0;i<moonbear.length;i++){
                                if(moonbear[i].phoneid == ws.id){
                                        wss.clients.forEach(function each(client){
                                            if(moonbear[i].computerid == client.id){
                                                client.send('[{"status":"successfully_paired"}]')
                                                ws.send('[{"status":"successfully_paired"}]')
                                                console.log(moonbear[i].computerid + " and " + moonbear[i].phoneid + " have paired together")
                                            }
                                        })
                                }
                            }
                        } else {
                            ws.send('[{"status":"invalid_code"}]')
                        }
                    }
                }
            }
        }
   });

    ws.on('close', function(data) {
        wss.clients.forEach(function each(client){
            for(var i=0;i<moonbear.length;i++){
                if(ws.id == client.id){
                    if(moonbear[i].computerid == client.id){
                        wss.clients.forEach(function each(client){
                            if(moonbear[i].phoneid == client.id){
                                client.send('[{"status":"pair_disconnected"}]')
                                console.log(moonbear[i].phoneid + " (phone) has lost connection with " + moonbear[i].computerid + " (computer)")
                                console.log(moonbear[i].remoteid + " has been revoked")
                                //removeCodePaired(moonbear[i].remoteid)
                                moonbear.splice(i,i+1)
                            }
                        })
                    } else if(moonbear[i].phoneid == client.id){
                        wss.clients.forEach(function each(client){
                            if(moonbear[i].computerid == client.id){
                                client.send('[{"status":"pair_disconnected"}]')
                                console.log(moonbear[i].computerid + " (computer) has lost connection with " + moonbear[i].phoneid + " (phone)")
                                console.log(moonbear[i].remoteid + " has been revoked")
                                //removeCodePaired(moonbear[i].remoteid)
                                moonbear.splice(i,i+1)
                            }
                        })
                    }
                }
            }
        })
        for(var i=0;i<desmond.length;i++){
            if(desmond[i].clientid == ws.id){
                removeCode(desmond[i].remoteid)
                console.log(desmond[i].remoteid + " has been revoked")
                desmond.splice(i,i+1);
            }
        }
        console.log(ws.id + " has disconnected.");
    });

});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
  
      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);

server.listen(3210, function() {
  console.log('Listening on http://localhost:3210');
});

