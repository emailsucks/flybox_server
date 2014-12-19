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
        $scope.attachments = [];
        data.filesURLS.forEach(function(url) {
          var file = url;
          if((/\.pdf$/).test(url)) {
            url = 'http://iconbug.com/data/5b/507/52ff0e80b07d28b590bbc4b30befde52.png';
          } else if ((/\.doc$/).test(url)) {
            url = 'http://seoul2013.citynetcongress.org/wp-content/uploads/2013/08/Word-Doc-Icon.png';
          }
          $scope.attachments.push({
            source: file,
            image: url,
          });
        });
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
