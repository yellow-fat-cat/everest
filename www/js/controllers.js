angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$localStorage,$ionicSideMenuDelegate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.checkUserConnected = function()
  {
	  if ($localStorage.userid)
		  $scope.userConnected = true;
	  else
		  $scope.userConnected = false;
  }
  
  $scope.checkUserConnected();
  
  
  $scope.logOut = function()
  {
		$localStorage.userid = '';
		$localStorage.name = '';
		$localStorage.usertype = '';
		$localStorage.image = '';
		//$localStorage.deliverytime = '';			
		window.location ="#/app/login";	  
		$scope.checkUserConnected();
		$ionicSideMenuDelegate.toggleRight();		
  }
})


.controller('LoginRegisterCtrl', function($scope, $stateParams,$ionicPopup,$localStorage,$rootScope,SendPostToServer,$ionicHistory,$state) {


    if ($localStorage.userid)
    {
        $ionicHistory.nextViewOptions({
                disableAnimate: true,
                expire: 300,
				disableBack: true
            });
    
        $state.go('app.companymain');
    }


	
	$scope.loginfields = 
	{
		"username" : "admin",
		"password" : "admin",
	}
	
	$scope.registerfields = 
	{
		"name" : "",
		"city" : "",
		"address" : "",
		"house_number" : "",
		"floor" : "",
		"apartment" : "",
		"phone" : "",
		"username" : "",
		"password" : "",
		"pushid" : $rootScope.pushId

	}
	
	$scope.doRegister = function()
	{
		if ($scope.registerfields.name =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין שם לקוח',
			 template: ''
			});					
		}
		else if ($scope.registerfields.city =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין עיר',
			 template: ''
			});					
		}
		else if ($scope.registerfields.address =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין כתובת',
			 template: ''
			});					
		}
		else if ($scope.registerfields.house_number =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין מספר בית',
			 template: ''
			});					
		}
		else if ($scope.registerfields.floor =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין קומה',
			 template: ''
			});					
		}
		else if ($scope.registerfields.apartment =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין דירה',
			 template: ''
			});					
		}
		else if ($scope.registerfields.phone =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין טלפון',
			 template: ''
			});					
		}
		else if ($scope.registerfields.username =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין שם משתמש',
			 template: ''
			});					
		}
		else if ($scope.registerfields.password =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין סיסמה',
			 template: ''
			});					
		}	
		else
		{
			SendPostToServer($scope.registerfields,$rootScope.LaravelHost+'/RegisterPrivateUser',function(data, success) 
			{
					
				if (data.status == 0)
				{
					
					$localStorage.userid = data.userid;
					$localStorage.name = $scope.registerfields.name;
					$localStorage.usertype = 3; // 0 = company,1 = deliveryman, 2 = admin, 3 = private user
					//$localStorage.image = data.image;
					

					$scope.loginfields.name = '';
					$scope.loginfields.city = '';
					$scope.loginfields.address = '';
					$scope.loginfields.house_number = '';
					$scope.loginfields.floor = '';
					$scope.loginfields.apartment = '';
					$scope.loginfields.phone = '';
					$scope.loginfields.username = '';
					$scope.loginfields.password = '';
	
					window.location ="#/app/companymain";
					$scope.checkUserConnected();

						
				}
				else if (data.status == 1)
				{
					
					$ionicPopup.alert({
					 title: 'שם משתמש כבר קיים יש להזין שם משתמש אחר',
					 template: ''
					});		
				}

			});				
		}
	}

	
	
	$scope.doLogin = function()
	{
		if ($scope.loginfields.username =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין שם משתמש',
			 template: ''
			});				
		}
		else if ($scope.loginfields.password =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין סיסמה',
			 template: ''
			});				
		}
		else
		{
			
			$scope.sendfields = 
			{
				"username" : $scope.loginfields.username,
				"password" : $scope.loginfields.password,
				"pushid" : $rootScope.pushId				
			}
			SendPostToServer($scope.sendfields,$rootScope.LaravelHost+'/UserLogin',function(data, success) 
			{
					
				if (data.status == 0)
				{
					$ionicPopup.alert({
					 title: 'שם משתמש או סיסמה שגוים יש לנסות שוב',
					 template: ''
					});		

					$scope.loginfields.password = '';
				}
				else
				{
					$localStorage.userid = data.userid;
					$localStorage.name = data.name;
					//$localStorage.deliverytime = data.delivery_time;
				
					$localStorage.usertype = data.type; // 0 = company,1 = deliveryman, 2 = admin, 3 = private user
					$localStorage.image = data.image;
					$scope.loginfields.username = '';
					$scope.loginfields.password = '';
					
					//if (data.type == 0)
						window.location ="#/app/companymain";
						$scope.checkUserConnected();
					
				}
			});	
		}
	}
	
	
})


