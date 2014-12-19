'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('BoxCtrl', function() {
  var $controllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module('flyboxApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var boxController = $controllerConstructor('BoxCtrl', {$scope: $scope});
    expect(typeof boxController).toBe('object');
  });

  describe('box functions', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $controllerConstructor('BoxCtrl', {$scope: $scope});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a box from the server', function() {
      $httpBackend.expectGET('/api/n/sampleBoxKey/sampleUserKey').respond(200, {
        'subject': 'testSubject',
        'text': 'testText',
        'date': '1/2/13',
        'creator': {'email': 'testEmail'},
        'thread': [' '],
        'recipients': [' '],
        'fileURLS': [' ']
      });

      $httpBackend.flush();

      expect(typeof $scope.original).toBe('object');
      expect($scope.textBody.text).toBe('testText');
    });

    it('should make a posts array', function() {
      $httpBackend.expectGET('/api/n/sampleBoxKey/sampleUserKey').respond(200, {
        'subject': 'testSubject',
        'text': 'testText',
        'date': '1/2/13',
        'creator': {'email': 'testEmail'},
        'thread': [' '],
        'recipients': [' '],
        'fileURLS': [' ']
      });

      $httpBackend.flush();

      expect(Array.isArray($scope.posts)).toBe(true);
    });

    it('should make an author of the thread', function() {
      $httpBackend.expectGET('/api/n/sampleBoxKey/sampleUserKey').respond(200, {
        'subject': 'testSubject',
        'text': 'testText',
        'date': '1/2/13',
        'creator': {'email': 'testEmail'},
        'thread': [],
        'recipients': [],
        'fileURLS': []
      });

      $httpBackend.flush();

      expect(typeof $scope.original).toBe('object');
    });
  });
});
