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
        $scope.textBody = {text:$scope.original.post};
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
        message: $scope.newPost.text,
        boxKey: boxId,
        userId: userId
      });
      var tempPost = $scope.newPost;
      tempPost.author = 'me';
      tempPost.time = Date.now();
      $scope.posts.push(tempPost);
      $scope.newPost = {};
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

    $scope.doneEditing = function() {
      $scope.textBody.editing = false;
      $scope.original.post = $scope.textBody.text;

      //TODO update db with socket
    };

  }]);
};
