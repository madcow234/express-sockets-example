var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var currentlyTypingList = new Array();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', function(socket) {
  socket.broadcast.emit('connections', 'A user connected.');

  socket.on('disconnect', function() {
    socket.broadcast.emit('connections', 'A user disconnected.');
  });

  socket.on('messages', function(data) {
    socket.broadcast.emit('messages', data);
  });

  socket.on('started_typing', function(username) {
    if (!currentlyTypingList.includes(username)) {
      currentlyTypingList.push(username);
      io.emit('typing_status', currentlyTypingList);
    }
  });

  socket.on('stopped_typing', function(username) {
    if (currentlyTypingList.includes(username)) {
      var index = currentlyTypingList.indexOf(username);
      currentlyTypingList.splice(index, 1);
      io.emit('typing_status', currentlyTypingList);
    }
  });
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});
