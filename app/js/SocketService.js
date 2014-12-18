'use strict';

module.exports = function(app) {
  app.factory('socket', ['socketFactory', function(socketFactory) {
    var socket = socketFactory({
      ioSocket: window.io.connect('http://localhost:8080')
    });
    socket.forward('error');
    return socket;
  }]);
};
