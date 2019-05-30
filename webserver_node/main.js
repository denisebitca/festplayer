'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const rp = require('request-promise');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

var validcode;

const server = createServer(app);
const wss = new WebSocket.Server({ server });

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
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
    var desmond = [];
    ws.id = uuidv4();
    ws.send('[{"status":"awaiting_registration"}]');

    ws.on('message', async function incoming(data){
        var isclientregistered = false;
        try {
            var data = JSON.parse(data);
        } catch(error){
            ws.send('[{"status":"invalid_query"}]');
            return;
        }
        if(data[0].remotecode.length === 7){
            console.log(data)
            for(var i=0;i<desmond.length;i++){
                if(desmond[i].clientid == ws.id){
                    isclientregistered = true;
                }
            }
            ws.send('[{"status":"registering"}]');
            checkCodeValidity(data[0].remotecode);
            await sleep(5000)
            if(!isclientregistered){
                if(validcode){
                    desmond.push({
                        clientid : ws.id,
                        remoteid : data[0].remotecode
                    })
                    ws.send('[{"status":"successfully_registered"}]')
                } else {
                    ws.send('[{"status":"invalid_code"}]')
                    console.log(data[0].remotecode)
                }
            } else {
                ws.send('[{"status":"already_registered"}]')
            }
            console.log(JSON.stringify(desmond));
        }
    });

    ws.on('close', function(data) {
        for(var i=0;i<desmond.length;i++){
            if(desmond[i].clientid == ws.id){
                removeCode(desmond[i].remoteid);
                desmond.splice(i,i+1);
            }
        }
        console.log(ws.id + " has disconnected.");
        console.log(JSON.stringify(desmond));
    });

});

server.listen(3210, function() {
  console.log('Listening on http://localhost:3210');
});