import {throttle} from "throttle-debounce";

const Constants = require('../shared/constants');

var socket = io.connect('localhost:3000', {reconnection: false})

const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
        console.log('Connected to server!');
        resolve();
    });
});


export const connect = onGameOver => {
    connectedPromise.then(() => {
        socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
        socket.on('disconnect', () => {
            console.log('Disconnected from server')
        })
    })
}


export const play = username => {
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
}

export const updateDirection = throttle(1000, dir => {
    socket.emit(Constants.MSG_TYPES.UPDATE_INPUT, dir);
})

