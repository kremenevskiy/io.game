const MovableObject = require('./movableobject')
const Constants = require('../shared/constants')
const Vector = require('./vector')

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = "#";
    for (var i = 0; i < 6; ++i) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class Player extends MovableObject {
    constructor(id, username, x, y, r) {
        // console.log('-------------------------');
        // var args = [...arguments];
        //
        // console.log(username)
        // console.log(x + " | " + y + " | " + r)
        // console.log("agruments:-------------------------")
        // console.log(args)
        super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYERS_SPEED)
        this.username = username;
        this.hp = Constants.PLAYER_MAX_HP;
        this.score = 0;
        this.r = r;
        this.vel_mid = new Vector(0, 0);
        this.velocity = new Vector(-1, 1);
        this.color = getRandomColor();
        this.damage = Constants.BULLET_DAMAGE;

    }

    update(){
        // console.log("updating player from: x: " + this.pos.x + "y: " + this.pos.y)
        var vel = new Vector(this.vel_mid.x, this.vel_mid.y)
        // console.log("vel to update: x:" + vel.x + " y: " + vel.y);
        vel.div(10);
        vel.limit(4);
        // console.log("\t\t\tvelocity new  to update: x:" + this.velocity.x + " y: " + this.velocity.y);

        this.velocity.lerp(vel, 0.1);
        // console.log("\t\t\tvelocity lerp:: x:" + this.velocity.x + " y: " + this.velocity.y);

        this.pos.add(this.velocity);
        this.constrain(-Constants.MAP_SIZE + this.r, Constants.MAP_SIZE - this.r);
        // console.log("to x: " + this.pos.x + "y: " + this.pos.y)

    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            r: this.r,
            hp: this.hp,
            color: this.color
        }
    }

    eatsFood(food){
        var dist = this.pos.dist(food.pos);
        if (dist < this.r + food.r){
            var square_area = this.r * this.r * Math.PI + food.r * food.r * Math.PI;
            this.r = Math.sqrt(square_area / Math.PI);
            // this.r += food.r * 5;
            return true;
        }
        else {
            return false;
        }
    }


    takeBulletDamage(damage=Constants.BULLET_DAMAGE){
        this.hp -= damage;
        if (this.hp < 0){
            this.hp = 0;
        }
    }

    causedDamage(scoreHit=Constants.SCORE_BULLET_HIT){
        this.score += scoreHit;
    }
}

module.exports = Player;