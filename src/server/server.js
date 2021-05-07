const Player = require('./player')
var express = require('express');
const Food = require('./food')
const Bullet = require('./bullet')
const Constants = require('../shared/constants')
const Room = require('./room')
const Vector = require('./vector')
const path = require('path')


const width = 1000;
const height = 1000;

var app = express();
var server = app.listen(process.env.PORT || 3000, 'localhost', listen);

function listen(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening on http://" + host + ":" + port);
}


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
    socket.on('disconnect', onDisconnect);

}




const room = new Room();
room.setup();
function joinGame(username='krem'){
    console.log('joining game: ' + this.id);
    room.addPlayer(this, 'kremenevskiy');
}

var cnt = 0;
function updatePlayer(update_data){
    // console.log('got new move from player!')
    // console.log(update_data)
    // if (cnt < 3) {
    //     console.log('before player update:')
    //     console.log(room.players[this.id]);
    // }
    const playerId = this.id;
    room.updatePlayer(playerId, update_data);
    // if (cnt < 3) {
    //     console.log('after updating')
    //     console.log(room.players[this.id])
    // }
    // cnt++;
}


function addBullet(dir){
    room.addBullet(this.id, dir);
}


function onDisconnect(){
    console.log("Player: " + this.id + " disconnected!");
    room.removePlayer(this);
}
