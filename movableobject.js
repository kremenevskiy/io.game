const Object = require('./object')

class MovableObject extends Object {
    constructor(id, x, y, dir, speed){
        super(id, x, y);
        this.dir = dir;
        this.speed = speed;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.dir,
        }
    }
}


module.exports = MovableObject;