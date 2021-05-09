import {throttle} from "throttle-debounce";
import {processGameUpdate} from "./state";
const Constants = require('@constants/constants');

export var socket = io.connect(window.location.host, {reconnection: false})


const connectedPromise = new Promise((resolve, reject) => {
    let connected = false;
    const timeOut = 300;
    socket.on('connect', () => {
        connected = true;
        resolve('Connected to server');
    })
    setTimeout(() => {
        if (!connected) {
            reject('Couldn\'t connect to server.\n' +
                'Socket timeout');
        }
    }, timeOut)

});


export const connect = onGameOver => {
    return new Promise((resolve, reject) => {
        connectedPromise
            .then((successMsg) => {
                console.log(successMsg)
                socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
                socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver)
                socket.on('disconnect', onDisconnected);
                resolve();
            })
            .catch((errorMsg) => {
                console.error(errorMsg)
                reject();
            })
    })
}


function onDisconnected() {
    console.log('Disconnected from server');
    document.getElementById('disconnect-modal').classList.remove('hidden');
    document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
    }
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

