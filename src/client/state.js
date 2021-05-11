    import {updateLeaderboard} from "./leaderboard";

const RENDER_DELAY = 100;

const gameUpdates = [];
var lastGameUpdate = null;
var got_update = false;
export function processGameUpdate(update) {
    got_update = true;
    lastGameUpdate = update;
    updateLeaderboard(update.leaderboard)
    // console.log('got new update from server')
    // console.log(update)
}


export function getCurrentState() {
    if (!got_update) {
        return false
    }
    return lastGameUpdate;
}

