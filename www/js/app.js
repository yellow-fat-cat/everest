// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngStorage','ngCordova','google.places','starter.factories'])

.run(function($ionicPlatform,$rootScope,$state,SendPostToServer) {
	
$rootScope.LaravelHost = 'http://tapper.co.il/everest/laravel/public/';
$rootScope.serverHost = 'http://tapper.co.il/everest/php/';

$rootScope.currState = $state;
$rootScope.State = '';
$rootScope.settingsArray = [];

$rootScope.$watch('currState.current.name', function(newValue, oldValue) {
  $rootScope.State = newValue;
}); 

	
	
  $ionicPlatform.ready(function() {
	  
	  
	$rootScope.getSettings = function()
	{
		$rootScope.params = {};
		SendPostToServer($rootScope.params,$rootScope.LaravelHost+'/GetClientSettings',function(data, success) 
		{					
			$rootScope.settingsArray = data;
			console.log("settings: " , data);
		});			
	}
	
	$rootScope.getSettings();


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



  if (jsonData.additionalData.type == "newprivateorder")
  {
	   $rootScope.$broadcast('newprivateorder',jsonData.additionalData);
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
        controller: 'LoginRegisterCtrl'
      }
    }
  })

  .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html',
        controller: 'LoginRegisterCtrl'
      }
    }
  }) 
  
  .state('app.companymain', {
    url: '/companymain',
    views: {
      'menuContent': {
        templateUrl: 'templates/companymain.html',
        controller: 'MainCtrl'
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






  .state('app.html_1', {
    url: '/html_1',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_1.html',
        controller: 'MainCtrl'
      }
    }
  })

    .state('app.html_2', {
    url: '/html_2',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_2.html',
        controller: 'MainCtrl'
      }
    }
  })

     .state('app.html_3', {
    url: '/html_3',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_3.html',
        controller: 'MainCtrl'
      }
    }
  })

      .state('app.html_4', {
    url: '/html_4',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_4.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.html_5', {
    url: '/html_5',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_5.html',
        controller: 'MainCtrl'
      }
    }
  })

   .state('app.html_6', {
    url: '/html_6',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_6.html',
        controller: 'MainCtrl'
      }
    }
  })

    .state('app.html_7', {
    url: '/html_7',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_7.html',
        controller: 'MainCtrl'
      }
    }
  })

     .state('app.html_8', {
    url: '/html_8',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_8.html',
        controller: 'MainCtrl'
      }
    }
  })

        .state('app.html_10', {
    url: '/html_10',
    views: {
      'menuContent': {
        templateUrl: 'templates/html_10.html',
        controller: 'MainCtrl'
      }
    }
  })
  

  
  
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
