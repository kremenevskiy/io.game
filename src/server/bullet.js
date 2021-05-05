const MovableObject = require('./movableobject')
const Constants = require('../shared/constants')


class Bullet extends MovableObject {
    constructor(parentID, x, y, dir, speed = Constants.BULLET_SPEED){
        super(parentID, x, y, dir, speed);
        this.parentID = parentID;

    }
}


module.exports = Bullet;