.controller('MainCtrl', function($scope, $stateParams,$ionicPopup,$localStorage,$rootScope,SendPostToServer,$ionicScrollDelegate,$timeout,$ionicModal,$ionicPlatform,$cordovaCamera) {

	$scope.navTitle = "<p dir='rtl'>"+$localStorage.name;+"</p>"
	$scope.host = $rootScope.serverHost;
	$scope.deliveryTime = "";
	$scope.informationArray = [];

	$rootScope.$watch('settingsArray', function () 
	{   
		$scope.informationArray = $rootScope.settingsArray;
		
		if ($rootScope.settingsArray[0])
			$scope.deliveryTime = $rootScope.settingsArray[0].delivery_time;
	});

	
	
	$scope.locationx = "";
	$scope.locationy = "";
	$scope.DeliverysArray = [];
	$scope.chatArray = new Array();
	$scope.user_local_storage = $localStorage.userid;
	$scope.user_type = $localStorage.usertype;
	$scope.DeliveryStatusTab = 0;
	$scope.unseenDeliveries = 0;
	$scope.deliveryPopupType = '';
	

	
	if ($scope.user_type == 0 )
		$scope.ActiveTab = 0;
	else if ($scope.user_type == 1 || $scope.user_type == 2)
		$scope.ActiveTab = 1;
	else if ($scope.user_type == 3)
		$scope.ActiveTab = 3;

	$scope.setActiveTab = function(tab)
	{
		//$scope.DeliverysArray = [];
		$scope.DeliveryStatusTab = 0;
		$scope.ActiveTab = tab;
	}
	
	$scope.changeTabDelivery = function(tab)
	{
		$scope.DeliveryStatusTab = tab;
	}
	
	$scope.filterDelivery = function(item)
	{
		if (item.status != 3 && $scope.DeliveryStatusTab == 0)
			return true;
		
		else if (item.status == 3 && $scope.DeliveryStatusTab == 1)
			return true;
		else
			return false;		
	}
	
	$scope.autocompleteOptions = 
	{
	  //componentRestrictions: { country: 'IL' }
	}	
	
	$scope.fields = 
	{
		"address" : "",
		"phone" : "",
		"housenumber" : "",
		"chatbox" : ""
	}
	
	$scope.deliveryfields = 
	{
		"index" : "",
		"id" : "",
		"time" : "",
		"deliveryman" : "",
		"previousdeliveryman" : "",
		"newdeliverymanname" : "",
		"deliverytime" : "",
		"company_id" : ""
	}
	
	$scope.orderfields = 
	{
		"details": "",
		"desc" : ""
	}
	
	$scope.privatedelivery = 
	{
		"index" : "",
		"id" : "",
		"time" : "",
		"price" : "",
		"recipent" : ""
	}
	


	$scope.$watch('ActiveTab', function () 
	{   
		if ($scope.ActiveTab == 1)
			$scope.GetDeliveries(0);
		
		if ($scope.ActiveTab == 2 && $scope.user_type != 2)
			$scope.getChatHistory();
		
		if ($scope.ActiveTab == 2 && $scope.user_type == 2)
			$scope.getAdminMessages();

		if ($scope.ActiveTab == 4 && $scope.user_type == 2)
			$scope.GetDeliveries(1);

	});	
	
	$scope.doRefresh = function()
	{
		$scope.GetDeliveries(0);
		$scope.$broadcast('scroll.refreshComplete');
	}
	
	
	$rootScope.$on('deliverytimeupdate', function(event, args) {

		if ($scope.ActiveTab == 1)
			$scope.GetDeliveries(0);
	});

	$rootScope.$on('newprivateorder', function(event, args) {

		if ($scope.ActiveTab == 4)
			$scope.GetDeliveries(1);
		
	});
	
	
	
	$scope.GetTime = function(date)
	{
		$scope.splitDate = date.split(" ");
		$scope.SplitTime = $scope.splitDate[1].split(":");
		$scope.newTime = $scope.SplitTime[0]+':'+$scope.SplitTime[1];
		return $scope.newTime;
	}
	
	$scope.deliveryStatus = function(index)
	{
		var deliverystatusText = '';
		
		
		if (index == 1)
			deliverystatusText = 'התקבל';

		if (index == 2)
			deliverystatusText = 'בטיפול';

		if (index == 3)
			deliverystatusText = 'נמסר';		
		
		return deliverystatusText;
	}

	//CustumerType 0 = normal delivery , 1 = private custumer
	$scope.GetDeliveries = function(CustumerType)
	{
		$scope.deliveryparams = 
		{
			"user" : $localStorage.userid,
			"type" : $scope.user_type,
			"private_custumer" : CustumerType
		}
		

		SendPostToServer($scope.deliveryparams,$rootScope.LaravelHost+'/GetDeliveries',function(data, success) 
		{					
			$scope.DeliverysArray = data;
			$scope.unseenDeliveries = 0;
			
			
			
			for (var i = 0; i < $scope.DeliverysArray.length; i++) 
			{
				if ($scope.DeliverysArray[i].status == 0)
					$scope.unseenDeliveries++;
			}
		
			console.log("DeliverysArray: ", data);
		});	
	}
	
	
	$scope.selectPrivateDeliveryman = function(index,id)
	{
		
		$scope.getDeliveryMan();
		$scope.deliveryfields.index = index;
		$scope.deliveryfields.id = id;
		
		
	   $ionicModal.fromTemplateUrl('templates/private_modal.html', {
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(SelectPrivatePopup) {
		  $scope.SelectPrivatePopup = SelectPrivatePopup;
		  $scope.SelectPrivatePopup.show();
		});
	}
	
	$scope.closeSelectPrivateDeliveryman = function()
	{
		$scope.SelectPrivatePopup.hide();
	}
	
	$scope.sendPrivateDeliveryman = function()
	{
		if ($scope.deliveryfields.deliveryman =="")
		{
			$ionicPopup.alert({
			 title: 'יש לבחור שליח',
			 template: ''
			});				
		}
		else
		{
			
			$scope.sendparams = 
			{
				"user" : $localStorage.userid,
				"id" : $scope.deliveryfields.id,
				"recipent" : $scope.deliveryfields.deliveryman,
			}
			

			SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/SendPrivateCustumerDelivery',function(data, success) 
			{	
				$scope.DeliverysArray[$scope.deliveryfields.index].private_delivery_status = 3;
				$scope.SelectPrivatePopup.hide();
			});	


			
			//alert ();
		}
	}
	
	
	
	$scope.privateCustumerPopup = function(index,id,recipent)
	{
	   $scope.privatedelivery.index = index;
	   $scope.privatedelivery.id = id;
	   $scope.privatedelivery.recipent = recipent;
	   
	   
	   $ionicModal.fromTemplateUrl('templates/private_custumerpopup.html', {
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(privatePopup) {
		  $scope.privatePopup = privatePopup;
		  $scope.privatePopup.show();
		});
	}
	
	$scope.closePrivatePopup = function()
	{
		$scope.privatePopup.hide();
	}
	
	$scope.confirmPrivateDelivery = function(index,id)
	{
		
	   var confirmPopup = $ionicPopup.confirm({
		 title: 'האם לאשר הזמנה?',
		 template: '',
		 cancelText: "ביטול",
		 okText: "אישור"	 
	   });
    	confirmPopup.then(function(res) {
		if(res) 
		{
			
			$scope.params = 
			{
				"user" : $localStorage.userid,
				"id" : id,
			}
			
			SendPostToServer($scope.params,$rootScope.LaravelHost+'/ConfirmPrivateOrder',function(data, success) 
			{					
				$scope.DeliverysArray[index].private_delivery_status = 2;
			});	
		} 
	   });	


	   
	}
	
	$scope.cancelDelivery = function(index,id)
	{
	   var confirmPopup = $ionicPopup.confirm({
		 title: 'האם לאשר ביטול משלוח?',
		 template: '',
		 cancelText: "ביטול",
		 okText: "אישור"	 
	   });
    	confirmPopup.then(function(res) {
		if(res) 
		{
			
			$scope.params = 
			{
				"user" : $localStorage.userid,
				"id" : id,
			}
			
			SendPostToServer($scope.params,$rootScope.LaravelHost+'/CancelDelivery',function(data, success) 
			{					
				$scope.DeliverysArray.splice(index, 1);
			});	
		} 
	   });	
	}
	
	$scope.savePrivateDelivery = function()
	{
		
		if ($scope.privatedelivery.time == "")
		{
			$ionicPopup.alert({
			 title: 'יש להזין שעת אספקה',
			 template: ''
			});				
		}
		
		else if ($scope.privatedelivery.price == "")
		{
			$ionicPopup.alert({
			 title: 'יש להזין מחיר',
			 template: ''
			});				
		}
		else
		{
			SendPostToServer($scope.privatedelivery,$rootScope.LaravelHost+'/SendPrivateDelivery',function(data, success) 
			{			
				$scope.DeliverysArray[$scope.privatedelivery.index].private_delivery_status = 1;
				$scope.closePrivatePopup();
			});
		}
	}	

	
	$scope.updateDeliveryStatus = function(index,id,deliverystatus)
	{
		
		$scope.sendUpdate = 0;

		if (deliverystatus == 1) {
			$scope.DeliverysArray[index].status = 2;
			$scope.sendUpdate = 1;
			$scope.newStatus = 2;
		}
		
		if (deliverystatus == 2) {
			$scope.DeliverysArray[index].status = 3;
			$scope.sendUpdate = 1;
			$scope.newStatus = 3;
		}
		
	    if ($scope.sendUpdate == 1)
		{
			$scope.sendparams = 
			{
				"user" : $localStorage.userid,
				"id": id,
				"status" : $scope.newStatus
			}
			

			
			SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/UpdateDeliveryStatus',function(data, success) 
			{					
				
			});
		}
	}
	
	$scope.getDeliveryMan = function()
	{
		$scope.sendparams = 
		{
			"user" : $localStorage.userid,
		}
		

		SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/GetDeliveryman',function(data, success) 
		{					
			$scope.deliverymanJson = data;
		});
	}
	
	$scope.openTime = function()
	{
		var options = {
			date: new Date(),
			mode: 'time',
			//minuteInterval: 10,
			is24Hour : true
		};
		
		
		datePicker.show(options, function(date){
			$scope.newHour = date.toString().split(" ")[4];
			$scope.splitHour = $scope.newHour.split(":");
			$scope.newTime = $scope.splitHour[0]+":"+$scope.splitHour[1];
			$scope.deliveryfields.time = $scope.newTime;
			$scope.privatedelivery.time = $scope.newTime;
			$scope.updateTime();
			//alert ($scope.newTime)
		
		});
	}
	
	$scope.updateTime = function()
	{
		 $timeout(function() {
			$scope.deliveryfields.time = $scope.newTime;
		}, 100);
	}

	
	
	
	$scope.openTimePopup = function(index,id,ordertime,companyid)
	{

	
		//$scope.getDeliveryMan();
		$scope.deliveryfields.index = index;
		$scope.deliveryfields.id = id;
		$scope.deliveryfields.deliverytime = $scope.GetTime(ordertime);
		$scope.deliveryfields.company_id = companyid;
		
			

	   $ionicModal.fromTemplateUrl('templates/time_modal.html', {
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(timeModal) {
		  $scope.timeModal = timeModal;
		  $scope.timeModal.show();
		});
	}
	
	$scope.openDeliveryPopup = function(index,id,companyid)
	{
		$scope.deliveryPopupType = 0;
		$scope.getDeliveryMan();
		$scope.deliveryfields.index = index;
		$scope.deliveryfields.id = id;
		$scope.deliveryfields.company_id = companyid;
		
		
	   $ionicModal.fromTemplateUrl('templates/deliveryman_select.html', {
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(deliverymanModal) {
		  $scope.deliverymanModal = deliverymanModal;
		  $scope.deliverymanModal.show();
		});		
	}
	
	
	$scope.changeDeliveryPopup = function(index,id,companyid,deliverymanid)
	{
		$scope.deliveryPopupType = 1;
		$scope.getDeliveryMan();
		$scope.deliveryfields.index = index;
		$scope.deliveryfields.id = id;
		$scope.deliveryfields.company_id = companyid;
		//$scope.deliveryfields.deliveryman = deliverymanid;
		$scope.deliveryfields.previousdeliveryman = deliverymanid;
		

	   $ionicModal.fromTemplateUrl('templates/deliveryman_select.html', {
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(deliverymanModal) {
		  $scope.deliverymanModal = deliverymanModal;
		  $scope.deliverymanModal.show();
		});	
		
	}
	
	$scope.closeDeliverymanModal = function()
	{
		$scope.deliverymanModal.hide();
	}
	
	
	$scope.changeDeliveryman = function()
	{
		if ($scope.deliveryfields.deliveryman =="")
		{
			$ionicPopup.alert({
			 title: 'יש לבחור שליח',
			 template: ''
			});	
		}
		else
		{

			//get new deliveryman name
			for (var i = 0; i < $scope.deliverymanJson.length; i++) 
			{
				if ($scope.deliverymanJson[i].index == $scope.deliveryfields.deliveryman)
					$scope.deliveryfields.newdeliverymanname = $scope.deliverymanJson[i].name;
			}


			$scope.sendparams = 
			{
				"user" : $localStorage.userid,
				"id" : $scope.deliveryfields.id,
				"previousdeliveryman" : $scope.deliveryfields.previousdeliveryman,			
				"deliveryman" : $scope.deliveryfields.deliveryman,
				"company_id" : $scope.deliveryfields.company_id,
			}
			
			SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/ChangeDeliveryMan',function(data, success) 
			{	
			
					$scope.closeDeliverymanModal();
					
					$ionicPopup.alert({
					 title: 'שליח הוחלף בהצלחה',
					 template: ''
					});	

				$scope.DeliverysArray[$scope.deliveryfields.index].deliverman_id = $scope.deliveryfields.deliveryman;
				$scope.DeliverysArray[$scope.deliveryfields.index].deliveryData[0].name = $scope.deliveryfields.newdeliverymanname;
				$scope.closeDeliverymanModal();
			});	


			

		}
	}
	
	
	$scope.updateDeliveryman = function()
	{
		if ($scope.deliveryfields.deliveryman == "")
		{
			$ionicPopup.alert({
			 title: 'יש לבחור שליח',
			 template: ''
			});				
		}
		else
		{

			$scope.sendparams = 
			{
				"user" : $localStorage.userid,
				"id" : $scope.deliveryfields.id,
				"deliveryman" : $scope.deliveryfields.deliveryman,
				"company_id" : $scope.deliveryfields.company_id
			}
			
			
			SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/UpdateDeliveryMan',function(data, success) 
			{	
				$ionicPopup.alert({
				 title: 'הזמנה נשלחה לשליח',
				 template: ''
				});	
				$scope.DeliverysArray[$scope.deliveryfields.index].status = 1;
				$scope.DeliverysArray[$scope.deliveryfields.index].deliverman_id = $scope.deliveryfields.deliveryman;
				$scope.closeDeliverymanModal();
			});	
			//
		}
	}
	
	
	$scope.sendDelivery = function()
	{
		if ($scope.orderfields.details =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין פרטי ההזמנה',
			 template: ''
			});				
		}
		else
		{
			$scope.sendparams = 
			{
				"user" : $localStorage.userid,
				"details" : $scope.orderfields.details,
				"desc" : $scope.orderfields.desc,
			}
			

			SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/AddPrivateDelivery',function(data, success) 
			{	
				$ionicPopup.alert({
				 title: 'הזמנה נשלחה בהצלחה',
				 template: ''
				});		
			
				$scope.orderfields.details = '';
				$scope.orderfields.desc = '';
				
				$scope.ActiveTab = 1;
			});			
		}

	}
	
	

	$scope.saveDeliveryTime = function()
	{
		
		if ($scope.deliveryfields.time == "")
		{
			$ionicPopup.alert({
			 title: 'יש להזין זמן משלוח',
			 template: ''
			});				
		}
		
		
		/*
		else if($scope.deliveryfields.deliveryman == "")
		{
			$ionicPopup.alert({
			 title: 'יש לבחור שליח',
			 template: ''
			});				
		}
		*/
		
		else
		{
			
			$scope.sendparams = 
			{
				"user" : $localStorage.userid,
				"id" : $scope.deliveryfields.id,
				"time" : $scope.deliveryfields.time,
				"deliveryman" : $scope.deliveryfields.deliveryman,
				"deliverytime" : $scope.deliveryfields.deliverytime,
				"company_id" : $scope.deliveryfields.company_id	
			}
			


			SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/UpdateDeliveryTime',function(data, success) 
			{	
				$scope.DeliverysArray[$scope.deliveryfields.index ].time = $scope.deliveryfields.time;
				$scope.DeliverysArray[$scope.deliveryfields.index ].status = 0; 
				$scope.DeliverysArray[$scope.deliveryfields.index ].estimated_time = data.estimated_time;

				$scope.closeTimeModal();
				$scope.deliveryfields.time = '';
				$scope.deliveryfields.deliveryman = '';
			});
		}
	}
	
	
	$scope.addDelivery = function()
	{
		if ($scope.fields.address =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין כתובת למשלוח',
			 template: ''
			});	
		}
		else if ($scope.fields.address.formatted_address =="" || $scope.fields.address.formatted_address == undefined)
		{
			$ionicPopup.alert({
			 title: 'יש להזין כתובת למשלוח',
			 template: ''
			});	
		}	
		/*
		else if ($scope.fields.phone =="")
		{
			$ionicPopup.alert({
			 title: 'יש להזין מספר טלפון',
			 template: ''
			});	
		}
		*/
		

		else
		{
			
			if ($scope.fields.address.formatted_address)
			{
				$scope.newaddressgeo = String($scope.fields.address.geometry.location);
				$scope.splitaddress = $scope.newaddressgeo.split(",");
				$scope.locationx = $scope.splitaddress[0].replace("(", "");
				$scope.locationy = $scope.splitaddress[1].replace(")", "");				
			}

			
			$scope.sendparams = 
			{
				"user" : $localStorage.userid,
				"address": $scope.fields.address.formatted_address,
				"housenumber": $scope.fields.housenumber,
				"phone": $scope.fields.phone,
				"location_lat" : $scope.locationx,
				"location_lng" : $scope.locationy
				
			}
			
			
			SendPostToServer($scope.sendparams,$rootScope.LaravelHost+'/AddNewDelivery',function(data, success) 
			{					
				$scope.setActiveTab(1);
				$scope.fields.address = '';
				$scope.fields.phone = '';
				$scope.fields.housenumber = '';
			});	
		}
	}
	
	
	$scope.dialPhone = function(phone)
	{
		window.open('tel:' + phone, '_system');
	}
	
	$scope.showInformationPopup = function()
	{
	   $ionicModal.fromTemplateUrl('templates/information_popup.html', {
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(informationPopup) {
		  $scope.informationPopup = informationPopup;
		  $scope.informationPopup.show();
		});
	}
	
	$scope.closeInformationPopup = function()
	{
		$scope.informationPopup.hide();
	}


	/* chat */
	
	$rootScope.$on('newchatmsg', function(event, args) 
	{

	  $timeout(function() 
	  {
		 //update/refresh messages for admin
		 if ($scope.user_type == 2)
		 {
			 if (args.updateadmin == 1)
			 {
				 $scope.getAdminMessages();
			 }			 
		 }

		  
		
		  
		$scope.date = new Date()
		$scope.hours = $scope.date.getHours()
		$scope.minutes = $scope.date.getMinutes()
	
		if ($scope.hours < 10)
		$scope.hours = " " + $scope.hours
		
		if ($scope.minutes < 10)
		$scope.minutes = "0" + $scope.minutes
	
		$scope.time = $scope.hours+':'+$scope.minutes;

		
		$scope.chat  = 
		{
			"text" : args.text,
			"userimage" : args.userimage,
			"userid" : args.userid,
			"time" : $scope.time
		}
		
		
		
		if ($scope.chatArray.length == 0)
			$scope.chatArray = new Array();		
		
					
		$scope.chatArray.push($scope.chat);
		//$ionicScrollDelegate.scrollBottom();


	  }, 300);		
	
			
	});



	
	
	$scope.getChatHistory = function()
	{

		$scope.sendfields = 
		{
			"user" : $localStorage.userid,
			"serverhost" : $scope.host
		}
		SendPostToServer($scope.sendfields,$rootScope.LaravelHost+'/GetChatHistory',function(data, success) 
		{
			console.log("chat history: " , data);
			
			
			if (data.length == 0)
				$scope.chatArray = new Array();
			else
			{
				$scope.chatArray = data;
				//$scope.chatArray.reverse();
			}
				
			
			$ionicScrollDelegate.scrollBottom();					
		});		
	
	}
	
	$scope.getAdminMessages = function()
	{
		$scope.sendfields = 
		{
			"user" : $localStorage.userid,
		}
		SendPostToServer($scope.sendfields,$rootScope.LaravelHost+'/getAdminMessages',function(data, success) 
		{
			console.log("getAdminMessages: " , data);
			$scope.AdminMessagesArray = data;
		});			
	}
	
	
	
	$scope.sendChat = function(isImage,fileName)
	{
		
			if (isImage == 0)
				$scope.textField = $scope.fields.chatbox;
			else
				$scope.textField = fileName;

			
		if ($scope.textField)
		{
			
			$scope.date = new Date()
			$scope.hours = $scope.date.getHours()
			$scope.minutes = $scope.date.getMinutes()
		
			if ($scope.hours < 10)
			$scope.hours = " " + $scope.hours
			
			if ($scope.minutes < 10)
			$scope.minutes = "0" + $scope.minutes
			$scope.time = $scope.hours+':'+$scope.minutes;


			

			$scope.sendfields = 
			{
				"user" : $localStorage.userid,
				"recipent" : 1,//$localStorage.userid , //everest manager
				"text" : $scope.textField,
				"time" : $scope.time,
				"serverhost" : $scope.host,		
				"isImage" : isImage	
				
			}
			SendPostToServer($scope.sendfields,$rootScope.LaravelHost+'/SendNewMessage',function(data, success) 
			{
				
				$scope.chat  = 
				{
					"username" : $localStorage.name,
					"text" : $scope.textField,
					"userimage" : $localStorage.image,
					"userid" : $localStorage.userid,
					"time" : $scope.time,
					"isImage" : isImage	
				}

				console.log("chatArray: ", $scope.chatArray)
				
				if ($scope.chatArray.length == 0)
					$scope.chatArray = new Array();
					

				$scope.chatArray.push($scope.chat);
				$scope.fields.chatbox = '';
				$ionicScrollDelegate.scrollBottom();					
			});	
		}
	}
	
	
	
	$scope.enterPress = function(keyEvent)
	{
		if (keyEvent.which === 13)
		{
			$scope.sendChat(0);
		}
	}



	$scope.imageOptions = function()
	{

			var myPopup = $ionicPopup.show({
			//template: '<input type="text" ng-model="data.myData">',
			//template: '<style>.popup { width:500px; }</style>',
			title: 'בחירת מקור התמונה:',
			scope: $scope,
			cssClass: 'custom-popup',
			buttons: [


		   {
			text: 'מצלמה',
			type: 'button-positive',
			onTap: function(e) { 
			  $scope.takePicture(1);
			}
		   },
		   {
			text: 'גלריית תמונות',
			type: 'button-calm',
			onTap: function(e) { 
			 $scope.takePicture(0);
			}
		   },
		   
			{
			text: 'ביטול',
			type: 'button-assertive',
			onTap: function(e) {  
			  //alert (1)
			}
		   },
		   
		   ]
		  });
		  
		  //ClosePopupService.register(myPopup);
	
	}
	
	


	// destinationType : Camera.DestinationType.DATA_URL,  CAMERA
	$scope.takePicture = function(index) 
	{
		 var options ;
		 
		if(index == 1 )
		{
			options = { 
				quality : 75, 
				destinationType : Camera.DestinationType.FILE_URI,  //Camera.DestinationType.DATA_URL, 
				sourceType : Camera.PictureSourceType.CAMERA, 
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 600,
				targetHeight: 600,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true
			};
		}
		else
		{
			options = { 
				quality : 75, 
				destinationType : Camera.DestinationType.FILE_URI,  //Camera.DestinationType.DATA_URL, 
				sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 600,
				targetHeight: 600,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true
			};
		}
	 
        $cordovaCamera.getPicture(options).then(function(imageData) 
		{
			/*
			if(index == 1 )
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
			else
			*/
			$scope.imgURI = imageData
			var myImg = $scope.imgURI;
			var options = new FileUploadOptions();
			options.mimeType = 'jpeg';
			options.fileKey = "file";
			options.chunkedMode = false;
			options.fileName = $scope.imgURI.substr($scope.imgURI.lastIndexOf('/') + 1);
			//alert(options.fileName)
			var params = {};
			//params.user_token = localStorage.getItem('auth_token');
			//params.user_email = localStorage.getItem('email');
			options.params = params;
			var ft = new FileTransfer();
			//UploadImg1.php
			ft.upload($scope.imgURI, encodeURI($rootScope.LaravelHost+'/uploadImage'), $scope.onUploadSuccess, $scope.onUploadFail, options);
    	});
		
		$scope.onUploadSuccess = function(data)
		{
			//console.log(data)
			 $timeout(function() {

				if (data.response)
				{
					
					$scope.sendChat(1,data.response);

				}
				
				}, 300);
			

		}
		
		$scope.onUploadFail = function(data)
		{
			//alert(JSON.stringify(data));
			alert("onUploadFail : " + data);
		}
    }	
	
	


	
	
	
	$scope.enterPress = function(keyEvent)
	{
		if (keyEvent.which === 13)
		{
			$scope.sendChat(0);
		}
	}	
	
	/* end chat functions */
	
	
	document.addEventListener("resume", resumefun, false);
	
	function resumefun()
	{
       if ($rootScope.State == "app.companymain")
	   {
		   
			
			if ($scope.ActiveTab == 1)
				$scope.GetDeliveries(0);

			
			if ($scope.ActiveTab == 4 && $scope.user_type == 2)
				$scope.GetDeliveries(1);

		   
			if ($scope.ActiveTab == 2 && $scope.user_type != 2)
				$scope.getChatHistory();
			
			if ($scope.ActiveTab == 2 && $scope.user_type == 2)
				$scope.getAdminMessages();
		
	   }
	}
	
	/*
    $ionicPlatform.on("resume", function(event) {
		
    });
	*/
	

})


