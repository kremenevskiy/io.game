const Player = require('./player')
var express = require('express');
const Food = require('./food')
const Bullet = require('./bullet')


const width = 1000;
const height = 1000;

var app = express();
var server = app.listen(process.env.PORT || 3000, 'localhost', listen);

function listen(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening on http://" + host + ":" + port);
}

app.use(express.static('public'));


var io = require('socket.io')(server);
var players = [];
var bullets = [];


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// var N_food = 1000;
// var eat = [];
// for(var i = 0; i < N_food; ++i){
//     eat.push(new Food(i, (Math.round(Math.random()) * 2 - 1) * Math.random() * width,(Math.round(Math.random()) * 2 - 1) *  Math.random() * height, 
//     getRandomColor()))
// }

// console.log("lenght eat: " + eat.length)




// class Player {
//     constructor(id, x, y, r){
//         this.id = id;
//         this.x = x;
//         this.y = y;
//         this.r = r;
//     }
// }

setInterval(heartbeat, 30);

function heartbeat() {

    bullets.forEach((bullet) => {
        bullet.update();
    })


    io.sockets.emit('heartbeatbullet', bullets);

    // players.forEach((player) => {
    //     for (var i = 0; i < eat.length; i++){
    //         if (player.eats(eat[i])){
    //             eat.splice(i, 1);
    //         }
    //     }
    // })


    io.sockets.emit('heartbeat', players);
    // if (players.length > 0) {
    //     console.log('sending eat: ')
    //     eat.forEach((food) => {
    //         console.log('foody:' + food)
    //     })
    // }
    // io.sockets.emit('heartbeatfood', eat)
    // console.log("eat: " + eat);
    // for (var i = 0; i < eat.length; i++){
    //     console.log(eat[i]);
    // }
    // for (var i = 0; i < players.length; i++){
    //     console.log(players[i]);
    // }
    // console.log("sending players: "  + players.length + " " + players)
}


io.on('connection', newConnection);
function newConnection(socket){
    console.log("New client: " + socket.id);
    
    socket.on('start', 
        function(data) {
            console.log(socket.id + " x: " + data.x + " y: " + data.y + " r: " + data.r);
            var newPlayer = new Player(socket.id, data.x, data.y, data.r)
            players.push(newPlayer);
        }
    )

    // socket.on('updateeat', 
    //     function(data){
    //         eat = data;
    //     }
    // );

    socket.on('update', 
        function(data) {
            //console.log("new Pos: " + socket.id + " x: " + data.x + " y: " + data.y + " r: " + data.r);
            
            var player;
            for(var i = 0; i < players.length; ++i){
                if (socket.id == players[i].id) {
                    player = players[i];
                }
            }

            player.pos.x = data.x;
            player.pos.y = data.y;
            player.r = data.r;
        }
    );


    socket.on('newbullet', 
        function(bulletdata){
            bullets.push(new Bullet(bullets.length+1, bulletdata.x, bulletdata.y, bulletdata.dir))
            console.log("generated new bullet: " + bullets[bullets.length-1])
        }
    )

    socket.on('disconnect',
        function() {
            console.log('Client has disconnected');
        }
    )
}

