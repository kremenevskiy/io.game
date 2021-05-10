import {getCurrentState} from "./state";
import Constants from "@constants/constants"
import {canvasHeight, canvasWidth} from "./index";


const canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var zoom = 1;
function render() {
    // console.log('start rendering')

    if (!getCurrentState()){
        // console.log('no update yet for render');
        return;
    }

    const {me, others, bullets, food} = getCurrentState();

    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(canvas.width/2, canvas.height/2);
    var newZoom = 30 / me.r;
    zoom = lerp(zoom, newZoom, 0.1);
    c.scale(zoom, zoom);
    c.translate(-me.position.x, -me.position.y);


    // draw boundaries
    c.fillStyle = 'black';
    c.lineWidth = 1;
    c.strokeRect(-Constants.MAP_SIZE, -Constants.MAP_SIZE, Constants.MAP_SIZE*2, Constants.MAP_SIZE*2);


    food.forEach(foody => renderFood(foody));
    bullets.forEach(bullet => renderBullet(bullet));


    others.forEach(player => renderPlayer(player));
    renderPlayer(me);

    c.restore();



    // Draw score
    c.s
    c.fillText(me.score.toString(), canvasWidth * 0.5, canvasHeight * 0.5);
}


function renderPlayer(player) {
    // const {position, r, h, color } = player;
    c.beginPath();
    c.arc(player.position.x, player.position.y, player.r, 0, Math.PI * 2, false);
    c.fillStyle = player.color;
    c.fill();

    // draw health bar
    c.fillStyle = 'white';
    c.fillRect(player.position.x - player.r * 0.8, player.position.y - 2, player.r * 2 * 0.8, 4);
    c.fillStyle = 'red';
    c.fillRect(player.position.x - player.r * 0.8, player.position.y - 2,player.r * 2 * (1 - ((Constants.PLAYER_MAX_HP - player.hp) / Constants.PLAYER_MAX_HP)) * 0.8 , 4);

    c.fillStyle = player.color;
    console.log(player.nickname, player.position.x - player.r - 5, player.position.y - player.r - 5);
    c.fillText(player.nickname, player.position.x - player.r - 5, player.position.y - player.r - 5);
    // c.strokeText(player.nickname, player.position.x - player.r - 5, player.position.y - player.r - 5);
}


function renderBullet(bullet) {
    c.beginPath();
    c.arc(bullet.position.x, bullet.position.y, bullet.r, 0, Math.PI * 2, false);
    c.fillStyle = 'red';
    c.fill();
}


function renderFood(food){
    c.beginPath();
    c.arc(food.position.x, food.position.y, food.r, 0, Math.PI * 2, false);
    c.fillStyle = food.color;
    c.fill();
}

let renderInterval = null;

export function startRendering() {
    clearInterval(renderInterval)
    renderInterval = setInterval(render, 1000/60);
}


export function stopRendering() {
    clearInterval(renderInterval);
}

// interpolation function to smoothly difference
function lerp(start, end, t){
    return start * (1-t) + end * t;
}