'use strict';

module.exports = function(socket) {
  socket.emit('init', {
    name: 'user',
    users: ['user1', 'user2']
  });

  socket.on('send:message', function(data) {
    socket.broadcast.emit('send:message', {
      text: data.message
    });
  });
};
