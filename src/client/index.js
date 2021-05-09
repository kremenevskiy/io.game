import "@css/styles.css"
import {connect, play} from "./networking";
import {startCapturingInput, stopCapturingInput} from "./input"
import {startRendering, stopRendering} from "./render";
import {setLeaderboardHidden} from "./leaderboard";

const canvas = document.querySelector('canvas');
const playButton = document.getElementById('play-button');
const playMenu = document.getElementById('play-menu')
const usernameInput = document.getElementById('username-input')
const leaderboard = document.getElementById('leaderboard')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
export var canvasWidth = canvas.width;
export var canvasHeight = canvas.height


Promise.all([connect(onGameOver)])
    .then(() => {
        playMenu.classList.remove('hidden')
        usernameInput.focus();
        playButton.onclick = () => {playClicked()}
    })
    .catch(() => {})


function playClicked() {
    playMenu.classList.add('hidden')
    canvas.classList.remove('hidden')

    console.log('clicked button')
    play(usernameInput.value);
    startCapturingInput();
    setLeaderboardHidden(false)
    setTimeout(() => {
        startRendering()
    }, 100);
}


function onGameOver() {
    stopCapturingInput();
    stopRendering();
    playMenu.classList.remove('hidden');
    canvas.classList.add('hidden');
}