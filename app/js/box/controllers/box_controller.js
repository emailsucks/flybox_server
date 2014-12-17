'use strict';

module.exports = function(app) {
  app.controller('BoxCtrl', ['$scope', '$http', '$base64', '$cookies', '$location', function($scope, $http, $base64, $cookies, $location) {
    console.log('running in box ctrl');
    if (!$cookies.jwt) {
      console.log('redirecting');
      $location.path('/');
    }

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
