// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngStorage','ngCordova','google.places','starter.factories'])

.run(function($ionicPlatform,$rootScope,$state) {
	
$rootScope.LaravelHost = 'http://tapper.co.il/everest/laravel/public/';
$rootScope.serverHost = 'http://tapper.co.il/everest/php/';

$rootScope.currState = $state;
$rootScope.State = '';


$rootScope.$watch('currState.current.name', function(newValue, oldValue) {
  $rootScope.State = newValue;
}); 

	
	
  $ionicPlatform.ready(function() {
	  
	  
  var notificationOpenedCallback = function(jsonData) {
	  
	  
  if (jsonData.additionalData.type == "newchatmsg")
  {
	  $rootScope.$broadcast('newchatmsg',jsonData.additionalData);
   
  }

  if (jsonData.additionalData.type == "deliverytimeupdate")
  {
	   $rootScope.$broadcast('deliverytimeupdate',jsonData.additionalData);
	   //jsonData.isActive
  }
	  

    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal.init("bf525572-86e6-48b6-9198-6ae09790d3a8",
                                 {googleProjectNumber: "595323574268"},
                                 notificationOpenedCallback);

  window.plugins.OneSignal.getIds(function(ids) {
	
  $rootScope.pushId = ids.userId;	
  
  });

								 
  // Show an alert box if a notification comes in when the user is in your app.
  window.plugins.OneSignal.enableInAppAlertNotification(false);
  window.plugins.OneSignal.enableNotificationsWhenActive(false);


  
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	$ionicConfigProvider.backButton.previousTitleText(false).text('');
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  
  .state('app.companymain', {
    url: '/companymain',
    views: {
      'menuContent': {
        templateUrl: 'templates/companymain.html',
        controller: 'CompanyMainCtrl'
      }
    }
  })


  .state('app.chat', {
    url: '/chat/:ItemId',
    views: {
      'menuContent': {
        templateUrl: 'templates/chat.html',
        controller: 'ChatCtrl'
      }
    }
  })

  
  
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
