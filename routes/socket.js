'use strict';

module.exports = function(io) {
  var usernames = {};
  io.sockets.on('connection', function (socket) {
    socket.emit('init', {
      name: 'user'
    });

    socket.on('send:message', function(data) {
      socket.broadcast.emit('send:message', {
        user: name,
        text: data.message
      });
    });

    socket.on('adduser', function(username) {
      socket.username = username;
      socket.room = boxkey;
      usernames[socket.room][username] = username;
      io.sockets.in(socket.room).emit('updatePost', 'flybox', socket.username + ' has connected');
      socket.join(socket.room);
    });

    socket.on('sendPost', function(data) {
      io.sockets.in(socket.room).emit('updatePost', socket.username, data);
    });

    socket.on('disconnect', function() {
      delete usernames[socket.username];
      io.sockets.in(socket.room).emit('updatePost', 'flybox', socket.username + ' has disconnected');
      socket.leave(socket.room);
    });
  });
};
