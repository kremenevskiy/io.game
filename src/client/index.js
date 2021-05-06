import "@css/styles.css"

import {connect, play} from "./networking";
import {startCapturingInput, stopCapturingInput} from "./input"
import {startRendering, stopRendering} from "./render";


import {Player} from './render';
import {Eat} from './render'
import {animate} from './render';

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export var canvasWidth = canvas.width;
export var canvasHeight = canvas.height


const x = canvas.width / 2;
const y = canvas.height / 2;
const rand_col = () => {
    return Math.random() * 256;
}
export var eat = [];
// var player = new Player(Math.random() * x, Math.random() * y, Math.random() * 30 + 10, 'blue');
const N = 100;
for(let i = 0; i < N; ++i){
    eat[i] = new Eat((Math.round(Math.random()) * 2 - 1) * Math.random() * canvas.width,(Math.round(Math.random()) * 2 - 1) *  Math.random() * canvas.height, 4,
        `rgb(${rand_col()}, ${rand_col()}, ${rand_col()})`)
}


const playButton = document.getElementById('play-button');

console.log('doing promise')
Promise.all([connect(onGameOver())]).then(() => {
        playButton.onclick = () => {
            console.log('clicked button')
            play("krem");
            startCapturingInput();
            setTimeout(() => {
                startRendering()
                console.log('now starting rendering')
            }, 1000);
        };
    }).catch(console.error);


function onGameOver() {
    stopCapturingInput();
    stopRendering();
}





// var data = {
//     x: player.x,
//     y: player.y,
//     r: player.radius,
//     dir: player.dir,
// };


// socket.emit('join_game', data);

//
// var bullets = [];
// var players = [];
// socket.on('game_update',
//     function(data) {
//         // console.log("update");
//         // console.log(data);
//         player.x = data.me.position.x;
//         player.y = data.me.position.y;
//         players = data.others;
//         bullets = data.bullets;
//         // console.log('res bullets:' + bullets.length)
//     }
// );


// startListen(socket, player);

// var projectiles = [];


// setInterval( () => {
//     animate(player, players, bullets, eat, socket);
// }, 10)
