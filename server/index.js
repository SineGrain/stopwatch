var https = require("https");
var fs = require("fs");
const express = require('express');
const app = express();
// const http = require('http');
const server = https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert"),
    },
    app
  );
const { Server } = require("socket.io");
const { join } = require('path')
const readline = require('readline');
const DECK = require("../shared/constants/deck")
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.get(['/', '/control'], (req, res) => {
    res.sendFile(join(__dirname, '../client/build/index.html'));
});

app.use('/stopwatch', express.static(join(__dirname, '../client/build')))

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('selectedCard', (item)=> {
        if (DECK.findIndex(itm => itm === item) > -1) {
            console.log('selectedCard', item)
            io.emit('selectedCard', item)
        }
    })

});



server.listen(4000, () => {
    console.log('listening on *:4000');
});


readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

// listen to keypress
let comb = ['', '']
let combIndex = true
process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name == "s") console.log("save")

    if (key.ctrl && key.name == "c") process.exit()
    console.log('key')
    if (key.name === 'space') {
        comb[0] = ''
        comb[1] = ''
    } else {
        if (combIndex) {
            comb[0] = key.name
            combIndex = false
        } else {
            comb[1] = key.name
            combIndex = true
        }
    }
    const cardMaybe = `${comb[0].toLowerCase()}${comb[1].toLowerCase()}`
    console.log('cardMaybe', cardMaybe)
    if (DECK.findIndex(itm => itm === cardMaybe) > -1) {
        console.log(`emitting ${cardMaybe}`)
        io.emit('selectedCard', cardMaybe)
        comb[0] = ''
        comb[1] = ''
        combIndex = true
    }


})
