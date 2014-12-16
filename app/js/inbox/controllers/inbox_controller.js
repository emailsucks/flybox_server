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

    $scope.saveSettings = function() {
      $scope.errors = null;
      if (!$scope.smtp.host) $scope.errors = 'please enter a host\n';
      if (!$scope.smtp.port) $scope.errors = 'please enter a port\n';
      if (!$scope.smtp.username) $scope.errors = 'please enter a username\n';
      if (!$scope.smtp.password) $scope.errors = 'please enter a password\n';
      if ($scope.errors !== null) return;

      $http({
        method: 'POST',
        url: '/api/userSMTP',
        data: $scope.smtp,
        headers: {'jwt': $cookies.jwt}
      })
      .success(function(data) {
        $location.path('/inbox');
      })
      .error(function(data) {
        console.log('err', data);
        $scope.errors = data;
      });
    };
  }]);
};