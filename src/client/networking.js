import {throttle} from "throttle-debounce";
import {processGameUpdate} from "./state";

const Constants = require('../shared/constants');
export var socket = io.connect('localhost:3000', {reconnection: false})


export const connectedPromise = new Promise(resolve => {
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

export const updateDirection = throttle(100, (update_data) => {
    // console.log('sending new data to server');
    // console.log(update_data)
    socket.emit(Constants.MSG_TYPES.UPDATE_INPUT, update_data);
})

export const createBullet = dir => {
    socket.emit(Constants.MSG_TYPES.NEW_BULLET, dir);
}

