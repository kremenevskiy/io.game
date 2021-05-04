const MovableObject = require('./movableobject')


class Bullet extends MovableObject {
    constructor(parentID, x, y, dir){
        super(parentID, x, y, dir);
        this.parentID = parentID;
    }

    update() {
        this.pos.x += Math.cos(this.dir);
        this.pos.y += Math.sin(this.dir);
    }
}


module.exports = Bullet;