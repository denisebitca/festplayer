'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function(ws) {
    var desmond = [];
    ws.id = uuidv4();
    ws.send('[{"status":"awaiting_registration"}]');

    ws.on('message', function incoming(data){
        var isclientregistered = false;
        console.log(data)
        try {
            var data = JSON.parse(data);
        } catch(error){
            ws.send('[{"status":"incorrect_syntax"}]');
        }
        if(data[0].remotecode.length === 7){
            for(var i=0;i<desmond.length;i++){
                if(desmond[i].clientid == ws.id){
                    isclientregistered = true;
                }
            }
            if(!isclientregistered){
                desmond.push({
                    clientid : ws.id,
                    remoteid : data[0].remotecode
                })
                ws.send('[{"status":"successfully_registered"}]')
            } else {
                ws.send('[{"status":"already_registered"}]')
            }
            console.log(JSON.stringify(desmond));
        }
    });

    ws.on('close', function(data) {
        for(var i=0;i<desmond.length;i++){
            if(desmond[i].clientid == ws.id){
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