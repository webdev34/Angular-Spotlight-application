'use strict'

angular.module("pemappApp").controller "NavCtrl", ($scope, $rootScope, $location, $routeParams, $timeout, SessionsService, AuthenticationService) ->
  $rootScope.disableFixed = false

  $rootScope.goToWall = ->
    $location.path('/section/'+$routeParams.sectionName+'/session/'+$routeParams.sessionId+'/wall/');
    $rootScope.resetAnnotation();

  $rootScope.saveWall = ->
    $scope.goToWall()
    SessionsService.updateSession();
    SessionsService.saveStudentExcerptCount();
    
  $rootScope.editWall = (sessionId) ->
    $location.path('/section/'+$routeParams.sectionName+'/session/'+$routeParams.sessionId+'/edit');
    $rootScope.resetAnnotation();

  $rootScope.goToSections = () ->
    $location.path('/sections');

  $rootScope.goToCarousel = () ->
    $location.path('/section/'+$routeParams.sectionName+'/session/'+$routeParams.sessionId+'/carousel/');
    $rootScope.resetAnnotation();

  annotateMode = false
  $rootScope.annotable = false
  $rootScope.toggleAnnotation = ->
    annotateMode = !annotateMode
    $rootScope.annotable = !$rootScope.annotable
    $rootScope.$broadcast("annotable:toggle", {"annotateMode": annotateMode});

  $rootScope.undoAnnotation = ->
    $rootScope.$broadcast("annotable:undo");

  $rootScope.resetAnnotation = ->
    annotateMode = false
    $rootScope.annotable = false
    $rootScope.$broadcast("annotable:toggle", {"annotateMode": false});
    $rootScope.$broadcast("annotable:undo");

  $rootScope.userLogOut = ->
    AuthenticationService.logout();
