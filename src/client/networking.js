import {throttle} from "throttle-debounce";
import {processGameUpdate, updateLabels} from "./state";
import {canvasWidth, canvasHeight} from "./index";

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
                socket.on(Constants.MSG_TYPES.UPDATE_LABELS, updateLabels)
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


export const play = player_data => {
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, player_data);

    const canvas_size = canvasWidth > canvasHeight ? canvasWidth : canvasHeight
    socket.emit(Constants.MSG_TYPES.CANVAS_GET, canvas_size);
}

export const updateDirection = throttle(100, (update_data) => {
    // console.log('sending new data to server');
    // console.log(update_data)
    socket.emit(Constants.MSG_TYPES.UPDATE_INPUT, update_data);
})

export const createBullet = throttle(100, (dir) => {
    socket.emit(Constants.MSG_TYPES.NEW_BULLET, dir);
})


// Update players

export const addDamage = (damageData) => {
    socket.emit(Constants.MSG_TYPES.DAMAGE_ADD, damageData);
}

export const decDamage = (damageData) => {
    socket.emit(Constants.MSG_TYPES.DAMAGE_DEC, damageData);
}

export const addReload = (reloadData) => {
    socket.emit(Constants.MSG_TYPES.RELOAD_ADD, reloadData);
}

export const addHealth = (healthData) => {
    socket.emit(Constants.MSG_TYPES.HEALTH_ADD, healthData);
}

export const addRange = (rangeData) => {
    socket.emit(Constants.MSG_TYPES.RANGE_ADD, rangeData);
}

export const addRegen = (regenData) => {
    socket.emit(Constants.MSG_TYPES.REGEN_ADD, regenData);
}

export const addSpeed = (speedData) => {
    socket.emit(Constants.MSG_TYPES.SPEED_ADD, speedData);
}