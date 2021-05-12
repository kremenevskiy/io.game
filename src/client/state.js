import {updateLeaderboard} from "./leaderboard";

const upgradeMenu = document.getElementById('upgrade-menu');


const RENDER_DELAY = 100;

const gameUpdates = [];
var lastGameUpdate = null;
var got_update = false;

export function processGameUpdate(update) {
    got_update = true;
    lastGameUpdate = update;
    updateLeaderboard(update.leaderboard)
    if (update.me.update_points < 1) {
        upgradeMenu.classList.add('disabled');
    }
    else {
        upgradeMenu.classList.remove('disabled');
    }
    // console.log('got new update from server')
    // console.log(update)
}


export function getCurrentState() {
    if (!got_update) {
        return false
    }
    return lastGameUpdate;
}

