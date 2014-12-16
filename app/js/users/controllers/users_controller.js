'use strict';

module.exports = function(app) {
  app.controller('UsersCtrl', ['$scope', '$http', '$base64', '$cookies', '$location', function($scope, $http, $base64, $cookies, $location) {
    $scope.signingUp = false;
    $scope.signingIn = false;
    if ($cookies.jwt) {
      console.log('redirecting');
      $location.path('/inbox');
    }

    $scope.logIn = function() {
      $scope.errors = null;
      $http.defaults.headers.common.Authorization = 'Basic ' + $base64.encode($scope.user.email + ':' + $scope.user.password);
      $http({
        method: 'GET',
        url: '/api/users'
      })
      .success(function(data) {
        $cookies.jwt = data.jwt;
        $location.path('/inbox');
      })
      .error(function(data) {
        console.log('err', data);
        $scope.errors = data;
      });
    };

    $scope.signUp = function() {
      $scope.errors = null;
      if ($scope.newUser.password !== $scope.newUser.passwordConfirmation) $scope.errors = 'passwords do not match';
      if (!$scope.newUser.email) $scope.errors = 'did not specify an email';
      if (!$scope.newUser.password) $scope.errors = 'invalid password';
      if ($scope.errors !== null) return;

      $http({
        method: 'POST',
        url: '/api/users',
        data: $scope.newUser
      })
      .success(function(data) {
        $cookies.jwt = data.jwt;
        $location.path('/inbox');
      })
      .error(function(data) {
        console.log('err', data);
        $scope.errors = data;
      });
    };
  }]);
};
