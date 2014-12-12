'use strict';

module.exports = function(app) {
  app.controller('UsersCtrl', ['$scope', function($scope) {
    $scope.errors = [];
    console.log('usrs controller');
    $scope.signingUp = false;
    $scope.signUp = function() {
      console.log('signing up');
      $scope.signingUp = true;
    }
  }]);
};