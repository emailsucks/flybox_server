'use strict';

require('angular/angular');
require('angular-route');

var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'templates/index.html'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
