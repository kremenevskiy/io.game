const MovableObject = require('./movableobject')
const Constants = require('./constants')

class Player extends MovableObject {
    constructor(id, x, y, r) {
        super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYERS_SPEED)
        // this.username = username;
        this.hp = Constants.PLAYER_MAX_HP;
        this.score = 0;
        this.r = r;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
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