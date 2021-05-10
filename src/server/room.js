const Constants = require('../shared/constants')
const Player = require('./player')
const Bullet = require('./bullet')
const Food = require('./food')

class Room {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.bullets = [];
        this.max_food_amount = 100;
        this.foods = [];
        setInterval(this.update.bind(this), 1000/60);
        setInterval(this.updateFood.bind(this), 1000/5);
    }


    setup(){
        // adding start food
        const start_food_amount = 20;
        for(let i = 0; i < start_food_amount; ++i) {
            this.foods.push(this.generateOneFood());
        }
    }

    updateFood() {
        if (this.foods.length < this.max_food_amount) {
            var generate = Math.random();
            if (generate > 0.5){
                this.foods.push(this.generateOneFood());
            }
        }
    }


    generateOneFood(){
        const x = Math.floor((Math.random() * 2 - 1) * Constants.MAP_SIZE);
        const y = Math.floor((Math.random() * 2 - 1) * Constants.MAP_SIZE);
        const id = this.foods.length;
        return new Food(id, x, y);
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

    updatePlayerCanvas(playerId, canvas_size){
        this.players[playerId].canvas_size = canvas_size;
    }



    addBullet(bulletID, bullet_dir){
        const player = this.players[bulletID];

        const bullet_x = this.players[bulletID].pos.x;
        const bullet_y = this.players[bulletID].pos.y;
        this.bullets.push(new Bullet(bulletID, bullet_x, bullet_y, bullet_dir));
        // console.log('number of bullets: ' + this.bullets.length)
        console.log('made bullet by: ', player, ' bullet: ', this.bullets[this.bullets.length-1]);
        player.makeShoot(this.bullets[this.bullets.length - 1]);
    }


    applyCollisions(players, bullets){
        const destroyedBullets = [];
        for(let i = 0; i < bullets.length; ++i) {
            for(let j = 0; j < players.length; ++j) {
                const bullet = bullets[i];
                const player = players[j];

                if (bullet.parentID !== player.id &&
                    player.pos.dist(bullet.pos) <= player.r + bullet.r){
                    destroyedBullets.push(bullet);
                    player.takeBulletDamage(bullet.damage);
                    // console.log('player got damage ' + player.id + " from: " + this.players[bullet.id].id)
                    break;
                }
            }
        }
        return destroyedBullets;
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


        // check if players can eat food nearby and eat it
        Object.values(this.players).forEach(player => {
            for(let i = 0; i < this.foods.length; ++i) {
                if (player.eatsFood(this.foods[i])){
                    this.foods.splice(i, 1);
                }
            }
        })

        // Check if someone got damage
        // Give score to player hwo caused damage
        const destroyedBullets = this.applyCollisions(Object.values(this.players), this.bullets);
        destroyedBullets.forEach(b => {
            if (this.players[b.parentID]){
                this.players[b.parentID].causedDamage()
            }
        })
        this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));



        // check if can eat other players
        const all_players = Object.values(this.players);
        all_players.forEach(player => {
            all_players.filter(other => other!== player).forEach(other => {
                player.eatsPlayer(other);
            })
        })




        // check if there is dead players
        Object.keys(this.players).forEach(playerID => {
            const socket = this.sockets[playerID];
            const player = this.players[playerID];

            if (player.dead) {
                let aliveData = {
                    score: player.score
                }
                socket.emit(Constants.MSG_TYPES.GAME_OVER, aliveData);
                this.removePlayer(socket);
            }
        })



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
            let leaderboard = this.getLeaderboard(this.players[playerID])
            const socket = this.sockets[playerID];
            // console.log('*******************************')
            const player = this.players[playerID];
            // console.log('player before serializing');
            // console.log(player);
            // console.log('ser|||||||||ser')
            // console.log(player.serializeForUpdate());
            // console.log(this.createUpdate(player));
            // console.log('*******************************')

            socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));

        })
    }

    getLeaderboard(player) {
        let players = Object.values(this.players)
            .filter(p => p !== player)
            .sort((p1, p2) => p2.score - p1.score)
            .slice(0, 4);
        players.push(player);
        players.sort((p1, p2) => p2.score - p1.score);
        const player_pos = players.indexOf(player);

        return {
            players: players.map(p => ({username: p.username, score:Math.round(p.score)})),
            me_position: player_pos
        }
    }

    createUpdate(player, leaderboard){
        // console.log('sending update');
        var data = {
            me: player.serializeForUpdate(),
            others: Object.values(this.players).map(p => p.serializeForUpdate()),
            bullets: this.bullets.map(b => b.serializeForUpdate())
        };


        const visible_dist = player.canvas_size / 2 * Math.sqrt(2) * (30 / player.r);

        const nearbyPlayers = Object.values(this.players)
            .filter(p => p!==player && p.pos.dist(player.pos) <= visible_dist);
        const nearbyBullets = this.bullets.filter(b => b.pos.dist(player.pos) <= visible_dist);
        const nearbyFood = this.foods.filter(f => f.pos.dist(player.pos) <= visible_dist);

        // console.log(nearbyPlayers)

        // console.log(this.foods.map(f => f.serializeForUpdate()));
        // console.log(data);
        // console.log('before update:');
        // console.log(player)
        return {
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            bullets: nearbyBullets.map(b => b.serializeForUpdate()),
            food: nearbyFood.map(f => f.serializeForUpdate()),
            leaderboard: leaderboard
        }
    }
}


module.exports = Room;