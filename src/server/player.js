const MovableObject = require('./movableobject')
const Constants = require('../shared/constants')
const Vector = require('./vector')

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = "#";
    for (var i = 0; i < 6; ++i) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class Player extends MovableObject {
    constructor(id, username, x, y, r) {
        // console.log('-------------------------');
        // var args = [...arguments];
        //
        // console.log(username)
        // console.log(x + " | " + y + " | " + r)
        // console.log("agruments:-------------------------")
        // console.log(args)
        super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYERS_SPEED)
        this.username = username;
        this.hp = Constants.PLAYER_MAX_HP;
        this.hp_max = Constants.PLAYER_MAX_HP;
        this.score = 0;
        this.r = r;
        this.vel_mid = new Vector(0, 0);
        this.velocity = new Vector(-1, 1);
        this.color = getRandomColor();


        this.damage = Constants.BULLET_DAMAGE;
        this.canvas_size = Constants.MAP_SIZE;
        this.dead = false;


        this.player_lvl = 1;
        this.progress_to_next_lvl = 0;
        this.points_to_upgrade = 0;


        this.damage_lvl = 1;
        this.speed_lvl = 1;
        this.hp_lvl = 1;
        this.reload_lvl = 1;
        this.range_lvl = 1;
        this.speed_lvl = 1;
        this.damage_lvl = 1;
        this.regen_lvl = 1;



        // shooting
        this.shooting_reload_time = 200;
        this.can_shoot = true;




        // for scaling
        this.zoom = 1;

        this.shoot_range = Constants.BULLET_MIN_RANGE_SHOOT;
        this.bullet_speed = Constants.BULLET_SPEED;

        this.bullet_radius = Constants.BULLET_RADIUS;



        // Regen
        this.start_regen = false;

        this.health_regen_time = 100;
        this.timeout_regen_time = Constants.PLAYER_MAX_REGEN_TIME;
        this.regen_amount_hp = 1;

        this.regInt = null;
        this.regTime = null;

    }


    canShoot(){
        if (this.can_shoot){
            this.can_shoot = false;
            setTimeout(() => {
               this.can_shoot = true;
            }, this.shooting_reload_time);

            return true;
        }
        return false;
    }

    checkShootIsPossible(){

        let this_square = Math.PI * this.r * this.r;
        let bullet_square = Math.PI * this.bullet_radius * this.bullet_radius;


        // console.log('player r: ', this.r)
        // console.log('bullet r: ', this.bullet_radius)
        // console.log('player square: ', this_square)
        // console.log('bullet square: ', bullet_square)

        return (this_square - bullet_square) > this_square * 0.5;

    }




    update(){
        // console.log("updating player from: x: " + this.pos.x + "y: " + this.pos.y)
        var vel = new Vector(this.vel_mid.x, this.vel_mid.y)
        // console.log("vel to update: x:" + vel.x + " y: " + vel.y);
        vel.div(10);
        vel.limit(4 + this.speed * 0.2);
        // vel.mult(this.speed);
        // console.log("\t\t\tvelocity new  to update: x:" + this.velocity.x + " y: " + this.velocity.y);

        this.velocity.lerp(vel, 0.1);
        // console.log("\t\t\tvelocity lerp:: x:" + this.velocity.x + " y: " + this.velocity.y);

        this.pos.add(this.velocity);
        this.constrain(-Constants.MAP_SIZE + this.r, Constants.MAP_SIZE - this.r);
        // console.log("to x: " + this.pos.x + "y: " + this.pos.y)

    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            r: this.r,
            hp: this.hp,
            hp_max: this.hp_max,
            color: this.color,
            nickname: this.username,
            score: this.score,
            score_to_next_lvl: this.progress_to_next_lvl,
            lvl: this.player_lvl,
            update_points: this.points_to_upgrade,
            bullet_r: this.bullet_radius

        }
    }

    regenHealth(){

        this.regInt = setInterval(() => {
            if (this.start_regen) {
                if (this.hp >= 100){
                    this.start_regen = false;
                }
                if (this.hp < this.hp_max) {
                    if (this.hp + this.regen_amount_hp > this.hp_max) {
                        this.hp = this.hp_max;
                    } else {
                        this.hp += this.regen_amount_hp;
                    }
                }
            } else {
                this.start_regen = false;
                clearInterval(this.regInt);
            }
        }, this.health_regen_time);
    }


    eatsFood(food){
        var dist = this.pos.dist(food.pos);
        if (dist < this.r + food.r){
            var square_area = this.r * this.r * Math.PI + food.r * food.r * Math.PI;
            this.r = Math.sqrt(square_area / Math.PI);

            this.addScore(Constants.SCORE_FOR_FOOD);
            // this.r += food.r;
            return true;
        }
        else {
            return false;
        }
    }


    eatsPlayer(otherPlayer) {
        // const dist = this.pos.dist(player.pos) < this.r;
        const square_this = Math.PI * this.r * this.r;
        const square_other = Math.PI * otherPlayer.r * otherPlayer.r;

        if (square_this * 0.8 > square_other && this.pos.dist(otherPlayer.pos) < this.r){
            const new_square = square_this + square_other;
            this.r = Math.sqrt(new_square / Math.PI);
            otherPlayer.dead = true;

            // add score

            this.addScore(otherPlayer.score * 0.8);
            return true;
        }
        return false
    }


    makeShoot(){
        if (this.r < 10) {
            return;
        }
        if (this.r - this.bullet_radius > 2) {
            let this_area = Math.PI * this.r * this.r;
            let bullet_area = Math.PI * this.bullet_radius * this.bullet_radius;
            // console.log('square p : ',this_area);
            // console.log('square bull: ',bullet_area);
            this_area -= bullet_area;
            // console.log('new sq: ',this_area);

            this.r = Math.sqrt(this_area / Math.PI)
        }
    }

    takeBulletDamage(damage= Constants.BULLET_DAMAGE){
        this.hp -= damage;
        if (this.hp < 0){
            this.hp = 0;
            this.dead = true;
        }
        this.start_regen = false;

        clearInterval(this.regInt);
        clearInterval(this.regTime);
        this.start_regen = false;
        this.regTime = setTimeout(() => {
            this.start_regen = true;
            this.regenHealth.apply(this);

        }, this.timeout_regen_time);
    }

    causedDamage(scoreHit=Constants.SCORE_BULLET_HIT){
        this.score += scoreHit;
    }


    try_to_update(cost){
        if (this.points_to_upgrade - cost >= 0){
            this.points_to_upgrade -= cost;
            return true;
        }
        return false;
    }


    upgrade_level(){
        this.player_lvl ++;
        this.progress_to_next_lvl = 0;
        this.points_to_upgrade ++;
    }


    addScore(score){
        this.score = Math.floor(this.score + score);


        let score_to_next_lvl = Math.pow(this.player_lvl, 2) - this.progress_to_next_lvl;
        if (score > score_to_next_lvl) {
            score -= score_to_next_lvl;
            this.upgrade_level();
        }


        while(score > Math.pow(this.player_lvl, 2)){
            score -= Math.pow(this.player_lvl, 2);
            this.upgrade_level();
        }

        this.progress_to_next_lvl += score;
    }


    addDamage(){
        this.damage_lvl ++;
        this.damage = this.damage_lvl * Constants.BULLET_DAMAGE;
        this.bullet_radius = Constants.BULLET_RADIUS + this.damage_lvl;
    }

    decDamage(){
        if (this.damage_lvl === 1) {
            return;
        }

        this.damage_lvl --;
        this.damage = this.damage_lvl * Constants.BULLET_DAMAGE;
        this.bullet_radius = Constants.BULLET_RADIUS + this.damage_lvl;


    }

    addHealth(){
        this.hp_lvl ++;
        if (this.hp === this.hp_max){
            this.hp = this.hp_lvl * Constants.PLAYER_MAX_HP;
        }
        this.hp_max = this.hp_lvl * Constants.PLAYER_MAX_HP;

    }

    addReload(){
        if (this.reload_lvl >= 9){
            return
        }
        this.reload_lvl ++;
        this.shooting_reload_time = this.shooting_reload_time * (this.reload_lvl / 10);

    }

    addRange(){
        this.range_lvl ++;
        this.shoot_range = this.shoot_range * 1.1;
        this.bullet_speed = Constants.BULLET_SPEED + this.range_lvl;
    }

    addRegen(){
        if (this.timeout_regen_time < 1000){
            return;
        }
        this.regen_lvl ++;
        this.timeout_regen_time = Constants.PLAYER_MAX_REGEN_TIME - this.regen_lvl * 250;
    }

    addSpeed(){
        this.speed_lvl ++;
        this.speed = Constants.PLAYERS_SPEED + this.speed_lvl * 2;
    }

}

module.exports = Player;