//admin chat controller.
.controller('ChatCtrl', function($scope, $stateParams,$ionicPopup,$localStorage,$rootScope,SendPostToServer,$ionicScrollDelegate,$timeout,$ionicModal,$ionicPlatform,$cordovaCamera) {

	$scope.recipentId = $stateParams.ItemId;
	$scope.navTitle = "";
	$scope.host = $rootScope.serverHost;
	$scope.chatArray = new Array();
	$scope.user_local_storage = $localStorage.userid;
	$scope.user_type = $localStorage.usertype;	


	$scope.fields = 
	{
		"chatbox" : ""
	}


	$rootScope.$on('newchatmsg', function(event, args) 
	{

	  $timeout(function() 
	  {
		  
		$scope.date = new Date()
		$scope.hours = $scope.date.getHours()
		$scope.minutes = $scope.date.getMinutes()
	
		if ($scope.hours < 10)
		$scope.hours = " " + $scope.hours
		
		if ($scope.minutes < 10)
		$scope.minutes = "0" + $scope.minutes
	
		$scope.time = $scope.hours+':'+$scope.minutes;

		
		$scope.chat  = 
		{
			"text" : args.text,
			"userimage" : args.userimage,
			"userid" : args.userid,
			"time" : $scope.time,
			"isImage" : args.isImage
		}
		
		
		
		if ($scope.chatArray.length == 0)
			$scope.chatArray = new Array();		
		
					
		$scope.chatArray.push($scope.chat);
		//$ionicScrollDelegate.scrollBottom();


	  }, 300);		
	
			
	});



	
	
	$scope.GetAdminChatHistory = function()
	{

		$scope.sendfields = 
		{
			"user" : $localStorage.userid,
			"serverhost" : $scope.host,
			"recipent" : $scope.recipentId,
		}
		SendPostToServer($scope.sendfields,$rootScope.LaravelHost+'/GetAdminChatHistory',function(data, success) 
		{
			console.log("chat history: " , data);
			
			
			if (data.length == 0)
				$scope.chatArray = new Array();
			else
			{
				$scope.chatArray = data;
				//$scope.chatArray.reverse();
			}
			
			$ionicScrollDelegate.scrollBottom();					
		});		
	
	}
	
	
	$scope.GetAdminChatHistory();
	

	$scope.sendChat = function(isImage,fileName)
	{
		
			if (isImage == 0)
				$scope.textField = $scope.fields.chatbox;
			else
				$scope.textField = fileName;

			
		if ($scope.textField)
		{
			
			$scope.date = new Date()
			$scope.hours = $scope.date.getHours()
			$scope.minutes = $scope.date.getMinutes()
		
			if ($scope.hours < 10)
			$scope.hours = " " + $scope.hours
			
			if ($scope.minutes < 10)
			$scope.minutes = "0" + $scope.minutes
			$scope.time = $scope.hours+':'+$scope.minutes;


			

			$scope.sendfields = 
			{
				"user" : $localStorage.userid,
				"recipent" : $scope.recipentId,
				"text" : $scope.textField,
				"time" : $scope.time,
				"serverhost" : $scope.host,		
				"isImage" : isImage	
				
			}
			SendPostToServer($scope.sendfields,$rootScope.LaravelHost+'/SendNewMessage',function(data, success) 
			{
				
				$scope.chat  = 
				{
					"username" : $localStorage.name,
					"text" : $scope.textField,
					"userimage" : $localStorage.image,
					"userid" : $localStorage.userid,
					"time" : $scope.time,
					"isImage" : isImage	
				}

				console.log("chatArray: ", $scope.chatArray)
				
				if ($scope.chatArray.length == 0)
					$scope.chatArray = new Array();
					

				$scope.chatArray.push($scope.chat);
				$scope.fields.chatbox = '';
				$ionicScrollDelegate.scrollBottom();					
			});	
		}
	}
	
	
	
	$scope.enterPress = function(keyEvent)
	{
		if (keyEvent.which === 13)
		{
			$scope.sendChat(0);
		}
	}



	$scope.imageOptions = function()
	{

			var myPopup = $ionicPopup.show({
			//template: '<input type="text" ng-model="data.myData">',
			//template: '<style>.popup { width:500px; }</style>',
			title: 'בחירת מקור התמונה:',
			scope: $scope,
			cssClass: 'custom-popup',
			buttons: [


		   {
			text: 'מצלמה',
			type: 'button-positive',
			onTap: function(e) { 
			  $scope.takePicture(1);
			}
		   },
		   {
			text: 'גלריית תמונות',
			type: 'button-calm',
			onTap: function(e) { 
			 $scope.takePicture(0);
			}
		   },
		   
			{
			text: 'ביטול',
			type: 'button-assertive',
			onTap: function(e) {  
			  //alert (1)
			}
		   },
		   
		   ]
		  });
		  
		  //ClosePopupService.register(myPopup);
	
	}
	
	


	// destinationType : Camera.DestinationType.DATA_URL,  CAMERA
	$scope.takePicture = function(index) 
	{
		 var options ;
		 
		if(index == 1 )
		{
			options = { 
				quality : 75, 
				destinationType : Camera.DestinationType.FILE_URI,  //Camera.DestinationType.DATA_URL, 
				sourceType : Camera.PictureSourceType.CAMERA, 
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 600,
				targetHeight: 600,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true
			};
		}
		else
		{
			options = { 
				quality : 75, 
				destinationType : Camera.DestinationType.FILE_URI,  //Camera.DestinationType.DATA_URL, 
				sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 600,
				targetHeight: 600,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true
			};
		}
	 
        $cordovaCamera.getPicture(options).then(function(imageData) 
		{
			/*
			if(index == 1 )
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
			else
			*/
			$scope.imgURI = imageData
			var myImg = $scope.imgURI;
			var options = new FileUploadOptions();
			options.mimeType = 'jpeg';
			options.fileKey = "file";
			options.chunkedMode = false;
			options.fileName = $scope.imgURI.substr($scope.imgURI.lastIndexOf('/') + 1);
			//alert(options.fileName)
			var params = {};
			//params.user_token = localStorage.getItem('auth_token');
			//params.user_email = localStorage.getItem('email');
			options.params = params;
			var ft = new FileTransfer();
			//UploadImg1.php
			ft.upload($scope.imgURI, encodeURI($rootScope.LaravelHost+'/uploadImage'), $scope.onUploadSuccess, $scope.onUploadFail, options);
    	});
		
		$scope.onUploadSuccess = function(data)
		{
			//console.log(data)
			 $timeout(function() {

				if (data.response)
				{
					
					$scope.sendChat(1,data.response);

				}
				
				}, 300);
			

		}
		
		$scope.onUploadFail = function(data)
		{
			//alert(JSON.stringify(data));
			alert("onUploadFail : " + data);
		}
    }	


	document.addEventListener("resume", resumechatfun, false);

	function resumechatfun()
	{
		if ($rootScope.State == "app.chat")
		   $scope.GetAdminChatHistory();		
	}
	
	/*
    $ionicPlatform.on("resume", function(event) {

    });
	*/

})



.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {

      $timeout(function() {
        element[0].focus(); 
      });
    }
  };
})
