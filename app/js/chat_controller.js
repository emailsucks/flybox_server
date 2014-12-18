'use strict';

module.exports = function(app) {
  app.controller('ChatCtrl', ['$scope', 'socket', function($scope, socket) {
    $scope.posts = [];

    socket.on('init', function(data) {
      $scope.name = data.name;
      $scope.users = data.users;
    });

    socket.on('send:message', function(post) {
      $scope.posts.push(post);
    });

    $scope.sendMessage = function() {
      socket.emit('send:message', {
        message: $scope.post
      });
      console.log($scope.posts);
      $scope.posts.push($scope.post);

      $scope.post.message = '';
    };

  }]);
};
