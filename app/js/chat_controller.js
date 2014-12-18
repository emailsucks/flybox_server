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

    socket.on('change:name', function(data) {
      changeName(data.oldName, data.newName);
    });

    socket.on('user:join', function(data) {
      $scope.messages.push({
        user: 'chatroom',
        text: 'User ' + data.name + ' has joined.'
      });
      $scope.users.push(data.name);
    });

    socket.on('user:left', function(data) {
      $scope.messages.push({
        user: 'chatroomt',
        test: 'User ' + data.name + ' had left.'
      });
      var i, user;
      for (i = 0; i < $scope.users.length; i++) {
        user = $scope.users[i];
        if (user === data.name) {
          $scope.users.splice(i, 1);
          break;
        }
      }
    });

    var changeName = function(oldName, newName) {
      var i;
      for (i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i] === oldName) {
          $scope.users[i] = newName;
        }
      }
      $scope.messages.push({
        user: 'chatroom',
        text: 'User ' + oldName + ' is now ' + newName
      });
    };
    $scope.changeName = function() {
      socket.emit('change:name', {
        name: $scope.newName
      }, function(result) {
        if (!result) {
          console.log('there was an error');
        } else {
          changeName($scope.name, $scope.newName);
          $scope.name = $scope.newName;
          $scope.newName = '';
        }
      });
    };

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
