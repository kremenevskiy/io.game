import "@css/styles.css"

var socket = io.connect('http://localhost:3000', {reconnection: false});


import {Player} from './render';
import {Eat} from './render'
import {animate} from './render';
import {startListen} from './input';

const canvas = document.querySelector('canvas');



const x = canvas.width / 2;
const y = canvas.height / 2;
const rand_col = () => {
    return Math.random() * 256;
}

var eat = [];
var player = new Player(Math.random() * x, Math.random() * y, Math.random() * 30 + 10, 'blue');
const N = 100;
for(let i = 0; i < N; ++i){
    eat[i] = new Eat((Math.round(Math.random()) * 2 - 1) * Math.random() * canvas.width,(Math.round(Math.random()) * 2 - 1) *  Math.random() * canvas.height, 4,
        `rgb(${rand_col()}, ${rand_col()}, ${rand_col()})`)
}

var data = {
    x: player.x,
    y: player.y,
    r: player.radius,
    dir: player.dir,
};


socket.emit('join_game', data);


var bullets = [];
var players = [];
socket.on('game_update',
    function(data) {
        // console.log("update");
        // console.log(data);
        players = data.others;
        bullets = data.bullets;
        // console.log('res bullets:' + bullets.length)
    }
);


startListen(socket, player);

var projectiles = [];


setInterval( () => {
    animate(player, players, bullets, eat, socket);
}, 10)
