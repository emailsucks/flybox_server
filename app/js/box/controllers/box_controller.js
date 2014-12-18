'use strict';

module.exports = function(app) {
  app.controller('BoxCtrl', ['$scope', '$http', '$base64', '$cookies', '$location', '$routeParams', function($scope, $http, $base64, $cookies, $location, $routeParams) {
    console.log('running in box ctrl');
    // if (!$cookies.jwt) {
    //   console.log('redirecting');
    //   $location.path('/');
    // }

    var boxId = $routeParams.boxId;
    var userId = $routeParams.userId;

    //sample data
    $scope.posts = [{author:'james', text: 'Kale chips sriracha Etsy, letterpress stumptown vegan cardigan church-key. Artisan farm-to-table VHS kogi, ethical banh mi semiotics raw denim Vice 8-bit dreamcatcher. Yr lo-fi iPhone, art party brunch locavore heirloom. Raw denim 90s slow-carb, Vice messenger bag McSweeneys Blue Bottle umami '}, {author: 'frank', text: 'Art party disrupt quinoa, Helvetica sriracha locavore tattooed lumbersexual pop-up food truck Neutra. Sriracha deep v'}, {author: 'dan', text: 'Polaroid normcore fanny pack, pop-up post-ironic Kickstarter bespoke chia. '}];

    $scope.refresh = function() {
      $http.get('/api/n' + boxId + '/' + userId).success(function(data) {
        $scope.posts = data.thread;
        $scope.recipients = data.recipients;
        $scope.subject = data.subject;
      });
    };

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

  }]);
};
