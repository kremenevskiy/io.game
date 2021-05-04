const Vector = require('./vector')

class Object {
    constructor(id, x, y){
        this.id = id;
        this.pos = new Vector(x, y);
    }

    serializeForUpdate(){
        return {
            id: this.id,
            position: {
                x: this.pos.x,
                y: this.pos.y
            }
        };
    }
}


module.exports = Object;