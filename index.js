const canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
})


var mouseX = 0;
var mouseY = 0;

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
        var Mag = Math.sqrt(vel.x * vel.x + vel.y * vel.y)
        var newMag = 3;
        this.velocity.x = vel.x * newMag / Mag;
        this.velocity.y = vel.y * newMag / Mag;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); 
        c.fillStyle = this.color;
        c.fill();
     }
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

for(var i = 0; i < 100; ++i){
    eat[i] = new Eat((Math.round(Math.random()) * 2 - 1) * Math.random() * canvas.width,(Math.round(Math.random()) * 2 - 1) *  Math.random() * canvas.height, 4, 
    `rgb(${rand_col()}, ${rand_col()}, ${rand_col()})`)
}


var projectiles = [];
 
// console.log(player);
setInterval(() => {
    console.log("player : " + player.x + " " + player.y);

}, 1000);

function animate() {
    requestAnimationFrame(animate);
    
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(canvas.width/2 -player.x, canvas.height/2 -player.y);
    player.draw();
    player.updateVel();
    
    

    
    eat.forEach((foody) => {
        foody.draw();
    })
    
    projectiles.forEach((projectile) => {
        projectile.update();
    })
    c.restore();

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
        canvas.weight/2, canvas.height/2,
        5, 'red', velocity
    ))
    
    console.log(projectiles.length);
})
animate();