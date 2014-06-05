'use strict'

angular
  .module('pemappApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'html5.sortable',
    'LocalStorageModule',
    'ampCore',
    'ampConfig',
    'ampAccess'
  ])
  .config ($routeProvider) ->
    $routeProvider
      .when '/sections',
        templateUrl: 'views/section.html'
        controller: 'SectionCtrl'
      .when '/section/:sectionName/session/:sessionId/edit',
        templateUrl: 'views/session.html'
        controller: 'SessionCtrl'
      .when '/section/:sectionName/session/:sessionId/wall/',
        templateUrl: 'views/wall.html'
        controller: 'WallCtrl'
      .when '/section/:sectionName/session/:sessionId/carousel',
        templateUrl: 'views/carousel.html'
        controller: 'CarouselCtrl'
      .when '/studentsredirect',
        templateUrl: 'views/studentredirect.html'
        controller: 'StudentRedirectCtrl'
      .otherwise
        redirectTo: '/sections'

