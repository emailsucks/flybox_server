'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');
require('socket.io-client/socket.io');
require('angular-socket-io');

var app = angular.module('flyboxApp', ['ngRoute', 'ngCookies', 'base64', 'socket.io-client', 'angular-socket-io']);

require('./users/users')(app);
require('./inbox/inbox')(app);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'templates/login.html'
  })
  .when('/inbox/', {
    templateUrl: 'templates/inbox.html'
  })
  .when('/settings/', {
    templateUrl: 'templates/settings.html'
  })
  .when('/chat/', {
    templateUrl: 'templates/chat.html'
  })
  .otherwise({
    redirectTo: '/chat/'
  });
}]);
