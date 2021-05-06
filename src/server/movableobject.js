const Object = require('./object')

class MovableObject extends Object {
    constructor(id, x, y, dir, speed){
        super(id, x, y);
        this.dir = dir;
        this.speed = speed;
    }

    update() {
        this.pos.x += Math.cos(this.dir) * this.speed;
        this.pos.y += Math.sin(this.dir) * this.speed;
    }


    updateDirection(dir) {
        this.dir = dir;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.dir,
        }
    }
}


module.exports = MovableObject;