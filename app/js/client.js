'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

var app = angular.module('flyboxApp', ['ngRoute', 'ngCookies', 'base64']);

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
  .when('/n/:boxId/:keyId/', {
    templateUrl: 'templates/box.html',
    controller: 'BoxCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
