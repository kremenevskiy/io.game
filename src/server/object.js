const Vector = require('./vector')
const Constants = require('../shared/constants')

class Object {
    constructor(id, x, y){
        this.id = id;
        this.pos = new Vector(x, y);
    }


    checkMapConstraints() {
        return !!((Math.abs(this.pos.x) <= Constants.MAP_SIZE) && (Math.abs(this.pos.y) <= Constants.MAP_SIZE))
    }


    serializeForUpdate(){
        return {
            id: this.id,
            position: {
                x: this.pos.x,
                y: this.pos.y
            },
        };
    }
}


module.exports = Object;