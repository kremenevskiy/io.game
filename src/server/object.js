const Vector = require('./vector')
const Constants = require('../shared/constants')

class Object {
    constructor(id, x, y){
        this.id = id;
        this.pos = new Vector(x, y);
        this.x = x;
        this.y = y;
    }

    checkMapConstraints() {
        return !!((Math.abs(this.pos.x) <= Constants.MAP_SIZE) && (Math.abs(this.pos.y) <= Constants.MAP_SIZE))
    }


    serializeForUpdate(){
        // console.log("Coordinates: X: " + this.pos + "Y: " + this.pos);
        // console.log(this.pos);
        return {
            id: this.id,
            position: {
                x: this.pos.x,
                y: this.pos.y
            },
            // x: this.pos.x,
            // y: this.pos.y,
            // xx: this.x,
            // yy: this.y
        };
    }
}


module.exports = Object;