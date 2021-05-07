import {mouseX} from './input'
import {mouseY} from './input'
import {getCurrentState} from "./state";
import {socket} from './networking'
import {eat} from "./index";

function lerp(start, end, t){
    return start*(1-t) + end * t;
}


function div(posX, posY, val){
    return {first: posX / val,
        second: posY / val
    };
}

function limit(posX, posY, max){
    const mSq = posX * posX + posY * posY;
    if (mSq > max * max) {
        posX = posX / Math.sqrt(mSq) * max;
        posY = posY / Math.sqrt(mSq) * max;
    }
    return {
        x: posX,
        y: posY
    }
}


function constrain(x, min, max) {
    return Math.max(Math.min(x, max), min);
}


export class Eat {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();

    }
}



export class Player {
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dir = Math.PI * 2;
        this.velocity = {
            x: 0,
            y: 0
        }

    }


    updateVel() {

        const angle = Math.atan2(mouseY - canvas.height / 2,
            mouseX - canvas.width / 2);
        this.dir = angle;
        var vel = {
            x: mouseX - canvas.width/2,
            y: mouseY - canvas.height/2,
            // x: mouseX - this.x,
            // y: mouseY - this.y
        }
        const divved = div(vel.x, vel.y, 10);
        vel.x = divved.first;
        vel.y = divved.second;

        // var Mag = Math.sqrt(vel.x * vel.x + vel.y * vel.y)
        // var newMag = 3;
        // this.velocity.x = vel.x * newMag / Mag;
        // this.velocity.y = vel.y * newMag / Mag;

        // lerpting to smoothness
        // vel.x = vel.x * newMag / Mag;
        // vel.y = vel.y * newMag / Mag;

        const limitted = limit(vel.x, vel.y, 4);
        vel.x = limitted.x;
        vel.y = limitted.y;



        this.velocity.x = lerp(this.velocity.x, vel.x, 0.1)
        this.velocity.y = lerp(this.velocity.y, vel.y, 0.1)
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

    constr(){
        this.x = constrain(this.x, -canvas.width, canvas.width)
        this.y = constrain(this.y, -canvas.height, canvas.height)
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    //  eats(other){
    //      var dist =  vecDist(this.x, this.y, other.x, other.y);
    //      if (dist < this.radius + other.radius){
    //          var square = this.radius * this.radius * Math.PI + other.radius * other.radius * Math.PI;
    //          this.radius = Math.sqrt(square / Math.PI);
    //         //  this.radius += other.radius;
    //          return true;
    //      }
    //      else {
    //          return false;
    //      }
    //  }
}

function vecDist(v1_x, v1_y, v2_x, v2_y){
    var d = Math.sqrt(Math.pow(v1_x-v2_x, 2) + Math.pow(v1_y-v2_y, 2));
    return d;
}


class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}


const canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var zoom = 1;


function render() {
    // console.log('try rendering')
    if (!getCurrentState()){
        console.log('no update yet for render')
        return;
    }
    const {me, others, bullets} = getCurrentState();
    if (!me || !others ){
        return;
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(canvas.width/2, canvas.height/2);
    var newZoom = 30 / me.r;
    zoom = lerp(zoom, newZoom, 0.1);
    c.scale(zoom, zoom);
    c.translate(-me.position.x, -me.position.y);
    for (var i = others.length - 1; i >= 0; --i){

        if (others[i].id !== socket.id){
            // console.log('drawing pllayer: '+ others[i].position.x + " " +  others[i].position.y + " " +  others[i].r)
            c.beginPath()
            c.arc(others[i].position.x, others[i].position.y, others[i].r, 0, Math.PI * 2, false);
            c.fillStyle = 'orange';
            c.fill();

            // c.beginPath();
            // c.fillStyle = "white";
            // c.textAlign = "center";
            // c.font = '10px serif';
            // c.fillText(players[i].id, players[i].x, players[i].y);
            // c.fill();
        }

    }

    eat.forEach((foody) => {
        foody.draw();
    })


    c.beginPath()
    c.arc(me.position.x, me.position.y, me.r, 0, Math.PI * 2, false);
    c.fillStyle = 'red';
    c.fill();
    bullets.forEach((bullet) => {
        c.beginPath()
        c.arc(bullet.position.x, bullet.position.y, 8   , 0, Math.PI * 2, false);
        c.fillStyle = 'red';
        c.fill();
    })

    c.restore();
}

var renderInterval = setInterval(() => {
    console.log('first try')
}, 1000/2)

export function startRendering() {
    clearInterval(renderInterval)
    renderInterval = setInterval(render, 1000/60);
}

export function stopRendering() {
    clearInterval(renderInterval);
    renderInterval = setInterval(() => {
        console.log('not rendering')
    }, 2000);
}