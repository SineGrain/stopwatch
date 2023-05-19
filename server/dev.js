
const { join } = require('path')
const readline = require('readline');
const express = require('express');
const DECK = require("../shared/constants/deck")

module.exports = (app, io) => {
    app.get(['/', '/control'], (req, res) => {
        res.sendFile(join(__dirname, '../client/build/index.html'));
    });
    
    app.use('/stopwatch', express.static(join(__dirname, '../client/build')))
    
    
    
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
    
}

