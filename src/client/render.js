import {mouseX} from './input'
import {mouseY} from './input'

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
export function animate(player, players, bullets, eat, socket) {
    // requestAnimationFrame(animate.bind(this));
    console.log("args: " + arguments)
    console.log('drawing bullets: ' + bullets.length);
    console.log('players: ' + players.length);
    c.clearRect(0, 0, canvas.width, canvas.height);
    // c.scale(30 / player.radius, 30/player.radius);
    c.save();
    // c.translate(canvas.width/2 -player.x, canvas.height/2 -player.y);
    c.translate(canvas.width/2, canvas.height/2)
    var newZoom = 30 / player.radius;
    zoom = lerp(zoom, newZoom, 0.1);
    c.scale(zoom, zoom);
    c.translate(-player.x, -player.y);


    for (var i = players.length - 1; i >= 0; --i){

        if (players[i].id !== socket.id){
            console.log('drawing pllayer: '+ players[i].position.x + " " +  players[i].position.y + " " +  players[i].r)
            c.beginPath()
            c.arc(players[i].position.x, players[i].position.y, players[i].r, 0, Math.PI * 2, false);
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


    player.draw();

    player.updateVel();
    player.constr();


    var data = {
        x: player.x,
        y: player.y,
        r: player.radius,
        id: socket.id
    };

    socket.emit('update_input', data);



    eat.forEach((foody) => {
        foody.draw();
    })

    // projectiles.forEach((projectile) => {
    //     projectile.update();
    // })

    if (bullets.length > 1) {
        console.log('drawing bullet!!')
    }
    bullets.forEach((bullet) => {
        c.beginPath()
        c.arc(bullet.position.x, bullet.position.y, 8   , 0, Math.PI * 2, false);
        c.fillStyle = 'red';
        c.fill();
    })

    c.restore();

    // for(var i = eat.length - 1; i >= 0; --i){
    //     if (player.eats(eat[i])){
    //         eat.splice(i, 1);
    //         socket.emit('updateeat', eat);
    //     }
    // }


    // socket.emit('updateeat', eat)

}