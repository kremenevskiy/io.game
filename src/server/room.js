const Constants = require('../shared/constants')
const Player = require('./player')
const Bullet = require('./bullet')
const Food = require('./food')
const updatePlayerData = require('./server')
const ObjectsFactory = require('./objectsFactory')

class Room {
    constructor() {
        this.sockets = {}; // словарь подлюченных сокетов
        this.players = {}; // словарь подлюченных игроков
        this.bullets = []; // все живые пули
        this.food_amount_max = Constants.MAP_SIZE / 3;
        this.foods = []; // вся еда на карте
        setInterval(this.update.bind(this), 1000/60); // устанавливаемм частоту посылок данных на клиента
        setInterval(this.updateFood.bind(this), 1000/5); // частота добавления игры на карту
        this.players_lvl_max = 20; // максимальный уровень игрока
    }


    setup(){
        // adding start food
        const start_food_amount = 200;
        for(let i = 0; i < start_food_amount; ++i) {
            this.foods.push(this.generateOneFood());
        }
    }


    updateFood() {
        if (this.foods.length < this.food_amount_max) {
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
        const food_data = {
            id: id,
            x: x,
            y: y
        }
        return new ObjectsFactory('food', food_data);
    }


    addPlayer(socket, player_data){
        this.sockets[socket.id] = socket;
        const x = Math.floor((Math.random() * 2 - 1) * Constants.MAP_SIZE);
        const y = Math.floor((Math.random() * 2 - 1) * Constants.MAP_SIZE);
        const r = Math.floor(Math.random() * Constants.PLAYER_RADIUS + 10);
        this.players[socket.id] = new Player(socket.id, player_data.gameUsername, x, y, r, player_data.isLogged, player_data.usernameLogged);
        console.log('Created player on | X: ' + x + "Y: " + y);
    }


    updatePlayerCanvas(playerId, canvas_size){
        this.players[playerId].canvas_size = canvas_size;
    }


    addBullet(bulletID, bullet_dir){
        const player = this.players[bulletID];
        if (!player){
            return;
        }
        if (!player.checkShootIsPossible()){

            return;
        }
        if(player.canShoot()) {

            const bullet_x = this.players[bulletID].pos.x;
            const bullet_y = this.players[bulletID].pos.y;
            const bullet_data = {
                parentID: bulletID,
                x: bullet_x,
                y: bullet_y,
                dir: bullet_dir,
                speed: player.bullet_speed,
                damage: player.damage,
                radius: player.bullet_radius,
                player_r: player.r,
                range_shoot: player.shoot_range
            }
            // this.bullets.push(new Bullet(bulletID, bullet_x, bullet_y, bullet_dir, player.bullet_speed,
            //     player.damage, player.bullet_radius,  player.r, player.shoot_range));
            this.bullets.push(new ObjectsFactory('bullet', bullet_data))
            player.makeShoot(this.bullets[this.bullets.length - 1]);
        }
    }


    updatePlayerDecorator(playerID, update_data) {
        const vel_x = update_data.vel_mid.x;
        const vel_y = update_data.vel_mid.y;

        if (Math.abs(vel_x) <= 2  && Math.abs(vel_y) <= 2) {
            this.players[playerID].vel_mid.x = 0;
            this.players[playerID].vel_mid.y = 0;
            return;
        }
        this.updatePlayer(playerID, update_data);
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
                    break;
                }
            }
        }
        return destroyedBullets;
    }


    updatePlayer(playerID, update_data){
        if (this.players[playerID]) {
            const dir = update_data.dir;
            const vel_mid_x = update_data.vel_mid.x;
            const vel_mid_y = update_data.vel_mid.y;
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

        // check can it move further - bullet range
        this.bullets.forEach(bullet => {
            if (!bullet.canMoveFurther()){
                bulletsToRemove.push(bullet);
            }
        })

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
                    score: player.score,
                    username: player.server_name
                }
                if (player.isLogged){
                    updatePlayerData.do(aliveData).then(r => console.log(r));
                }

                socket.emit(Constants.MSG_TYPES.GAME_OVER, aliveData);
                this.removePlayer(socket);
            }
        })

        // send update for each player
        Object.keys(this.sockets).forEach(playerID => {
            let leaderboard = this.getLeaderboard(this.players[playerID])
            const socket = this.sockets[playerID];
            const player = this.players[playerID];
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
        let data = {
            me: player.serializeForUpdate(),
            others: Object.values(this.players).map(p => p.serializeForUpdate()),
            bullets: this.bullets.map(b => b.serializeForUpdate())
        };

        let newZoom = 30 / player.r;
        player.zoom = lerp(player.zoom, newZoom, 0.1);

        const visible_dist = player.canvas_size / 2 * Math.sqrt(2) / (player.zoom + 0.5);
        const nearbyPlayers = Object.values(this.players)
            .filter(p => p!==player && p.pos.dist(player.pos) <= visible_dist);
        const nearbyBullets = this.bullets.filter(b => b.pos.dist(player.pos) <= visible_dist);
        const nearbyFood = this.foods.filter(f => f.pos.dist(player.pos) <= visible_dist);

        return {
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            bullets: nearbyBullets.map(b => b.serializeForUpdate()),
            food: nearbyFood.map(f => f.serializeForUpdate()),
            leaderboard: leaderboard
        }
    }


    upgradePlayer(playerID, skill_data){
        if (!this.players[playerID]){
            return;
        }
        if (!(this.players[playerID].player_lvl < this.players_lvl_max)){
            return;
        }
        let points_cost = 1;
        if (skill_data === 'damage_add' || skill_data === 'damage_decrease'){
            points_cost = 0;
        }
        if (this.players[playerID].server_name !== "admin") {
            if (!this.players[playerID].try_to_update(points_cost)){
                return false;
            }
        }
        if (skill_data === 'damage_add'){
            this.players[playerID].addDamage();
        }
        else if(skill_data === 'damage_decrease'){
            this.players[playerID].decDamage();
        }
        else if(skill_data === 'reload'){
            this.players[playerID].addReload();
        }
        else if(skill_data === 'range'){
            this.players[playerID].addRange();
        }
        else if(skill_data === 'health'){
            this.players[playerID].addHealth();
        }
        else if(skill_data === 'speed'){
            this.players[playerID].addSpeed();
        }
        else if(skill_data === 'regen'){
            this.players[playerID].addRegen();
        }
        const player = this.players[playerID];

        const update_lvl_data = {
            damageUpLvl: player.damage_lvl,
            damageDecLvl: player.damage_lvl,
            speedLvl: player.speed_lvl,
            reloadLvl: player.reload_lvl,
            healthLvl: player.hp_lvl,
            rangeLvl: player.range_lvl,
            regenLvl: player.regen_lvl
        }
        this.sockets[playerID].emit(Constants.MSG_TYPES.UPDATE_LABELS, update_lvl_data);
    }
}


function lerp(start, end, t){
    return start * (1-t) + end * t;
}


module.exports = Room;