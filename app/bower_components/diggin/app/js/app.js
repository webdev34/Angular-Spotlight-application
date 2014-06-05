/* globals scaleViewport */
'use strict';

scaleViewport(1024);

angular.module('diggin', ['ampAccess', 'ampCore', 'ampConfig'])

    .config(function () {

        $(document).on('touchmove', function (e) {
            e.preventDefault();
            return false;
        });
    })

    // TODO: Move to separate file.
    .directive('ampLoader', function ($parse, $timeout) {

        var link = function(scope, element, attrs) {

            var toLoad = [];
            var loaded = {};
            var isLoading = false;
            var numberLoaded = 0;
            var numberToLoad = 0;

            var imageList = attrs['images'];
            var onEndImage = attrs['onEndImage'];
            var onEndImages = attrs['onEndImages'];
            var onStartImage = attrs['onStartImage'];
            var onStartImages = attrs['onStartImages'];

            var onComplete = function() {
                isLoading = false;
                numberLoaded += 1;

                scope.numberLoaded = numberLoaded;

                var locals = {
                    isError : false
                };

                $parse(onEndImage)(scope, locals);
                $timeout(loadNext, 100);
            };

            var onError = function() {
                isLoading = false;
                numberLoaded += 1;

                scope.numberLoaded = numberLoaded;

                var locals = {
                    isError : true
                };

                $parse(onEndImage)(scope, locals);
                $timeout(loadNext, 100);
            };

            var addImage = function(path){

                if(!loaded[path]) {
                    toLoad.push(path);
                    numberToLoad += 1;

                    scope.numberToLoad = numberToLoad;

                    loadNext();
                }

                return loaded[path];
            };

            var loadNext = function() {

                if(toLoad.length <= 0) {

                    isLoading = false;
                    scope.isLoading = isLoading;

                    var locals = {
                        images : toLoad
                    };

                    $parse(onEndImages)(scope, locals);
                }

                if(toLoad.length > 0 && !isLoading) {

                    isLoading = true;
                    scope.isLoading = isLoading;

                    var path = toLoad.pop();
                    var newImage = new Image();
                    newImage.onload = onComplete;
                    newImage.onerror = onError;
                    newImage.src = path;
                    loaded[path] = newImage;

                    var locals = {
                        src : path,
                        image : newImage
                    };

                    $parse(onStartImage)(scope, locals);
                }
            };

            var start = function() {
                var images = $parse(imageList)(scope) || [];
                for(var i = 0; i < images.length; i++) {
                    addImage(images[i]);
                }

                var locals = {
                    images : images
                };

                $parse(onStartImages)(scope, locals);
            };

            start();
        };


        return {
            restrict: 'E',
            transclude: true,
            template: '<div ng-transclude></div>',
            link : link
        };
    })

    // TODO: Move to separate file.
    .service('json', function(){

        var differenceById = function(defaultArray, userArray) {

            defaultArray = _.filter(defaultArray, 'id');
            userArray = _.filter(userArray, 'id');

            var difference = [];
            var userValue;

            // find all different values for dictionary objects

            var i = 0;
            var l = userArray.length;
            for(i = 0; i < l; i++) {
                userValue = userArray[i];
                var id = userValue.id;
                var defaultValue = _.find(defaultArray, { id : id });
                if(!defaultValue) {
                    difference.push(userValue);
                } else {
                    var diff = { id : id };
                    var hasChange = false;
                    for(var key in userValue) {
                        if(!_.isEqual(userValue[key], defaultValue[key])) {
                            hasChange = true;
                            diff[key] = _.cloneDeep(userValue[key]);
                        }
                    }
                    if(hasChange) {
                        difference.push(diff);
                    }
                }
            }

            return difference;
        };

        var mergeById = function(defaultArray, userArray) {

            var mergeArray = _.cloneDeep(defaultArray);

            var userValue;
            var id;
            var mergeValue;

            // replace individual values with user values

            var i = 0;
            var l = mergeArray.length;
            for(i = 0; i < l; i++) {
                mergeValue = mergeArray[i];
                id = mergeValue.id;
                userValue = _.find(userArray, { id : id });
                if(userValue) {
                    for(var key in userValue) {
                        mergeValue[key] = _.cloneDeep(userValue[key]);
                    }
                }
            }

            // add new user items to array

            i = 0;
            l = userArray.length;
            for(i = 0; i < l; i++) {
                userValue = userArray[i];
                id = userValue.id;
                mergeValue = _.find(mergeArray, { 'id' : id });
                if(!mergeValue) {
                    mergeArray.push(_.cloneDeep(userValue));
                }
            }

            return mergeArray;
        };

        return {
            differenceById : differenceById,
            mergeById : mergeById
        };
    })






    .controller('MainController', function ($scope, $http, ampStorageService, json) {

        $scope.defaultExcerpts = [];
        $scope.excerpts = [];
        $scope.progress = 0;
        $scope.finalStatement = '';
        $scope.applicationName = 'sherlock-caught-red-handed';
        $scope.fileName = 'default';

        $http.get('excerpts.json')
            .then(function (res) {
                $scope.excerpts = res.data;
                $scope.defaultExcerpts = _.cloneDeep($scope.excerpts);
                $scope.updateMaxAccessibleStage();

                ampStorageService.read($scope.applicationName, $scope.fileName).then(function(data) {
                    var answers = [];
                    for(var key in data) {
                        var answers = angular.fromJson(data[key].data);
                        $scope.excerpts = json.mergeById($scope.defaultExcerpts, answers);
                        answers = angular.fromJson(data[key].data);
                    }
                    $scope.excerpts = json.mergeById($scope.defaultExcerpts, answers);

                    $scope.updateMaxAccessibleStage();
                });

            });

        $scope.reset = function(){

            ampStorageService.delete($scope.applicationName, $scope.fileName);

            $scope.excerpts = angular.copy($scope.defaultExcerpts);

            $scope.updateMaxAccessibleStage();
        };

        $scope.save = function() {

            // write to storage whatever changes we just made
            // angular copy strips out properties prepended with $ and $$

            var data = angular.toJson(json.differenceById(angular.copy($scope.defaultExcerpts), angular.copy($scope.excerpts)));

            ampStorageService.create($scope.applicationName, $scope.fileName, data);

        };


        $scope.updateMaxAccessibleStage = function () {

            var excerpts = $scope.excerpts;

            if( !excerpts.length ) {
                return;
            }

            // Group all of the excerpts by their stage,
            // make sure each and every excerpt has a response,
            // if it does, return their stage value + 1 as the next accessible stage.

            $scope.maxAccessibleStage =
                _(excerpts)
                .groupBy('stage')
                .reduce(function (maxAccessibleStage, excerpts, stage) {

                    stage = Number(stage);
                    return  _.every(excerpts, 'response') ?
                            Math.max(maxAccessibleStage, stage + 1) :
                            maxAccessibleStage;
                }, 0);

            $scope.progress = _.filter(excerpts, 'response').length / excerpts.length;

        };
    });
