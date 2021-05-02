var express = require('express');

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

class Player {
    constructor(id, x, y, r){
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

setInterval(heartbeat, 1000);

function heartbeat() {
    io.sockets.emit('heartbeat', players);
}


io.on('connection', newConnection);
function newConnection(socket){
    console.log("New client: " + socket.id);
    
    socket.on('start', 
        function(data) {
            console.log(socket.id + " x: " + data.x + " y: " + data.y + " r: " + data.r);
            var newPlayer = new Player(socket.id, data.x, data.y, data.r);
            players.push(newPlayer);
        }
    )

    socket.on('update', 
        function(data) {
            console.log("new Pos: " + socket.id + " x: " + data.x + " y: " + data.y + " r: " + data.r);
            
            var player;
            for(var i = 0; i < players.length; ++i){
                if (socket.id == players[i].id) {
                    player = players[i];
                }
            }

            player.x = data.x;
            player.y = data.y;
            player.r = data.r;
        }
    );

    socket.on('disconnect',
        function() {
            console.log('Client has disconnected');
        }
    )
}

