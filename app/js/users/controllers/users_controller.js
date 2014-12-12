'use strict';

module.exports = function(app) {
  app.controller('UsersCtrl', ['$scope', function($scope) {
    $scope.errors = [];
    $scope.signingUp = false;
    $scope.signingIn = false;
    $scope.signUp = function() {
      console.log('signing up');
      $scope.signingUp = true;
      $scope.signingIn = false;
    }
    $scope.logIn = function() {
      console.log('signing in');
      $scope.signingIn = true;
      $scope.signingUp = false;
    }
  }]);
};