const Object = require('./object');
const Constants = require('./constants')

class Food extends Object {
    constructor(id, x, y, color) {
        super(id, x, y);
        this.r = Constants.FOOD_RADIUS;
        this.color = color;
    }


    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            color: this.color,
            r: this.r
        }

    }
}

module.exports = Food;