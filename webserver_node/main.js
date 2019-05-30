'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const request = require('request');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

function checkCodeValidity(code){
    /*request.get('http://localhost/festplayer/api/verifycode.php?code=' + code, { json: false }, (err, res, body) => {
        if (err) { return console.log(err); }
        var body = JSON.parse(body);
        if (body.validity == true){
            return true;
        } else {
            return false;
        }
    });*/
    var options = {
        uri: 'https://api.github.com/user/repos',
        qs: {
            access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
     
    rp(options)
        .then(function (repos) {
            console.log('User has %d repos', repos.length);
        })
        .catch(function (err) {
            // API call failed...
    });
}

function removeCode(code){
    request.get('http://localhost/festplayer/api/removecode.php?code=' + code, { json: false }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(JSON.stringify(body));
        if (body.status == true){
            return true;
        } else {
            return false;
        }
    });
}

wss.on('connection', function(ws) {
    var desmond = [];
    ws.id = uuidv4();
    ws.send('[{"status":"awaiting_registration"}]');

    ws.on('message', function incoming(data){
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
            if(!isclientregistered){
                if(checkCodeValidity(data[0].remotecode)){
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