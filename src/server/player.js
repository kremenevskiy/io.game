const MovableObject = require('./movableobject')
const Constants = require('../shared/constants')

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

    }

    update(x, y, dir){
        this.pos.x = x;
        this.pos.y = y;
        this.dir = dir;
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