var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', function(socket) {
  socket.broadcast.emit('connections', 'A user connected.');
});

io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    socket.broadcast.emit('connections', 'A user disconnected.');
  });
});

io.on('connection', function(socket) {
  socket.on('messages', function(data) {
    io.emit('messages', data);
  });
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});
