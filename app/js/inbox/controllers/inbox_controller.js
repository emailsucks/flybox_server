'use strict';

module.exports = function(app) {
  app.controller('InboxCtrl', ['$scope', '$http', '$base64', '$cookies', '$location', function($scope, $http, $base64, $cookies, $location) {
    if (!$cookies.jwt) {
      console.log('redirecting');
      $location.path('/');
    }
    $scope.menu = true;
    $scope.composing = true;
    //getBoxes();

    if (!$cookies.smtpSet) {
      console.log('smtp cookie is not set');
      $http({
        method: 'GET',
        url: '/api/userSMTP',
        headers: {jwt: $cookies.jwt}
      })
      .success(function(data) {
        if (data.smtpSet === false) {
          if ($cookies.smtpSet) {
            delete $cookies.smtpSet;
          }
          $scope.smtpSet = false;
          return;
        }
        $cookies.smtpSet = data.smtpSet;
        $scope.smtpSet = data.smtpSet;
      })
      .error(function(data) {
        console.log(data);
      });
    } else {
      $scope.smtpSet = $cookies.smtpSet;
    }

    $scope.logOut = function() {
      delete $cookies.jwt;
      delete $cookies.smtpSet;
      return $location.path('/');
    };
    $scope.settings = function() {
      return $location.path('/settings');
    };
    $scope.goToInbox = function() {
      return $location.path('/inbox');
    };

    var getBoxes = function() {
      $http({
        method: 'GET',
        url: '/api/boxes',
        headers: {jwt: $cookies.jwt}
      })
      .success(function(data) {
        $scope.boxes = data;
        console.log('got them Boxes', data);
      })
      .error(function(data) {
        console.log('err from getBoxes', data);
        $scope.logOut();
      });
    };

    getBoxes();

    $scope.goToBox = function(boxKey, creatorKey) {
      return $location.path('/n/' + boxKey + '/' + creatorKey);
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
        headers: {jwt: $cookies.jwt}
      })
      .success(function() {
        $location.path('/inbox');
      })
      .error(function(data) {
        console.log('err', data);
        $scope.errors = data;
      });
    };
  }]);
};
