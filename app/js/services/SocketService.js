'use strict';

module.exports = function(app) {
  app.factory('socket', ['socketFactory', function(socketFactory) {
    var socket = socketFactory({
      ioSocket: window.io.connect()
    });
    socket.forward('error');
    return socket;
  }]);
};
