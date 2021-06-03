const MovableObject = require('./movableobject')
const Constants = require('../shared/constants')
const Vector = require('./vector')


class Bullet extends MovableObject {
    constructor(parentID, x, y, dir, speed = Constants.BULLET_SPEED, damage = Constants.BULLET_DAMAGE,
                radius = Constants.BULLET_RADIUS, player_r, range_shoot=Constants.BULLET_MIN_RANGE_SHOOT){
        super(parentID, x, y, dir, speed);
        this.r = radius;
        this.parentID = parentID;
        this.damage = damage;
        this.startPosition = new Vector(x, y);
        this.range_shot = range_shoot + player_r;
    }


    canMoveFurther() {
        return this.pos.dist(this.startPosition) < this.range_shot;
    }


    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            r: this.r
        }
    }
}


module.exports = Bullet;