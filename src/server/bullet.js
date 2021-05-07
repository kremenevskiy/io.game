const MovableObject = require('./movableobject')
const Constants = require('../shared/constants')


class Bullet extends MovableObject {
    constructor(parentID, x, y, dir, speed = Constants.BULLET_SPEED, damage = Constants.BULLET_DAMAGE,
                radius = Constants.BULLET_RADIUS){
        super(parentID, x, y, dir, speed);
        this.r = radius;
        this.parentID = parentID;
        this.damage = damage;
    }
}


module.exports = Bullet;