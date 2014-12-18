'use strict';

module.exports = function(app) {
  app.controller('BoxCtrl', ['$scope', '$http', '$base64', '$cookies', '$location', '$routeParams', 'socket', function($scope, $http, $base64, $cookies, $location, $routeParams, socket) {
    console.log('running in box ctrl');

    var boxId = $routeParams.boxId;
    var userId = $routeParams.userId;

    (function() {
      $http.get('/api/n/' + boxId + '/' + userId).success(function(data) {
        console.log(data);
        $scope.original = {
          subject: data.subject,
          post: data.text,
          date: data.date,
          author: data.creator.email
        };
        $scope.posts = data.thread;
        $scope.recipients = data.recipients;
      });
    })();

    socket.on('init', function(data) {
      $scope.name = data.name;
      $scope.users = data.users;
    });
    socket.on('send:post', function(post) {
      $scope.posts.push(post);
    });

    $scope.makeComment = function() {
      socket.emit('send:post', {
        message: $scope.post.text,
        boxKey: boxId,
        userId: userId
      });
      $scope.posts.push($scope.post);
      $scope.post.text = '';
    };

    // $scope.refresh = function() {

    // };

    $scope.logOut = function() {
      delete $cookies.jwt;
      return $location.path('/');
    };

    $scope.settings = function() {
      return $location.path('/settings');
    };

    $scope.goToInbox = function() {
      return $location.path('/inbox');
    };

  }]);
};
