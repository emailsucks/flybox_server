'use strict';

module.exports = function(app) {
  app.controller('ChatCtrl', ['$scope', 'socket', function($scope, socket) {
    socket.on('init', function(data) {
      $scope.name = data.name;
      $scope.users = data.users;
    });

    socket.on('send:message', function(message) {
      $scope.messages.push(message);
    });

    $scope.sendMessage = function() {
      socket.emit('send:message', {
        message: $scope.messages
      });

      $scope.messages.push({
        user: $scope.name,
        text: $scope.messages
      });

      $scope.message = '';
    };

  }]);
};
