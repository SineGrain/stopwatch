var https = require("https");
var fs = require("fs");
const express = require('express');
const app = express();
const DECK = require("../shared/constants/deck")
const dev = require('./dev')
const http = require('http')
const DEV = false;
const PORT = DEV ? 4000 : (process.env.PORT || 8080)

const server = DEV ? https
  .createServer(
    DEV ? {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.cert"),
    }: {},
    app
  ): http.createServer();

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('selectedCard', (item)=> {
        if (DECK.findIndex(itm => itm === item) > -1) {
            console.log('selectedCard', item)
            io.emit('selectedCard', item)
        }
    })

});



server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

if(DEV){
    dev(app, io);
}
