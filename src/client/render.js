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
    var newZoom = 30  / me.r;
    zoom = lerp(zoom, newZoom, 0.1);


    c.scale(zoom + 0.5, zoom + 0.5);
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


    // draw score_to_next lvl

    c.beginPath();
    c.fillStyle = 'yellow';
    c.fillRect(300, 100,  800, 10);
    c.fillStyle = 'blue';
    c.fillRect(300, 100,800 *  (1 - ((Math.pow(me.lvl, 2) - me.score_to_next_lvl) / Math.pow(me.lvl, 2))), 10);



    // Draw score
    c.beginPath();
    c.fillStyle = "black";
    c.textAlign = "center";
    c.font = '30px serif';
    let score_msg = "Score: " + me.score.toString();
    // console.log("mess: " + score_msg);
    c.fillText(score_msg, canvasWidth * 0.08, canvasHeight * 0.08);
    c.fill();

    // draw level
    c.beginPath();
    c.fillStyle = "black";
    c.textAlign = "center";
    c.font = '30px serif';
    let level_msg = "Level: " + me.lvl.toString();
    c.fillText(level_msg, canvasWidth * 0.08, canvasHeight * 0.15);


    // draw free point to update

    c.beginPath();
    c.fillStyle = "black";
    c.textAlign = "center";
    c.font = '30px serif';
    let points_msg = "Free points: " + me.update_points;
    c.fillText(points_msg, canvasWidth * 0.08, canvasHeight * 0.22);

}

var strokeColor = getRandomColor();

function renderPlayer(player) {
    // const {position, r, h, color } = player;
    c.beginPath();
    c.arc(player.position.x, player.position.y, player.r, 0, Math.PI * 2, false);
    c.fillStyle = player.color;
    c.fill();
    if (player.r < 30){
        c.lineWidth = 4;
    } else{
        c.lineWidth = player.r / 10;
    }
    c.strokeStyle = strokeColor;
    c.stroke();

    // draw health bar
    c.beginPath();
    c.fillStyle = 'white';
    c.fillRect(player.position.x - player.r * 0.8, player.position.y - 2, player.r * 2 * 0.8, 4);
    c.fillStyle = 'red';
    c.fillRect(player.position.x - player.r * 0.8, player.position.y - 2,player.r * 2 * (1 - ((player.hp_max - player.hp) / player.hp_max)) * 0.8 , 4);

    c.fillStyle = player.color;
    c.textAlign = 'center';



    // draw nickname
    c.beginPath();
    let font_size = Math.floor((player.r / 2.7)).toString() + 'px';
    let font = " Comic Sans MS";

    c.font = player.r > 35 ? font_size + font : "15px Comic Sans MS";
    let text_offset = player.r < 30 ? 5 : 10;

    c.strokeStyle = strokeColor;
    c.lineWidth = 4;
    c.strokeText(player.nickname, player.position.x, player.position.y - text_offset);
    c.fillStyle = 'white';
    c.fillText(player.nickname, player.position.x, player.position.y - text_offset);


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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = "#";
    for (var i = 0; i < 6; ++i) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
