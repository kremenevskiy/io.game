const Constants = require('../shared/constants')
const Player = require('./player')
const Bullet = require('./bullet')

class Room {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.bullets = [];
        setInterval(this.update.bind(this), 1000/60);
    }

    addPlayer(socket, username='krem'){
        this.sockets[socket.id] = socket;
        const x = Math.floor((Math.random() * 2 - 1) * Constants.MAP_SIZE);
        const y = Math.floor((Math.random() * 2 - 1) * Constants.MAP_SIZE);
        const r = Math.floor(Math.random() * Constants.PLAYER_RADIUS + 20);
        this.players[socket.id] = new Player(socket.id, username, x, y, r);
        console.log('Created player on | X: ' + x + "Y: " + y);
        // console.log('after creation new player:');
        // console.log(this.players[socket.id]);
    }


    addBullet(bulletID, bullet_dir){
        const bullet_x = this.players[bulletID].pos.x;
        const bullet_y = this.players[bulletID].pos.y;
        this.bullets.push(new Bullet(bulletID, bullet_x, bullet_y, bullet_dir));
        // console.log('number of bullets: ' + this.bullets.length)
    }


    updatePlayer(playerID, update_data){


        // console.log("player to update id: " + playerID);
        // console.log("players: ");
        // Object.keys(this.players).forEach(p => {
        //     console.log(p);
        // })
        if (this.players[playerID]) {
            // console.log('updating him:')
            // console.log(this.players[playerID])
            // console.log("with: x:" + x + "y: " + y + "dir: " + dir)
            const dir = update_data.dir;
            const vel_mid_x = update_data.vel_mid.x;
            const vel_mid_y = update_data.vel_mid.y;

            // console.log('dir: ' + dir + " x: " + vel_mid_x + "y: " + vel_mid_y)

            this.players[playerID].vel_mid.x = vel_mid_x;
            this.players[playerID].vel_mid.y = vel_mid_y;
            this.players[playerID].updateDirection(dir);
        }
    }

    removePlayer(socket){
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    update(){
        // update each bullet
        const bulletsToRemove = [];
        this.bullets.forEach(bullet => {
            bullet.update();
            if (!bullet.checkMapConstraints()){
                bulletsToRemove.push(bullet);
            }
        });
        this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

        // update every player position
        Object.values(this.players).forEach(player => player.update());


        // console.log('\t\t\t\t\t------------------uuuuuuupdate')
        // console.log(this.players)


        // update each player
        // Object.keys(this.players).forEach(playerID => {
        //     this.players[playerID].update(); // create update
        // })


        // send update for each player
        // console.log('\t\t\t\t\t-----------------------------')
        // console.log(this.players)
        // console.log('making update game to client:')
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            // console.log('*******************************')
            const player = this.players[playerID];
            // console.log('player before serializing');
            // console.log(player);
            // console.log('ser|||||||||ser')
            // console.log(player.serializeForUpdate());
            // console.log(this.createUpdate(player));
            // console.log('*******************************')

            socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
        })
    }

    createUpdate(player){
        // console.log('sending update');
        var data = {
            me: player.serializeForUpdate(),
            others: Object.values(this.players).map(p => p.serializeForUpdate()),
            bullets: this.bullets.map(b => b.serializeForUpdate())
        };
        // console.log(data);
        // console.log('before update:');
        // console.log(player)
        return {
            me: player.serializeForUpdate(),
            others: Object.values(this.players).map(p => p.serializeForUpdate()),
            bullets: this.bullets.map(b => b.serializeForUpdate())
        }
    }
}


module.exports = Room;