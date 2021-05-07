const MovableObject = require('./movableobject')
const Constants = require('../shared/constants')
const Vector = require('./vector')

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
        this.constrain(-Constants.MAP_SIZE, Constants.MAP_SIZE);
        // console.log("to x: " + this.pos.x + "y: " + this.pos.y)

    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            r: this.r,
            hp: this.hp
        }
    }

    eats(other){
        var dist = this.pos.dist(other.pos);
        if (dist < this.r + other.r){
            var square = this.r * this.r * Math.PI + other.r * other.r * Math.PI;
            this.r = Math.sqrt(square / Math.PI);
           //  this.radius += other.radius;
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = Player;