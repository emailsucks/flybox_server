'use strict';

require('angular/angular');
require('angular-route');

var app = angular.module('flyboxApp', ['ngRoute']);

require('./users/users')(app);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'templates/login.html'
  })
  .when('/inbox/', {
    templateUrl: 'templates/inbox.html'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
