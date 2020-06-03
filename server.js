console.log('Server is running...');

const express = require("express");

var app = express();
var server = app.listen(80);

app.use(express.static('public'));


var socket = require('socket.io')

var io = socket(server);


var seconds = 9999;
io.sockets.on('connection', function(socket){

	console.log('new connection:' + socket.id);

	socket.on('question', function(question){
		socket.broadcast.emit('question',question);
		console.log(question);
		seconds = 180;
	});

	socket.on('result', function(c){
		socket.broadcast.emit('result',c);
	});
});



function intervalFunc() {
  io.sockets.emit('timer', seconds);
  seconds--;
}

setInterval(intervalFunc, 1000);


