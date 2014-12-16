'use strict';

module.exports = function(app) {
  app.controller('InboxCtrl', ['$scope', '$http', '$base64', '$cookies', '$location', function($scope, $http, $base64, $cookies, $location) {
    console.log('runnning in inbox ctrl');
    if (!$cookies.jwt) {
      console.log('redirecting');
      $location.path('/');
    }
    $scope.menu = true;
    $scope.composing = true;
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
