/**
* @license TODO
* (c) 2014-2014 Amplify, Inc
* License: TODO
* Authors: Mike Lynch [mlynch@amplify.com]
*          Dan Fast [dfast@amplify.com]
*/

(function(window, angular) {'use strict';




  // ------- //
  // Helpers //
  // ------- //

  // Much of the front-end link to the api has not been implemented yet
  // this is a factory that creates angular promises for future features

  var makeEmptyPromise = function($q, errorMessage) {
    var emptyPromiseCreator = function() {
      var result = $q.defer();
      result.resolve({ error: errorMessage });

      return result.promise;
    };

    return emptyPromiseCreator;
  };

  // factories that creates promise resolutions to api calls

  var makeSuccess = function(promise) {
    var onSuccess = function(data, status, headers, config) {
      promise.resolve(data);
    };
    return onSuccess;
  };
  var makeErrorMany = function(promise) {
    var onErrorMany = function(data, status, headers, config) {
      promise.resolve([]);
    }
    return onErrorMany;
  };
  var makeErrorOne = function(promise) {
    var onErrorOne = function(data, status, headers, config) {
      promise.resolve(null);
    }
    return onErrorOne;
  };


  // --------- //
  // Constants //
  // --------- //

  var DEFAULT_CONFIG = { withCredentials: true };





  // our default core module uses ampConfigServiceDeveloper
  // including ampConfigServiceProduction in your app.js file will swap out the environment

  angular.module('ampCore', ['ampConfig'])
  




  // -------- //
  // Services //
  // -------- //

  // Section is a bundle of information related to either a teacher's classes or a student's class
  // ampSectionService.readSections() 

  .service('ampSectionService',['ampConfigService','$http', '$q', function(ampConfigService, $http, $q) {

    var SECTIONS_URL = '/action/user/currentSections';
 
    // fetch all sections for the current user-session

    var readSections = function() {

      var result = $q.defer();

      ampConfigService.csApiUrlBuilder(SECTIONS_URL).then(function(url) {
        $http.get(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorMany(result));
      })

      return result.promise;
    };

    var readSection = makeEmptyPromise($q, "ampSectionService.read' has not been implemented.");
    var createSection = makeEmptyPromise($q, "ampSectionService.create' has not been implemented.");
    var updateSection = makeEmptyPromise($q, "ampSectionService.update' has not been implemented.");
    var deleteSection = makeEmptyPromise($q, "ampSectionService.delete' has not been implemented.");

    return {
      fetch : readSections,
      create : createSection,
      read : readSection,
      update : updateSection,
      delete : deleteSection
    };
  }])






  // Roster is a list of students associated with a section
  // ampSectionService.readSections() 
  
  .service('ampRosterService',['ampConfigService','$http', '$q', 'ampSectionService', function(ampConfigService, $http, $q, ampSectionService) {

    var readRosters = makeEmptyPromise($q, "ampRosterService.fetch' has not been implemented.");

    /*
    var readRosters = function() {

      var result = $q.defer();

      ampSectionService.fetch().then(function(data){
        var sectionsAndStudents = [];
        var l = data.length;
        var i = 0;
        var numReturned = 0;
        for(i = 0; i < l; i++) {
          (function(i){
            var sectionWrapper = data[i];
            var rosterUrl = '/data/section/' + sectionWrapper.section.key + '/studentRoster/student';

            $http.get(ampConfigService.csApiUrlBuilder(rosterUrl), { withCredentials: true })
            .success(function (data, status, headers, config) {
              sectionWrapper.students = data;
              sectionsAndStudents.push(sectionWrapper);
              numReturned += 1;
              if(numReturned >= l) {
                result.resolve(sectionsAndStudents);
              }
            })
            .error(function (data, status, headers, config) {
              numReturned += 1;
              if(numReturned >= l) {
                result.resolve(sectionsAndStudents);
              }
            });
          })(i);
        }
      });
      
      return result.promise;
    };
    */

    var readRoster = function(sectionKey) {

      // validate

      if(!sectionKey || !angular.isString(sectionKey)) {
        throw new Error("ampRosterService.read requires a single parameter, sectionKey:String");
      }

      // retrieve
      
      var rosterUrl = '/data/section/' + sectionKey + '/studentRoster/student';

      var result = $q.defer();

      ampConfigService.csApiUrlBuilder(rosterUrl).then(function(url) {
        $http.get(url, { withCredentials: true })
        .success(makeSuccess(result))
        .error(makeErrorMany(result));
      });

      return result.promise;
    };

    var deleteRoster = makeEmptyPromise($q, "ampRosterService.delete' has not been implemented.");
    var createRoster = makeEmptyPromise($q, "ampRosterService.create' has not been implemented.");
    var updateRoster = makeEmptyPromise($q, "ampRosterService.update' has not been implemented.");

    return {
      fetch : readRosters,
      create : createRoster,
      read : readRoster,
      update : updateRoster,
      delete : deleteRoster
    };
  }])





  // Storage is an amplify service that allows for the reading and writing of arbitrary text files
  // At some point, storage will also behave as an interface for reading and writing local files

  .service('ampStorageService',['ampConfigService','$http', '$q', '$window', function(ampConfigService, $http, $q, $window) {

    var STORAGE_URL = '/api/storage/';

    // read all files associated with an application

    var fetchFiles = function(applicationName) {

      // validate

      if(!applicationName || !angular.isString(applicationName)) {
        throw new Error("ampStorageService.fetch requires a single parameter, applicationName:String");
      }

      var result = $q.defer();

      var storageUrl = STORAGE_URL + applicationName;

      ampConfigService.csBaseUrlBuilder(storageUrl).then(function(url){
        $http.get(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorMany(result));
      });

      return result.promise;
    };

    // delete all files associated with an application

    var burnFiles = function(applicationName) {

      // validate

      if(!applicationName || !angular.isString(applicationName)) {
        throw new Error("ampStorageService.burn requires a single parameter, applicationName:String");
      }

      var result = $q.defer();

      var storageUrl = STORAGE_URL + applicationName;

      ampConfigService.csBaseUrlBuilder(storageUrl).then(function(url){
        $http.delete(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorOne(result));
      })

      return result.promise;
    };

    // read a single file

    var readFile = function(applicationName, fileName) {

      // validate

      if(!applicationName|| !angular.isString(applicationName)) {
        throw new Error("ampStorageService.read requires a first parameter, applicationName:String");
      }
      if(!fileName || !angular.isString(fileName)) {
        throw new Error("ampStorageService.read requires a second parameter, fileName:String");
      }

      var result = $q.defer();

      var storageUrl = STORAGE_URL + applicationName + "/" + fileName;

      ampConfigService.csBaseUrlBuilder(storageUrl).then(function(url){
        $http.get(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorOne(result));
      });

      return result.promise;
    };

    // create a single file

    var createFile = function(applicationName, fileName, fileData) {

      if(!applicationName || !angular.isString(applicationName)) {
        throw new Error("ampStorageService.create requires a first parameter, applicationName:String");
      }
      if(!fileName || !angular.isString(fileName)) {
        throw new Error("ampStorageService.create requires a second parameter, fileName:String");
      }
      if(!fileData || !angular.isString(fileData)) {
        throw new Error("ampStorageService.create requires a third parameter, fileData:String");
      }

      var result = $q.defer();

      var storageUrl = STORAGE_URL + applicationName + "/" + fileName;

      ampConfigService.csBaseUrlBuilder(storageUrl).then(function(url){
        $http({
          url: url,
          method: "POST",
          data: fileData,
          headers: { "Content-Type": "application/base64" },
          params: { createOrUpdate: true },
          withCredentials: true
        }) 
        .success(makeSuccess(result))
        .error(makeErrorOne(result));
      });

      return result.promise;
    };

    // delete a single file

    var deleteFile = function(applicationName, fileName) {

      if(!applicationName || !angular.isString(applicationName)) {
        throw new Error("ampStorageService.delete requires a first parameter, applicationName:String");
      }
      if(!fileName || !angular.isString(fileName)) {
        throw new Error("ampStorageService.delete requires a second parameter, fileName:String");
      }

      var result = $q.defer();

      var storageUrl = STORAGE_URL + applicationName + "/" + fileName;

      ampConfigService.csBaseUrlBuilder(storageUrl).then(function(url){
        $http.delete(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorOne(result));
      });

      return result.promise;
    };

    return {
      fetch : fetchFiles,
      burn : burnFiles,
      create : createFile,
      read : readFile,
      update : createFile,
      delete : deleteFile
    };
  }])





  .service('ampUnitService',['ampConfigService', '$http', '$q', function(ampConfigService, $http, $q) {

    var readEnactedUnits = function(sectionKey) {

      // validate

      if(!sectionKey || !angular.isString(sectionKey)) {
        throw new Error("ampUnitService.read requires a single parameter, sectionKey:String");
      }

      var result = $q.defer();

      ampConfigService.csApiUrlBuilder('/data/section/' + sectionKey + '/enactedUnit').then(function(url){
        $http.get(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorMany(result));
      });

      return result.promise;
    };

    var readUnit = makeEmptyPromise($q, "ampUnitService.read' has not been implemented.");
    var createUnit = makeEmptyPromise($q, "ampUnitService.create' has not been implemented.");
    var updateUnit = makeEmptyPromise($q, "ampUnitService.update' has not been implemented.");
    var deleteUnit = makeEmptyPromise($q, "ampUnitService.delete' has not been implemented.");

    return {
      fetch : readEnactedUnits,
      create : createUnit,
      read : readUnit,
      update : updateUnit,
      delete : deleteUnit
    };

  }])
  



  .service('ampActivityService',['ampConfigService', '$http', '$q', function(ampConfigService, $http, $q) {
    
    var ACTIVITY_URL = "/data/component/element/activity/";
    //http://cs.qa1.poc.ae1.currdc.net:8080/wg-curriculum/api/{version}/data/component/element/activity/{componentKey}

    var readActivity = function(key) {

      if(!key || !angular.isString(key)) {
        throw new Error("ampActivityService.read requires a first parameter, key:String");
      }

      var result = $q.defer();

      var urlBranch = ACTIVITY_URL + key;

      ampConfigService.csApiUrlBuilder(urlBranch).then(function(url){
        $http.get(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorMany(result));
      });

      return result.promise;
    };

    var createActivity = makeEmptyPromise($q, "ampActivityService.create' has not been implemented.");
    var fetchActivities = makeEmptyPromise($q, "ampActivityService.fetch' has not been implemented.");
    var updateActivity = makeEmptyPromise($q, "ampActivityService.update' has not been implemented.");
    var deleteActivity = makeEmptyPromise($q, "ampActivityService.delete' has not been implemented.");

    return {
      fetch : fetchActivities,
      create : createActivity,
      read : readActivity,
      update : updateActivity,
      delete : deleteActivity
    };

  }])





  .service('ampComponentService',['ampConfigService','$http', '$q', function(ampConfigService, $http, $q) {

    var COMPONENT_TYPE_CHILD_OF_UNIT = "child_of_unit";
    var COMPONENT_TYPE_CHILD_OF_COMPONENT = "child_of_component";
    var COMPONENT_TYPE_USER_COMPONENT = "user_component";
    var COMPONENT_TYPE_LESSON = "lesson_component";
    var VALID_INPUTS = [COMPONENT_TYPE_USER_COMPONENT, COMPONENT_TYPE_CHILD_OF_COMPONENT, COMPONENT_TYPE_CHILD_OF_UNIT, COMPONENT_TYPE_LESSON];

    var SUBMIT_URL_INCOMPLETE = "/action/interact/submit/userComponent";
    var SUBMIT_URL_COMPLETE = "/action/interact/submit/userComponent/complete";

    var fetchComponents = function(key, componentType) {

      componentType = componentType || COMPONENT_TYPE_CHILD_OF_COMPONENT;

      // validate

      if(VALID_INPUTS.indexOf(componentType) < 0) {
        throw new Error("ampComponentService.fetch requires a valid componentType - " + componentType + " does not match " + angular.toJson(VALID_INPUTS));
      }

      if(!key || !angular.isString(key)) {
        throw new Error("ampComponentService.fetch requires a first parameter, key:String");
      }

      var result = $q.defer();

      var apiVersion = '1.0';

      var urlBranch = (componentType === COMPONENT_TYPE_CHILD_OF_COMPONENT && ('/api/' + apiVersion +'/data/enactedComponent/' + key + '/enactedElement')) ||
                      (componentType === COMPONENT_TYPE_CHILD_OF_UNIT && ('/api/' + apiVersion +'/data/enactedUnit/' + key + '/enactedComponent')) ||
                      (componentType === COMPONENT_TYPE_USER_COMPONENT && ('/api/' + apiVersion +'/data/enactedComponent/' + key + '/userComponent')) ||
                      (componentType === COMPONENT_TYPE_LESSON && ('/api/' + apiVersion +'/lesson/' + key)) ||
                      ('/data/enactedComponent/' + key + '/enactedElement');

      ampConfigService.csBaseUrlBuilder(urlBranch).then(function(url){
        $http.get(url, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorMany(result));
      })

      return result.promise;
    };

    // submit Activity to Card

    var submitComponent = function(userComponentKey, activityKeyAndResponseList, isComplete) {

      //  validation

      if(!userComponentKey || !angular.isString(userComponentKey)) {
        throw new Error("ampComponentService.submit requires a first parameter, userComponentKey:String");
      }

      if(!activityKeyAndResponseList || !angular.isArray(activityKeyAndResponseList)) {
        throw new Error("ampComponentService.submit requires a second parameter, activityKeyAndResponseList:Array");
      }

      if(isComplete === null || isComplete === undefined) {
        throw new Error("ampComponentService.submit requires a third parameter, isComplete:Boolean");
      }

      var i = 0;
      var l = activityKeyAndResponseList.length;
      for(i = 0; i < l; i++) {
        var activityKeyAndResponse = activityKeyAndResponseList[i];
        if(!activityKeyAndResponse.key || !angular.isString(activityKeyAndResponse.key)) {
          throw new Error("ampComponentService.submit activityKeyAndResponseList[" + i + "] must have a key:String property");
        }
        if(!activityKeyAndResponse.response || !angular.isString(activityKeyAndResponse.response)) {
          throw new Error("ampComponentService.submit activityKeyAndResponseList[" + i + "] must have a response:String property");
        }
      }

      // construct payload

      var payload = {
        userComponentKey : userComponentKey,
        submission : {
          responses : activityKeyAndResponseList
        }
      };

      // submit payload

      var result = $q.defer();

      var urlBranch = isComplete && SUBMIT_URL_COMPLETE || SUBMIT_URL_INCOMPLETE;

      ampConfigService.csApiUrlBuilder(urlBranch).then(function(url){
        $http.post(url, payload, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorOne(result));
      });

      return result.promise;

    };

    var createComponent = makeEmptyPromise($q, "ampComponentService.create' has not been implemented.");
    var readComponent = makeEmptyPromise($q, "ampComponentService.read' has not been implemented.");
    var updateComponent = makeEmptyPromise($q, "ampComponentService.update' has not been implemented.");
    var deleteComponent = makeEmptyPromise($q, "ampComponentService.delete' has not been implemented.");

    return {
      fetch : fetchComponents,
      create : createComponent,
      read : readComponent,
      update : updateComponent,
      delete : deleteComponent,
      submit : submitComponent,
      CHILD_OF_COMPONENT : COMPONENT_TYPE_CHILD_OF_COMPONENT,
      CHILD_OF_UNIT : COMPONENT_TYPE_CHILD_OF_UNIT,
      LESSON : COMPONENT_TYPE_LESSON,
      USER : COMPONENT_TYPE_USER_COMPONENT
    };
  }])



  .service('ampCurriculumService',['ampConfigService','$http', '$q', 'ampComponentService', function(ampConfigService, $http, $q, ampComponentService) {

    var createCardSubmission = function(cardKey, userKey, jsonData, isComplete) {

      if(!cardKey || !angular.isString(cardKey)) {
        throw new Error("ampCurriculumService.createCardSubmission requires a first parameter, cardKey:String");
      }

      if(!userKey || !angular.isString(userKey)) {
        throw new Error("ampCurriculumService.createCardSubmission requires a second parameter, userKey:String");
      }

      if(!jsonData) {
        throw new Error("ampCurriculumService.createCardSubmission requires a third parameter, jsonData:String");
      }

      if(isComplete === null || isComplete === undefined) {
        throw new Error("ampCurriculumService.createCardSubmission requires a fourth parameter, isComplete:Boolean");
      }

      var result = $q.defer();

      ampComponentService.fetch(cardKey, ampComponentService.USER).then(function(data){

        var i = 0;
        var l = data.length; 
        var foundUserToSubmit = false;
        for(i = 0; i < l; i++) {
          var userComponentBundle = data[i];

          if(userComponentBundle.User.userkey === userKey) {

            foundUserToSubmit = true;

            if(userComponentBundle.useractivities.length <= 0) {
              throw new Error("ampCurriculumService.createCardSubmission can only operate on a card with an activity (card: " + cardKey + " has zero activities, and so has no submission data.");
            }
            if(userComponentBundle.useractivities.length > 1) {
              throw new Error("ampCurriculumService.createCardSubmission can only operate on a card with a single activity (card: " + cardKey + " has " + userComponentBundle.useractivities.length + " activities. Please select a different card or author it to have fewer activities.");
            }

            var firstName = userComponentBundle.User.firstname;
            var lastName = userComponentBundle.User.lastname;
            var entity = userComponentBundle.entity;
            var unitOfWorkKey = userComponentBundle.unitofworkkey;
            var unitOfWorkLastSubmittedTs = userComponentBundle.unitofworkLastsubmittedts
            var enactedComponentKey = userComponentBundle.enactedcomponentkey;
            var enactedActivityKey = userComponentBundle.useractivities[0].enactedactivitykey;
            var userActivityKey = userComponentBundle.useractivities[0].useractivitykey;
            var userComponentKey = userComponentBundle.usercomponentkey;
          
            var fakeActivityKeyAndResponseList = [{
              key : userActivityKey,
              response : jsonData
            }];

            ampComponentService.submit(userComponentKey, fakeActivityKeyAndResponseList, isComplete).then(function(data){
              result.resolve(data);
            });
          }
        }

        if(!foundUserToSubmit) {
          result.resolve(null);
          throw new Error("ampCurriculumService.createCardSubmission can only submit for a given userKey. " + userKey + " could not be found and is not associated (or does not have rights) to this activity and/or session.");
        }
      });

      return result.promise;

    };

    var readCardSubmission = function(cardKey) {

      if(!cardKey || !angular.isString(cardKey)) {
        throw new Error("ampCurriculumService.createCardSubmission requires a first parameter, cardKey:String");
      }

      var result = $q.defer();

      ampComponentService.fetch(cardKey, ampComponentService.USER).then(function(data){

        var usersAndSubmissions = {};

        var i = 0;
        var l = data.length; 
        for(i = 0; i < l; i++) {
          var userComponentBundle = data[i];

          if(userComponentBundle.useractivities.length <= 0) {
            throw new Error("ampCurriculumService.readCardSubmission can only operate on a card with an activity (card: " + cardKey + " has zero activities, and so has no submission data.");
          }
          if(userComponentBundle.useractivities.length > 1) {
            throw new Error("ampCurriculumService.readCardSubmission can only operate on a card with a single activity (card: " + cardKey + " has " + userComponentBundle.useractivities.length + " activities. Please select a different card or author it to have fewer activities.");
          }

          var userKey = userComponentBundle.User.userkey;
          var firstName = userComponentBundle.User.firstname;
          var lastName = userComponentBundle.User.lastname;
          var entity = userComponentBundle.entity;
          var unitOfWorkKey = userComponentBundle.unitofworkkey;
          var unitOfWorkLastSubmittedTs = userComponentBundle.unitofworklastsubmittedts
          var enactedComponentKey = userComponentBundle.enactedcomponentkey;
          var enactedActivityKey = userComponentBundle.useractivities[0].enactedactivitykey;
          var userActivityKey = userComponentBundle.useractivities[0].useractivitykey;
          var userComponentKey = userComponentBundle.usercomponentkey;
          var submissions = [];
          
          // restructure submission respoonses data
          // so that they are flat and not repetitive

          var j = 0;
          var k = userComponentBundle.submissions.length;
          for(j = 0; j < k; j++) {
            var badSubmission = userComponentBundle.submissions[j];
            var submission = {
              enactedActivityKey : badSubmission.responses[0].enactedactivitykey,
              userActivityKey : badSubmission.responses[0].useractivitykey,
              response : badSubmission.responses[0].response,
              key : badSubmission.submissionkey,
              time : badSubmission.submissiontime
            };
            submissions.push(submission);
          }

          // restructure submission bundle data
          // so that it is flatter and has camel case

          var userSubmissionData = {
            user : {
              firstName: firstName,
              lastName : lastName,
              key : userKey
            },
            submissions : submissions,
            entity : entity,
            enactedComponentKey : enactedComponentKey,
            enactedActivityKey : enactedActivityKey,
            userActivityKey : userActivityKey,
            userComponentKey : userComponentKey,
            unitOfWorkKey : unitOfWorkKey,
            unitOfWorkLastSubmittedTs : unitOfWorkLastSubmittedTs
          };

          // associate those submissions by userkey rather than array

          usersAndSubmissions[userKey] = userSubmissionData;
        }
        
        result.resolve(usersAndSubmissions);

      });

      return result.promise;

    };

    var assignCardstack = function(cardStackKey) {

      if(!cardStackKey || !angular.isString(cardStackKey)) {
        throw new Error("ampCurriculumService.assignCardstack requires a first parameter, cardStackKey:String");
      }

      var result = $q.defer();

      var data = "";

      ampConfigService.csApiUrlBuilder('/action/interact/enactedComponent/' + cardStackKey + '/assign').then(function(url){
        $http.put( data, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorOne(result));
      });

      return result.promise;

    };

    var readGradesForCardstack = function(cardStackKey) {

      if(!cardStackKey || !angular.isString(cardStackKey)) {
        throw new Error("ampCurriculumService.readGradesForCardstack requires a first parameter, cardStackKey:String");
      }

      var result = $q.defer();

      ampConfigService.csApiUrlBuilder('/view/gradebook/enactedcomponent/' + cardStackKey + '/unitofwork').then(function(url){
        $http.get(url, DEFAULT_CONFIG)
        .success(function(data){
          var grades = {};
          var i = 0;
          var l = data.unitofworks.length;
          for(i = 0; i < l; i++) {
            var unitOfWork = data.unitofworks[i];
            grades[unitOfWork.userkey] = unitOfWork;
          }
          result.resolve(grades);
        })
        .error(makeErrorMany(result));
      });
      

      return result.promise;
    };

    var assignGradeForUnitOfWork = function(unitOfWorkKey, grade) {

      if(!unitOfWorkKey || !angular.isString(unitOfWorkKey)) {
        throw new Error("ampCurriculumService.assignGradeForUnitOfWork requires a first parameter, unitOfWorkKey:String");
      }

      if(!grade || !angular.isString(grade)) {
        throw new Error("ampCurriculumService.assignGradeForUnitOfWork requires a second parameter, grade:String");
      }

      var result = $q.defer();

      var payload = {
        gradeText: grade
      };

      ampConfigService.csApiUrlBuilder('/grade/unitOfWork/' + unitOfWorkKey).then(function(url){   
        $http.post(url, payload, DEFAULT_CONFIG)
        .success(makeSuccess(result))
        .error(makeErrorMany(result));
      });

      return result.promise;
    };

    var assignGradeForCardstack = function(cardStackKey, userKey, grade) {

      if(!cardStackKey || !angular.isString(cardStackKey)) {
        throw new Error("ampCurriculumService.assignGradeForCardstack requires a first parameter, cardStackKey:String");
      }

      if(!userKey || !angular.isString(userKey)) {
        throw new Error("ampCurriculumService.assignGradeForCardstack requires a second parameter, userKey:String");
      }

      if(!grade || !angular.isString(grade)) {
        throw new Error("ampCurriculumService.assignGradeForCardstack requires a third parameter, grade:String");
      }

      var result = $q.defer();

      readGradesForCardstack(cardStackKey).then(function(data){
        var isSubmitted = false;
        var unitOfWork = data[userKey];
        if(unitOfWork) {
          assignGradeForUnitOfWork(unitOfWork.key, grade).then(function(data) {
            result.resolve(data);
          });
        } else {
          result.resolve(null);
        }
      });

      return result.promise;
    };


    return {
      createCardSubmission : createCardSubmission,
      readCardSubmission : readCardSubmission,
      assignCardstack : assignCardstack,
      assignGradeForCardstack : assignGradeForCardstack,
      assignGradeForUnitOfWork : assignGradeForUnitOfWork,
      readGradesForCardstack : readGradesForCardstack
    };
  }])





  


  

  .filter('cardStackKeyToGrades', ['ampCurriculumService', function(ampCurriculumService){

    var cache = {};
    var currentCacheCheck = null;

    return function(key, cacheCheck) {
      
      // cache by some hash check
      // I would recommened using a user business key
      // as roster is likely to change because of sign-in

      cacheCheck = cacheCheck || "";

      if(currentCacheCheck !== cacheCheck) {
        currentCacheCheck = cacheCheck;
        cache = {};
      }

      // then we're going to cache it indefinitely

      var cachedVersion = cache[key];
      if(!cachedVersion) {
        cachedVersion = {};
        cache[key] = cachedVersion;

        ampCurriculumService.readGradesForCardstack(key).then(function(data){
          cache[key] = data;
        });
      }
      
      return cachedVersion;
    };
  }])

  .filter('cardKeyToSubmissions', ['ampCurriculumService', function(ampCurriculumService) { 
  
    var cache = {};
    var currentCacheCheck = null;

    return function(key, cacheCheck) {
      
      // cache by some hash check
      // I would recommened using a user business key
      // as roster is likely to change because of sign-in

      cacheCheck = cacheCheck || "";

      if(currentCacheCheck !== cacheCheck) {
        currentCacheCheck = cacheCheck;
        cache = {};
      }

      // then we're going to cache it indefinitely

      var cachedVersion = cache[key];
      if(!cachedVersion) {
        cachedVersion = {};
        cache[key] = cachedVersion;

        ampCurriculumService.readCardSubmission(key).then(function(data){
          cache[key] = data;
        });
      }
      
      return cachedVersion;
    };
  }])
    
  // filters allow you to transform data within a view template
  // this filter retrieves and caches roster data based on a section key
  //
  // the following code will generate a json blob of text inside the DOM
  // <pre>{{ key | activityKeyToActivity | json }}</pre>

  .filter('activityKeyToActivity', ['ampActivityService', function(ampActivityService) {

    var cache = {};
    var currentCacheCheck = null;

    return function(key, componentType, cacheCheck) {
      
      // cache by some hash check
      // I would recommened using a user business key
      // as roster is likely to change because of sign-in

      cacheCheck = cacheCheck || "";

      if(currentCacheCheck !== cacheCheck) {
        currentCacheCheck = cacheCheck;
        cache = {};
      }

      // then we're going to cache it indefinitely

      var cachedVersion = cache[key];
      if(!cachedVersion) {
        cachedVersion = {};
        cache[key] = cachedVersion;

        ampActivityService.read(key, componentType).then(function(data){
          cache[key] = data;
        });
      }
      
      return cachedVersion;
    };
  }])

  // filters allow you to transform data within a view template
  // this filter retrieves and caches roster data based on a section key
  //
  // the following code will generate a json blob of text inside the DOM
  // <pre>{{ key | componentKeyToComponents | json }}</pre>

  .filter('componentKeyToComponents', ['ampComponentService', function(ampComponentService) {

    var cache = {};
    var currentCacheCheck = null;

    return function(key, componentType, cacheCheck) {
      
      // cache by some hash check
      // I would recommened using a user business key
      // as roster is likely to change because of sign-in

      cacheCheck = cacheCheck || "";

      if(currentCacheCheck !== cacheCheck) {
        currentCacheCheck = cacheCheck;
        cache = {};
      }

      // then we're going to cache it indefinitely

      var cachedVersion = cache[key];
      if(!cachedVersion) {
        cachedVersion = {};
        cache[key] = cachedVersion;

        ampComponentService.fetch(key, componentType).then(function(data){
          cache[key] = data;
        });
      }
      
      return cachedVersion;
    };
  }])

  // filters allow you to transform data within a view template
  // this filter retrieves and caches roster data based on a section key
  //
  // the following code will generate a json blob of text inside the DOM
  // <pre>{{ key | sectionKeyToRoster | json }}</pre>

  .filter('sectionKeyToRoster', ['ampRosterService', function(ampRosterService) {

    var rosterCache = {};
    var currentCacheCheck = null;

    return function(rosterKey, cacheCheck) {

      // cache by some hash check
      // I would recommened using a user business key
      // as roster is likely to change because of sign-in

      cacheCheck = cacheCheck || "";

      if(currentCacheCheck !== cacheCheck) {
        currentCacheCheck = cacheCheck;
        rosterCache = {};
      }

      // filters shouldn't fail (in general)... 
      // this function is to speed up initial turn around time and then to be thrown out
      // so we're going to type coerce this value into a string

      rosterKey = rosterKey + "";

      // then we're going to cache it indefinitely

      var cachedVersion = rosterCache[rosterKey];
      if(!cachedVersion) {
        cachedVersion = {};
        rosterCache[rosterKey] = cachedVersion;

        ampRosterService.read(rosterKey).then(function(data){
          rosterCache[rosterKey] = data;
        });
      }
      
      return cachedVersion;
    };
  }])

  // filters allow you to transform data within a view template
  // this filter retrieves and caches roster data based on a section key
  //
  // the following code will generate a json blob of text inside the DOM
  // <pre>{{ key | sectionKeyToUnit | json }}</pre>

  .filter('sectionKeyToUnits', ['ampUnitService', function(ampUnitService) {

    var cache = {};
    var currentCacheCheck = null;

    return function(key, cacheCheck) {

      // cache by some hash check
      // I would recommened using a user business key
      // as roster is likely to change because of sign-in

      cacheCheck = cacheCheck || "";

      if(currentCacheCheck !== cacheCheck) {
        currentCacheCheck = cacheCheck;
        cache = {};
      }

      // filters shouldn't fail (in general)... 
      // this function is to speed up initial turn around time and then to be thrown out
      // so we're going to type coerce this value into a string

      key = key + "";

      // then we're going to cache it indefinitely

      var cachedVersion = cache[key];
      if(!cachedVersion) {
        cachedVersion = {};
        cache[key] = cachedVersion;

        ampUnitService.fetch(key).then(function(data){
          cache[key] = data;
        });
      }
      
      return cachedVersion;
    };
  }]);


  
})(window, window.angular);