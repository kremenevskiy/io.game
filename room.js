const Constants = require('./constants')
const Player = require('./player')

class Room {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.bullets = [];
    }

    addPlayer(socket, username='krem'){
        this.sockets[socket.id] = socket;
        const x = Math.floor(Math.random() * Constants.MAP_SIZE);
        const y = Math.floor(Math.random() * Constants.MAP_SIZE);
        const r = Math.floor(Math.random() * Constants.PLAYER_RADIUS + 10);
        this.players[socket.id] = new Player(socket.id, username, x, y, r);
    }

    removePlayer(socket){
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    update(){
        // update each bullet
        const bulletsToRemove = [];
        this.bullets.forEach(bullet => {
            if (!bullet.update()){
                bulletsToRemove.push(bullet);
            }
        });
        this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

        // update each player
        Object.keys(players).forEach(playerID => {
            this.players[playerID].update(); // create update
        })


        // send update for each player
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            const player = this.players[playerID];
            socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
        })
    }

    createUpdate(player){
        return {
            me: player.serializeForUpdate(),
            others: Object.values(players).map(p => p.serializeForUpdate()),
            bullets: bullets.map(b => b.serializeForUpdate())
        }
    }
}


module.exports = Room;