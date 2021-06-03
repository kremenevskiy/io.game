import {updateLeaderboard} from "./leaderboard";
import {update_lvl_labels} from "./upgrade";

const upgradeMenu = document.getElementById('upgrade-menu');
const RENDER_DELAY = 100;

const gameUpdates = [];
let lastGameUpdate = null;
let got_update = false;


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
}


export function updateLabels(labels_data){
    update_lvl_labels(labels_data);
}


export function getCurrentState() {
    if (!got_update) {
        return false
    }
    return lastGameUpdate;
}

