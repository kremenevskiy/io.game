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


    constrain(min, max) {
        const x = this.pos.x
        const y = this.pos.y
        this.pos.x = Math.max(Math.min(x, max), min);
        this.pos.y = Math.max(Math.min(y, max), min);
        return this.pos
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