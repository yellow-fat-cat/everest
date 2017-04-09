angular.module('starter.factories', [])

.factory('SendPostToServer', SendPostToServer)




function SendPostToServer($http,$rootScope,$ionicLoading) 
{
  return function(params,url,callback) 
  {
		
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-assertive"></ion-spinner>',
          noBackdrop : true,
          duration : 10000
        });
		
		
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8; application/json';	
		console.log("URL : " , url)
		$http.post(url,params)
			.success(function(data, status, headers, config)
			{
				$ionicLoading.hide();		
				console.log("s2")
				callback(data, true);

			})
			.error(function(data, status, headers, config)
			{  
				//$ionicLoading.hide();
				console.log("s3")
				callback("Error", false);
			});						
  }
}



