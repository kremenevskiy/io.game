const canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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


var mouseX = 0;
var mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
})




class Eat {
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



class Player {
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: 0,
            y: 0
        }
    
    }


    updateVel() {
        
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

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); 
        c.fillStyle = this.color;
        c.fill();
     }

     eats(other){
         var dist =  vecDist(this.x, this.y, other.x, other.y);
         if (dist < this.radius + other.radius){
             var square = this.radius * this.radius * Math.PI + other.radius * other.radius * Math.PI;
             this.radius = Math.sqrt(square / Math.PI);
            //  this.radius += other.radius;
             return true;
         }
         else {
             return false;
         }
     }
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



const x = canvas.width / 2;
const y = canvas.height / 2;

var player = new Player(x, y, 30, 'blue');
eat = [];

const rand_col = () => {
    return Math.random() * 256;
}

N = 1000;
for(var i = 0; i < N; ++i){
    eat[i] = new Eat((Math.round(Math.random()) * 2 - 1) * Math.random() * canvas.width,(Math.round(Math.random()) * 2 - 1) *  Math.random() * canvas.height, 4, 
    `rgb(${rand_col()}, ${rand_col()}, ${rand_col()})`)
}


var projectiles = [];
 
// console.log(player);
setInterval(() => {
    console.log("player : " + player.x + " " + player.y);

}, 1000);



var zoom = 1;
function animate() {
    requestAnimationFrame(animate);
    
    c.clearRect(0, 0, canvas.width, canvas.height);
    // c.scale(30 / player.radius, 30/player.radius);
    c.save();
    // c.translate(canvas.width/2 -player.x, canvas.height/2 -player.y);
    c.translate(canvas.width/2, canvas.height/2)
    var newZoom = 30 / player.radius;
    zoom = lerp(zoom, newZoom, 0.1);
    c.scale(zoom, zoom);
    c.translate(-player.x, -player.y)
    player.draw();
    player.updateVel();
    
    
    

    
    eat.forEach((foody) => {
        foody.draw();
    })
    
    projectiles.forEach((projectile) => {
        projectile.update();
    })
    c.restore();

    for(var i = eat.length - 1; i >= 0; --i){
        if (player.eats(eat[i])){
            eat.splice(i, 1);
        }
    }

}


window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2);
    console.log(angle*180/Math.PI);

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(new Projectile(
        player.x, player.y,
        5, 'red', velocity
    ))
    
    console.log(projectiles.length);
})
animate();