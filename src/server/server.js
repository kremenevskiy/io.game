require("dotenv").config();
const Player = require('./player')
var express = require('express');
const Food = require('./food')
const Bullet = require('./bullet')
const Constants = require('../shared/constants')
const Room = require('./room')
const Vector = require('./vector')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const appRouter =  require('./routes/appRouter')

const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const userCredentials = require('./models/UserCredentials');

const width = 1000;
const height = 1000;

var app = express();
app.use(bodyParser.json())


function listen(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("\nServer listening on http://" + host + ":" + port);
}

const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://krem:qwerty123@maincluster.oape2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
            useNewUrlParser: true
        })
        listen();
    }
    catch (e) {
        console.log("error at starting server: ", e);
    }
}

var server = app.listen(process.env.PORT || 3000, 'localhost', start);

app.use(cookieParser());
app.use('/api', appRouter);
app.use(express.static('dist'));

var io = require('socket.io')(server);


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


io.on('connection', newConnection);
function newConnection(socket){
    console.log("New client: " + socket.id);
    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    socket.on(Constants.MSG_TYPES.UPDATE_INPUT, updatePlayer);
    socket.on(Constants.MSG_TYPES.NEW_BULLET, addBullet);
    socket.on(Constants.MSG_TYPES.CANVAS_GET, setCanvasSize);

    // update players
    socket.on(Constants.MSG_TYPES.DAMAGE_ADD, damage_add);
    socket.on(Constants.MSG_TYPES.DAMAGE_DEC, damage_dec);
    socket.on(Constants.MSG_TYPES.HEALTH_ADD, health_add);
    socket.on(Constants.MSG_TYPES.REGEN_ADD, regen_add);
    socket.on(Constants.MSG_TYPES.SPEED_ADD, speed_add);
    socket.on(Constants.MSG_TYPES.RELOAD_ADD, reload_add);
    socket.on(Constants.MSG_TYPES.RANGE_ADD, range_add);

    socket.on('disconnect', onDisconnect);
}

const room = new Room();
room.setup();


function joinGame(player_data){
    console.log('joined player: ', player_data);
    if (player_data.gameUsername === ""){
        player_data.gameUsername = "NoName";
    }
    let server_name = 'not logged';
    if (player_data.isLogged){
        console.log('ddd: ', player_data.usernameLogged);
        server_name = player_data.usernameLogged;
    }
    console.log('servername: ', server_name)
    console.log('New player joined the game: \nName: ' +  player_data.gameUsername + '\nServer name: ' + server_name + "\nSocket id: " + this.id);
    room.addPlayer(this, player_data);
}

function updatePlayer(update_data){
    const playerId = this.id;
    // room.updatePlayer(playerId, update_data);
    room.updatePlayerDecorator(playerId, update_data);
}


function addBullet(dir){
    room.addBullet(this.id, dir);
}

function setCanvasSize(canvas_size) {
    room.updatePlayerCanvas(this.id, canvas_size);
}

function onDisconnect(){
    console.log("Player: " + this.id + " disconnected!");
    room.removePlayer(this);
}

function damage_add(damageData) {
    room.upgradePlayer(this.id, damageData);
}

function damage_dec(damageData) {
    room.upgradePlayer(this.id, damageData);
}

function health_add(healthData) {
    room.upgradePlayer(this.id, healthData);
}

function speed_add(speedData) {
    room.upgradePlayer(this.id, speedData);
}

function regen_add(regenData) {
    room.upgradePlayer(this.id, regenData);
}

function reload_add(reloadData) {
    room.upgradePlayer(this.id, reloadData);
}

function range_add(rangeData) {
    room.upgradePlayer(this.id, rangeData);
}

async function updatePlayerData(aliveData) {
    const current_score = aliveData.score;
    const username = aliveData.username;
    console.log('sss: ', username);
    try {
        const player = await userCredentials.findOne({username});
        if (player) {
            const player_maxScore = player.maxScore;
            if (current_score > player_maxScore) {
                await userCredentials.updateOne(
                    {username},
                    {$set: {maxScore: current_score}}
                )
            }
        }
        else{
            console.log('player not found');
        }
    }
    catch (e){
        console.log('in update player error: ', e);
    }
}

module.exports.do = updatePlayerData;