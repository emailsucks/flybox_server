'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');
window.io = require('socket.io-client/socket.io');
require('angular-socket-io');

var app = angular.module('flyboxApp', ['ngRoute', 'ngCookies', 'base64', 'btford.socket-io']);

require('./services/SocketService')(app);
require('./users/users')(app);
require('./inbox/inbox')(app);
require('./box/box')(app);

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
  .when('/n/:boxId/:userId/', {
    templateUrl: 'templates/box.html',
    controller: 'BoxCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
