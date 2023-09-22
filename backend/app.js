


const path = require('path');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const express = require('express');
const app = express(),
bodyParser = require("body-parser");
port = 3080;
const WebSocket = require('ws');
const cors = require('cors');


app.use(bodyParser.json());
app.use(cors());

//app.use(express.static(process.cwd()+"../client/dist"));
app.use(express.static(path.resolve(__dirname, '../client/dist/client')));

app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/client', 'index.html'));
  });

const server = app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

app.post("/webhook", (req, res) => {
  console.log(req.body)
  const webhookString = JSON.stringify(req.body); 
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(webhookString);
    }
  });
  res.sendStatus(200);
})

const wss = new WebSocket.Server({ port:3081 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


  myEmitter.on('error', (err) => {
    console.error('An error occurred:', err);
  });