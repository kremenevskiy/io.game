const Player = require('./player')
const Food = require('./food')
const Bullet = require('./bullet')



class PlayerFactory {
    constructor(props) {
        return new Player(props)
    }
}


class BulletFactory {
    constructor(props) {
        if (typeof props === "object"){
            const parentID = props.parentID
            const x = props.x
            const y = props.y
            const dir = props.dir
            const speed = props.speed
            const damage = props.damage
            const radius = props.radius
            const player_r = props.player_r
            const range_shoot = props.shoot_range
            return new Bullet(parentID, x, y, dir, speed, damage, radius, player_r, range_shoot)
        }
    }
}


class FoodFactory {
    constructor(props) {
        if (typeof props === "object"){
            let x = props.x
            let y = props.y
            let id = props.id
            return new Food(id, x, y)
        }
    }
}


class ObjectsFactory {
    constructor(type, props) {
        if (type === 'player') {
            return new PlayerFactory(props)
        }
        if (type === 'bullet') {
            return new BulletFactory(props)
        }
        if (type === 'food') {
            return new FoodFactory(props)
        }
    }
}

module.exports = ObjectsFactory;