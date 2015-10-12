'use strict';
/*
app.factory("GlobalData", ['$http', function($http){
	var utils = {};
	
	utils.currentDate = new Date();
    utils.currentMoment = new Date();
	utils.currentUser = new User();
    utils.weekStart = new Date();
    utils.weekEnd = new Date();
    utils.weekDays = [];
    utils.isLoading = new Boolean(false);
    utils.newRequest = new RequestTemplate();
    utils.newRequest.startTime = "08:00";
    utils.newRequest.endTime = "12:00";
    utils.newDriver = new DriverTemplate();
	
	utils.statusList = new Array();
	utils.driverList = new Array();
	utils.driverFioList = new Array();
	utils.transportItemList = new Array();
	utils.transportItemTitleList = new Array();
	utils.rejectReasonList = new Array();
	utils.userList = new Array();
	utils.userFioList = new Array();
	utils.routeList = new Array();
	utils.transportSubtypeList = new Array();

    utils.sections = {};
    utils.sections.list = new Boolean(false);
    utils.sections.panorama = new Boolean(false);
    utils.sections.drivers = new Boolean(false);
    utils.sections.items = new Boolean(false);
	
	
	utils.getCurrentDate = function(){
		$http.post('php/getDate.php').success(function(data){
			if(data != "" && data != null){
				utils.currentDate = moment.unix(data.valueOf()).toDate();
                utils.currentMoment = moment.unix(data.valueOf()).toDate();

                var tempDate = moment(utils.currentDate);
                console.log("day = " + tempDate.day());
                if(tempDate.day() == 1){
                    utils.weekStart = tempDate.toDate();
                    console.log("weekStart = " + moment(utils.weekStart).toDate());
                } else {
                    while(tempDate.day() != 1){
                        tempDate.add("days", -1);
                    }
                }


                   var tempWeekStart = tempDate;
                    utils.weekStart = tempWeekStart.toDate();
                console.log("weekStart = " + utils.weekStart);
                var tempWeekEnd = new moment(tempDate);
                tempWeekEnd.add("days", 6);
                utils.weekEnd = tempWeekEnd.toDate();
                console.log("weekEnd = " + utils.weekEnd);

                    for(var i=0; i<=6; i++){
                        var day = new moment(tempDate);
                        utils.weekDays.push(day);
                        tempDate.add("days", 1);
                    }
                    //while(tempDate.day() <= 6){
                    //    var day = new moment(tempDate);
                    //    utils.weekDays.push(day);
                    //    tempDate.add("days", 1);
                    //}
                    console.log("weekDays = " + utils.weekDays);
                //}
                console.log("week start = " + moment(utils.weekStart).toDate());
                //console.log(utils.weekDays);
			}
		}); 
	};
	
	utils.getStatusList = function(){
		//console.log("statusList = " + utils.statusList);
		utils.statusList.splice(0, utils.statusList.length);
		$http.post('php/getStatusList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
				//console.log(key);
				var JSONdata = {"REQUEST_STATUS": value["STATUS_ID"],
								"REQUEST_STATUS_TITLE": value["STATUS_TITLE"],
								"REASON_ID": 0,
								"REASON_TITLE": ""}
				var temp_status = new RequestStatus();
				temp_status.fromJSON(JSONdata);
				utils.statusList.push(temp_status);
			});
			//console.log(utils.statusList);
		});
	};
	
	utils.getDriverList = function(){
		$http.post('php/getDriverList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
				utils.driverFioList.push(value["FIO"]);
				var JSONdata = {"DRVR_ID": value["DRVR_ID"],
								"PHONE": value["PHONE"],
								"FIO": value["FIO"]};
				var temp_driver = new Driver();
                console.log(temp_driver);
				temp_driver.fromJSON(JSONdata);
					utils.driverList.push(temp_driver);
			});
		});
		console.log(utils.driverList);
	};
	
	utils.getTransportItemList = function(){
		$http.post('php/getTransportItemList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
				var temp_transport = new TransportItem();
				temp_transport.fromJSON(value);
				utils.transportItemList.push(temp_transport);
				utils.transportItemTitleList.push(temp_transport.displayLabel);
			});
		});
	};
	
	utils.getRejectReasonList = function(){
		$http.post('php/getRejectReasonList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
				var JSONdata = {
									"REASON_ID": value["REASON_ID"],
									"REASON_TITLE": value["REASON_TITLE"]
								}
				utils.rejectReasonList.push(JSONdata);
			});
		});
	};
	
	utils.getUserList = function(){
		$http.post('php/getUserList.php').success(function(data){
			if(data != null){
				angular.forEach(data, function(value, key){
					var temp_user = new User();
					temp_user.fromJSON(value);
					utils.userList.push(temp_user);
					utils.userFioList.push(temp_user.surname + " " + temp_user.name + " " + temp_user.fname);
				});
			}
		});
	};
	
	
	
	utils.getRouteList = function(){
		$http.post('php/getRouteList.php').success(function(data){	
			angular.forEach(data, function(value, key){	
				var JSONdata = {"POINT_ID": value["POINT_ID"],
							"POINT_TITLE": value["POINT_TITLE"]}
				utils.routeList.push(JSONdata["POINT_TITLE"]);
				//$scope.routeList.labels.push(JSONdata["POINT_TITLE"]);
			});
		});
	};
	
	utils.getTransportSubtypeList = function(){
		$http.post('php/getTransportSubtypeList.php').success(function(data) {
			if(data != "" && data != null){
				angular.forEach(data, function(value, key){
					var temp_subtype = new TransportSubtype();
					temp_subtype.fromJSON(value);
					if(temp_subtype.id != 0)
						utils.transportSubtypeList.push(temp_subtype);
				});
				//console.log(utils.transportSubtypeList);
			}
		});
	};
	
	utils.showLoading = function(){
        utils.isLoading = true;
		$("#loadingIndicator").css("display", "inline-block");
	};
	
	utils.hideLoading = function(){
        utils.isLoading = false;
		$("#loadingIndicator").css("display", "none");
	};
	utils.getCurrentDate();
	return utils;
}]);
*/

/* Controllers */
function ListViewCtrl($scope, $http, $location, GlobalData) {
	$scope.data = GlobalData;
	$scope.requests = [];
	
	
	$scope.packageSize = 15;
	$scope.packagesLoaded = 0;
	
	$scope.typeahead;
	$scope.typeaheadValue = '';
	
	$scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};
	
	$scope.fromAnotherUser = false;

    $scope.data.sections.list = true;
    $scope.data.sections.panorama = false;
    $scope.data.sections.drivers = false;
    $scope.data.sections.items = false;

    $scope.data.inDriverMode = false;
	
	//$("#sorterLink").removeClass("active");
	$("#myRequestsLink").removeClass("active");
	$("#allRequestsLink").addClass("active");
	//$("#addRequestLink").removeClass("disabled");
	//$("#addRequestLink").removeAttr("disabled");
	
	
	$scope.getRequestList = function(){
	//$scope.requests.splice(0, $scope.requests.length);
	//console.log($scope.requests.length);
	//console.log($scope.data.currentUser);
		$("#myRequestsLink").removeClass("active");
		$("#allRequestsLink").addClass("active");
		$scope.data.showLoading();
		var requestParams = {
								"department": $scope.data.currentUser.oblVid,
								"pkgSize": $scope.packageSize,
								"startPos": $scope.packagesLoaded
							};
		
		$http.post('php/getRequestList.php', requestParams).success(function(data) {
			angular.forEach(data, function(value, key){
				var temp_user = new User();
				var temp_request = new Request(value);
				
				temp_request.driver.fromJSON(value);
				temp_request.backupObject.driver.fromAnother(temp_request.driver);
				
				temp_request.transportItem.fromJSON(value);
				temp_request.backupObject.transportItem.fromAnother(temp_request.transportItem);
				
				temp_request.status.fromJSON(value);
				temp_request.backupObject.status.fromAnother(temp_request.status);
				
				temp_user.fromJSON(value);
				temp_request.user = temp_user;
				$scope.requests.push(temp_request);
			});
			$scope.data.hideLoading();
			//console.log($scope.requests);
			//console.log("total requests = " + $scope.requests.length);
        });
	};
	
	
	$scope.getUserInfo = function(){
		if($scope.data.currentUser.id == 0){
			//console.log("current user 0");
			$http.post('php/getUserInfo.php').success(function(data){
				$scope.data.currentUser = new User();
				$scope.data.currentUser.fromJSON(data);
				//console.log($scope.data.currentUser);
				if($scope.data.currentUser.isAdmin == true){
					//console.log("admin");
					$scope.data.getCurrentDate();
					if($scope.data.statusList.length == 0){
						$scope.data.getStatusList();
					}
					if($scope.data.driverList.length == 0)
						$scope.data.getDriverList();
					if($scope.data.transportItemList.length == 0)
					$scope.data.getTransportItemList();
					if($scope.data.rejectReasonList.length == 0)
						$scope.data.getRejectReasonList();
					if($scope.data.userList.length == 0)
						$scope.data.getUserList();
					if($scope.data.transportSubtypeList.length == 0)
						$scope.data.getTransportSubtypeList();
					if($scope.data.routeList.length == 0)
						$scope.data.getRouteList();
				} else {
					//console.log("not admin");
                    if($scope.data.driverList.length == 0)
                        $scope.data.getDriverList();
					if($scope.data.transportSubtypeList.length == 0)
						$scope.data.getTransportSubtypeList();
					if($scope.data.routeList.length == 0)
						$scope.data.getRouteList();
				}
				$scope.getRequestList();
					
			});  
		} else
			$scope.getRequestList();
	};
	$scope.getUserInfo();
  
	
	
	
  $scope.setToViewMode = function(requestId){
      angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			value.restoreBackup();
            value.inEditMode = false;
			value.inAddRouteMode = false;
			value.isChanged = false;
         } 
      });
  }
  
  $scope.setToEditMode = function(requestId){
      angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
             value.inEditMode = true;
			 //console.log(value.backupObject.tempStartDate);
			 //value.backupObject = value;
         } 
      });
  }
  
  $scope.setToChanged = function(requestId){
  
	angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			//console.log("setToChanged called");
			//if(value !== value.backupObject){
				value.isChanged = true;
			//}
         } 
      });
  };
  
  $scope.setToAddRouteMode = function(requestId){
	angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			value.inAddRouteMode = true;
         } 
      });
  }
  
	$scope.sendRejectRequest = function(requestId){
		angular.forEach($scope.requests, function(value, key){
			if(value.id == requestId){
				$http.post('php/sendRejectRequest.php', {"id": requestId}).success(function(data){	
					if(data == "success"){
						value.isRejectRecieved = true;
						//console.log("rejectRequest sent");
					}
				});
			} 
		});
	};
	
	$scope.saveChanges = function(requestId){
	
		var requestParams = {};
		
		
		angular.forEach($scope.requests, function(value, key){
			if(value.id == requestId){
				//var value = value;
				//console.log(value.backupObject.tempStartDate);
				value.backupObject.errors.time.splice(0, value.backupObject.errors.time.length);
				value.backupObject.errors.route.splice(0, value.backupObject.errors.route.length);
				value.backupObject.errors.transportItem.splice(0, value.backupObject.errors.transportItem.length);
				value.backupObject.errors.driver.splice(0, value.backupObject.errors.driver.length);
				
				var startTime = value.backupObject.tempStartTime.split(":");
				//var startTimeUnix = moment(value.backupObject.tempStartDate).hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
				var startTimeUnix = value.backupObject.startTime;
				
				var endTime = value.backupObject.tempEndTime.split(":");
				//var endTimeUnix = moment(value.backupObject.tempEndDate).hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
				var endTimeUnix = value.backupObject.endTime;
				//console.log("startTime = " + moment.unix(startTimeUnix).format("DD.MM.YY HH:mm") + ", endTime = " + moment.unix(endTimeUnix).format("DD.MM.YY HH:mm"));
				if(startTimeUnix > endTimeUnix){
					value.backupObject.errors.time.push("Время прибытия не может быть раньше времени отправления");
				} else if(startTimeUnix == endTimeUnix){
					value.backupObject.errors.time.push("Время прибытия не может равняться времени отправления");
				}
				
				var route = new String();
				if(value.backupObject.route.length != 0 && value.backupObject.route.length > 1){
					angular.forEach(value.backupObject.route, function(routeItem, index){
						route = route + routeItem;
						if(index != value.backupObject.route.length - 1)
							route = route + ";";
					});
				} else if (value.backupObject.route.length == 0) {
					value.backupObject.errors.route.push("Вы не задали маршрут поездки");
				} else if (value.backupObject.route.length == 1){
					value.backupObject.errors.route.push("Маршрут не может состоять из одного элемента");
				}
				
				
				var transportId = -1;
				var temp_transport = new TransportItem();
				angular.forEach($scope.data.transportItemList, function(transport, trkey){
					if(value.backupObject.transportItem.displayLabel == transport.displayLabel){
						transportId = transport.id;
						temp_transport.fromAnother(transport);
						//value.backupObject.transportItem.fromAnother(transport);
						//console.log("item = " + transport.displayLabel + ", " + transport.id);
					}
				});
					
				if(value.backupObject.transportItem.displayLabel != "" && transportId == -1){
					value.backupObject.errors.transportItem.push("Такой транспортной единицы нет в списке");
				}
				
				if(value.backupObject.transportItem.displayLabel == ""){
					transportId = 0;
					temp_transport.id = 0;
					temp_transport.model = "Не назначена";
				}

				
				var driverId = -1;
				var temp_driver = new Driver();
				angular.forEach($scope.data.driverList, function(driver, drkey){
					if(value.backupObject.driver.fio == driver.fio){
						driverId = driver.id;
						temp_driver.fromAnother(driver);
						//console.log("driver = " + driver.fio + ", " + driver.id);
					}
				});
				if(value.backupObject.driver.fio != "" && driverId == -1){
					value.backupObject.errors.driver.push("Такого водителя нет в списке");
				}
				
				requestParams = {
										"requestId": requestId,
										"statusId": value.backupObject.status.id,
										"reasonId": value.backupObject.status.rejectReasonId,
										"startTime": startTimeUnix,
										"endTime": endTimeUnix,
										"route": route,
										"transportItem": transportId,
										"info": value.backupObject.info,
										"driverId": driverId
									};
									
				
				
				//angular.forEach($scope.transportItemList, function(transport, trkey){
				//	if(value.backupObject.transportItem.displayLabel == transport.displayLabel){
				//		value.backupObject.transportItem.fromAnother(transport);
				//		value.transportItem.fromAnother(transport);
				//	}
				//});
				
				
				
				//angular.forEach($scope.driverList, function(driver, drkey){
				//	if(value.backupObject.driver.fio == driver.fio){
				//		value.backupObject.driver.fromAnother(driver);
				//		value.driver.fromAnother(value.backupObject.driver);
				//	}
				//});
				
				
				
				if(value.backupObject.errors.time.length == 0 &&
				   value.backupObject.errors.route.length == 0 &&
				   value.backupObject.errors.transportItem.length == 0 &&
				   value.backupObject.errors.driver.length == 0){
				   $http.post('php/saveChanges.php', JSON.stringify(requestParams)).success(function(data){	
				       if(data == "success"){
							value.status.id = value.backupObject.status.id;
							value.status.rejectReasonId = value.backupObject.status.rejectReasonId;
							angular.forEach($scope.data.rejectReasonList, function(reason, rskey){
								if(value.status.rejectReasonId == reason["REASON_ID"]){
									value.status.rejectReasonTitle = reason["REASON_TITLE"];
									value.backupObject.status.rejectReasonTitle = reason["REASON_TITLE"];
								}
							});
							value.startTime = startTimeUnix;
							value.endTime = endTimeUnix;
							value.backupObject.tempStartDate = moment.unix(startTimeUnix).toDate();
							value.backupObject.tempStartTime = moment.unix(startTimeUnix).format("HH:mm");
							value.backupObject.tempEndDate = moment.unix(endTimeUnix).toDate();
							value.backupObject.tempEndTime = moment.unix(endTimeUnix).format("HH:mm");
							
							value.route.splice(0, value.route.length);
							$(value.backupObject.route).each(function(index, item){
								value.route.push(item);
							});
							
							value.transportItem.fromAnother(temp_transport);
							value.driver.fromAnother(temp_driver);

                           value.driverId = temp_driver.id;
							
							value.info = value.backupObject.info;
							
							value.inEditMode = false;
					   }
			     });
		       } //else {
			   
		      //}
				
				
				
			}
		});
		
		
	};
  
	$scope.addRoute = function(requestId){
		var temp_route = $("#" + requestId + " .autocompleteInput.route").val();
		//console.log(temp_route);
		if($.trim(temp_route) != ""){
			angular.forEach($scope.requests, function(value, key){
				if(value.id == requestId){
					value.backupObject.route.push(temp_route);
					value.isChanged = true;
					value.inAddRouteMode = false;
				} 
			});
			$("#" + requestId + " .autocompleteInput.route").val("")
		}
	};
  
  $scope.deleteRoute = function(requestId, routeId){
	angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			value.backupObject.route.splice(routeId, 1);
			value.isChanged = true;
         } 
      });
  };
  
  $scope.getDay = function(date){
      if(date && typeof date == 'Number')
            return moment.unix(date).dayOfYear();
      if(date && typeof date == 'object')
            return moment(date).dayOfYear();
      if(date){
          //console.log("doy = " + moment.unix(date).dayOfYear());
          return moment.unix(date).dayOfYear();
      }
  }
	
	$scope.loadMore = function(){
		//console.log("loadmoreCalled");
		$scope.data.showLoading();
		if($scope.requests.length != 0){
			//if($scope.myRequestsMode == false){
				$scope.packagesLoaded++;
				$http.post('php/getRequestList.php', {"department": $scope.data.currentUser.oblVid, "pkgSize": $scope.packageSize, "startPos": $scope.packagesLoaded}).success(function(data) {
					angular.forEach(data, function(value, key){
						var temp_user = new User();
						temp_user.fromJSON(value);
						var temp_request = new Request(value);
						
						temp_request.driver.fromJSON(value);
						temp_request.backupObject.driver.fromAnother(temp_request.driver);
						
						temp_request.transportItem.fromJSON(value);
						temp_request.backupObject.transportItem.fromAnother(temp_request.transportItem);
						
						temp_request.status.fromJSON(value);
						temp_request.backupObject.status.fromAnother(temp_request.status);
						
						temp_request.user = temp_user;
						$scope.requests.push(temp_request);
						
					});
					$scope.data.hideLoading();
				});
			
		
		//console.log($scope.packagesLoaded);
		}
	};
  
  
	
}






function MyListViewCtrl($scope, $http, $location, GlobalData) {

	$scope.data = GlobalData;
	$scope.requests = new Array();
	//$scope.statusList = $scope.data.statusList;
	//$scope.rejectReasonList = $scope.data.rejectReasonList;
	//$scope.driverList = $scope.data.driverList;
	//$scope.driverFioList = $scope.data.driverFioList;
	//$scope.transportSubtypeList = $scope.data.transportSubtypeList;
	//$scope.transportItemList = $scope.data.transportItemList;
	//$scope.transportItemTitleList = $scope.data.transportItemTitleList;
	//$scope.routeList = $scope.data.routeList;
	//$scope.userList = $scope.data.userList;
	//$scope.userFioList = $scope.data.userFioList;
	
	//$scope.currentDate = new Date();
	//$scope.currentUser = new User();
	//$scope.requests = new Array();
	//$scope.statusList = new Array();
	//$scope.rejectReasonList = new Array();
	//$scope.driverList = new Array();
	//$scope.driverFioList = new Array();
	//$scope.transportSubtypeList = new Array();
	//$scope.transportItemList = new Array();
	//$scope.transportItemTitleList = new Array();
	//$scope.routeList = new Array();
	//$scope.userList = new Array();
	//$scope.userFioList = new Array();
	
	//$scope.getCurrentDate = $scope.data.getCurrentDate;
	//$scope.data.getRequestList = $scope.getMyRequestList;
	//$scope.data.getUserInfo();
	
	
	$scope.packageSize = 15;
	$scope.packagesLoaded = 0;
	
	$scope.typeahead;
	$scope.typeaheadValue = '';
	
	$scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};
	
	$scope.newRequest = new RequestTemplate();
	$scope.newRequest.startTime = "08:00";
	$scope.newRequest.endTime = "12:00";
	$scope.newRequest.transportTypeId = 1;
	
	$scope.fromAnotherUser = false;
	$scope.myRequestsMode = false;

    $scope.data.sections.list = true;
    $scope.data.sections.panorama = false;
    $scope.data.sections.drivers = false;
    $scope.data.sections.items = false;
	
	$("#sorterLink").removeClass("active");
	$("#myRequestsLink").addClass("active");
	$("#allRequestsLink").removeClass("active");
	$("#addRequestLink").removeClass("disabled");
	
	
	
	
	
	
	
	$("#sorterLink").removeClass("active");
	//$scope.getCurrentDate();
	//$scope.getUserInfo();
	//$scope.getTransportSubtypeList();
	//$scope.getRouteList();
  
 
	$scope.getMyRequestList = function(){
		$scope.data.showLoading();
		$scope.myRequestsMode = true;
		$scope.packagesLoaded = 0;
		$("#myRequestsLink").addClass("active");
		$("#allRequestsLink").removeClass("active");
		
		var requestParams = {
								"userId": $scope.data.currentUser.id,
								"department": $scope.data.currentUser.oblVid,
								"pkgSize": $scope.packageSize,
								"startPos": $scope.packagesLoaded
							};
		$http.post('php/getMyRequestList.php', JSON.stringify(requestParams)).success(function(data){
$scope.requests.splice(0, $scope.requests.length);		
			if(data != "" && data != null){
					$scope.requests.splice(0, $scope.requests.length);
				angular.forEach(data, function(data, index){
					var temp_user = new User();
					temp_user.fromJSON(data);
					var temp_request = new Request(data);
			
					temp_request.driver.fromJSON(data);
					temp_request.backupObject.driver.fromAnother(temp_request.driver);
			
					temp_request.transportItem.fromJSON(data);
					temp_request.backupObject.transportItem.fromAnother(temp_request.transportItem);
			
					temp_request.status.fromJSON(data);
					temp_request.backupObject.status.fromAnother(temp_request.status);
			
					temp_request.user = temp_user;
					$scope.requests.push(temp_request);
				});
			}
			$scope.data.hideLoading();
		});					
	};
	
	
	$scope.getUserInfo = function(){
		$http.post('php/getUserInfo.php').success(function(data){
			$scope.data.currentUser = new User();
			$scope.data.currentUser.fromJSON(data);
			if($scope.data.currentUser.isAdmin == true){
				//console.log("admin");
				$scope.data.getCurrentDate();
				if($scope.data.statusList.length == 0)
					$scope.data.getStatusList();
				if($scope.data.driverList.length == 0)
					$scope.data.getDriverList();
				if($scope.data.transportItemList.length == 0)
				$scope.data.getTransportItemList();
				if($scope.data.rejectReasonList.length == 0)
					$scope.data.getRejectReasonList();
				if($scope.data.userList.length == 0)
					$scope.data.getUserList();
				if($scope.data.transportSubtypeList.length == 0)
					$scope.data.getTransportSubtypeList();
				if($scope.data.routeList.length == 0)
					$scope.data.getRouteList();
				//console.log($scope.data.currentUser);
				//$scope.$apply('getRequestList');
			} else {
				if($scope.data.transportSubtypeList.length == 0)
					$scope.data.getTransportSubtypeList();
				if($scope.data.routeList.length == 0)
					$scope.data.getRouteList();
			}
			$scope.getMyRequestList();
				
		});  
	};
	$scope.getUserInfo();

    /*
    $scope.getUserInfo = function(){
        if($scope.data.currentUser.id == 0){
            //console.log("current user 0");
            $http.post('php/getUserInfo.php').success(function(data){
                $scope.data.currentUser = new User();
                $scope.data.currentUser.fromJSON(data);
                //console.log($scope.data.currentUser);
                if($scope.data.currentUser.isAdmin == true){
                    //console.log("admin");
                    $scope.data.getCurrentDate();
                    if($scope.data.statusList.length == 0){
                        $scope.data.getStatusList();
                    }
                    if($scope.data.driverList.length == 0)
                        $scope.data.getDriverList();
                    if($scope.data.transportItemList.length == 0)
                        $scope.data.getTransportItemList();
                    if($scope.data.rejectReasonList.length == 0)
                        $scope.data.getRejectReasonList();
                    if($scope.data.userList.length == 0)
                        $scope.data.getUserList();
                    if($scope.data.transportSubtypeList.length == 0)
                        $scope.data.getTransportSubtypeList();
                    if($scope.data.routeList.length == 0)
                        $scope.data.getRouteList();
                } else {
                    //console.log("not admin");
                    if($scope.data.driverList.length == 0)
                        $scope.data.getDriverList();
                    if($scope.data.transportSubtypeList.length == 0)
                        $scope.data.getTransportSubtypeList();
                    if($scope.data.routeList.length == 0)
                        $scope.data.getRouteList();
                }
                $scope.getRequestList();

            });
        } else
            $scope.getRequestList();
    };
    $scope.getUserInfo();
	*/
	
  $scope.setToViewMode = function(requestId){
      angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			value.restoreBackup();
            value.inEditMode = false;
			value.inAddRouteMode = false;
			value.isChanged = false;
         } 
      });
  }
  
  
  
  $scope.setToEditMode = function(requestId){
      angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
             value.inEditMode = true;
			 //console.log(value.backupObject.tempStartDate);
			 //value.backupObject = value;
         } 
      });
  }
  
  $scope.setToChanged = function(requestId){
	angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			//console.log("changed");
			//if(value !== value.backupObject){
				value.isChanged = true;
			//}
         } 
      });
  };
  
  $scope.setToAddRouteMode = function(requestId){
	angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			value.inAddRouteMode = true;
         } 
      });
  }
  
	$scope.sendRejectRequest = function(requestId){
		$scope.data.showLoading();
		angular.forEach($scope.requests, function(value, key){
			if(value.id == requestId){
				$http.post('php/sendRejectRequest.php', {"id": requestId}).success(function(data){	
					if(data == "success"){
						value.isRejectRecieved = true;
						//console.log("rejectRequest sent");
					}
					$scope.data.hideLoading();
				});
			} 
		});
	};
	
	$scope.saveChanges = function(requestId){
	
		var requestParams = {};
		
		
		angular.forEach($scope.requests, function(value, key){
			if(value.id == requestId){
				//var value = value;
				//console.log(value.backupObject.tempStartDate);
				value.backupObject.errors.time.splice(0, value.backupObject.errors.time.length);
				value.backupObject.errors.route.splice(0, value.backupObject.errors.route.length);
				value.backupObject.errors.transportItem.splice(0, value.backupObject.errors.transportItem.length);
				value.backupObject.errors.driver.splice(0, value.backupObject.errors.driver.length);
				
				var startTime = value.backupObject.tempStartTime.split(":");
				//var startTimeUnix = moment(value.backupObject.tempStartDate).hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
				var startTimeUnix = value.backupObject.startTime;
				var endTime = value.backupObject.tempEndTime.split(":");
				//var endTimeUnix = moment(value.backupObject.tempEndDate).hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
				var endTimeUnix = value.backupObject.endTime;
				//console.log("startTime = " + moment.unix(startTimeUnix).format("DD.MM.YY HH:mm") + ", endTime = " + moment.unix(endTimeUnix).format("DD.MM.YY HH:mm"));
				if(startTimeUnix > endTimeUnix){
					value.backupObject.errors.time.push("Время прибытия не может быть раньше времени отправления");
				} else if(startTimeUnix == endTimeUnix){
					value.backupObject.errors.time.push("Время прибытия не может равняться времени отправления");
				}
				
				var route = new String();
				if(value.backupObject.route.length != 0 && value.backupObject.route.length > 1){
					angular.forEach(value.backupObject.route, function(routeItem, index){
						route = route + routeItem;
						if(index != value.backupObject.route.length - 1)
							route = route + ";";
					});
				} else if (value.backupObject.route.length == 0) {
					value.backupObject.errors.route.push("Вы не задали маршрут поездки");
				} else if (value.backupObject.route.length == 1){
					value.backupObject.errors.route.push("Маршрут не может состоять из одного элемента");
				}
				
				var transportId = -1;
				var temp_transport = new TransportItem();
				angular.forEach($scope.data.transportItemList, function(transport, trkey){
					if(value.backupObject.transportItem.displayLabel == transport.displayLabel){
						transportId = transport.id;
						temp_transport.fromAnother(transport);
						//value.backupObject.transportItem.fromAnother(transport);
						//console.log("item = " + transport.displayLabel + ", " + transport.id);
					}
				});
					
				if(value.backupObject.transportItem.displayLabel != "" && transportId == -1){
					value.backupObject.errors.transportItem.push("Такой транспортной единицы нет в списке");
				}
				
				if(value.backupObject.transportItem.displayLabel == ""){
					transportId = 0;
					temp_transport.id = 0;
					temp_transport.model = "Не назначена";
				}

				
				var driverId = -1;
				var temp_driver = new Driver();
				angular.forEach($scope.data.driverList, function(driver, drkey){
					if(value.backupObject.driver.fio == driver.fio){
						driverId = driver.id;
						temp_driver.fromAnother(driver);
						//console.log("driver = " + driver.fio + ", " + driver.id);
					}
				});
				if(value.backupObject.driver.fio != "" && driverId == -1){
					value.backupObject.errors.driver.push("Такого водителя нет в списке");
				}
				
				requestParams = {
										"requestId": requestId,
										"statusId": value.backupObject.status.id,
										"reasonId": value.backupObject.status.rejectReasonId,
										"startTime": startTimeUnix,
										"endTime": endTimeUnix,
										"route": route,
										"transportItem": transportId,
										"info": value.backupObject.info,
										"driverId": driverId
									};
										
				
				if(value.backupObject.errors.time.length == 0 &&
				   value.backupObject.errors.route.length == 0 &&
				   value.backupObject.errors.transportItem.length == 0 &&
				   value.backupObject.errors.driver.length == 0){
				   $http.post('php/saveChanges.php', JSON.stringify(requestParams)).success(function(data){	
				       if(data == "success"){
							value.status.id = value.backupObject.status.id;
							value.status.rejectReasonId = value.backupObject.status.rejectReasonId;
							angular.forEach($scope.rejectReasonList, function(reason, rskey){
								if(value.status.rejectReasonId == reason["REASON_ID"]){
									value.status.rejectReasonTitle = reason["REASON_TITLE"];
									value.backupObject.status.rejectReasonTitle = reason["REASON_TITLE"];
								}
							});
							value.startTime = startTimeUnix;
							value.endTime = endTimeUnix;
							value.backupObject.tempStartDate = moment.unix(startTimeUnix).toDate();
							value.backupObject.tempStartTime = moment.unix(startTimeUnix).format("HH:mm");
							value.backupObject.tempEndDate = moment.unix(endTimeUnix).toDate();
							value.backupObject.tempEndTime = moment.unix(endTimeUnix).format("HH:mm");
							
							value.route.splice(0, value.route.length);
							$(value.backupObject.route).each(function(index, item){
								value.route.push(item);
							});
							
							value.transportItem.fromAnother(temp_transport);
							value.driver.fromAnother(temp_driver);
							
							value.info = value.backupObject.info;
							
							value.inEditMode = false;
					   }
			     });
		       } //else {
			   
		      //}
				
				
				
			}
		});
		
		
	};
  
	$scope.addRoute = function(requestId){
		var temp_route = $("#" + requestId + " .autocompleteInput.route").val();
		//console.log(temp_route);
		if($.trim(temp_route) != ""){
			angular.forEach($scope.requests, function(value, key){
				if(value.id == requestId){
					value.backupObject.route.push(temp_route);
					value.isChanged = true;
					value.inAddRouteMode = false;
				} 
			});
			$("#" + requestId + " .autocompleteInput.route").val("")
		}
	};
  
  $scope.deleteRoute = function(requestId, routeId){
	angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
			value.backupObject.route.splice(routeId, 1);
			value.isChanged = true;
         } 
      });
  };
  
  $scope.getDay = function(unixtime){
      return moment.unix(unixtime).dayOfYear();
  }
	
	$scope.loadMore = function(){
		$scope.data.showLoading();
		if($scope.requests.length != 0){
			$scope.packagesLoaded++;
		var requestParams = {
								"userId": $scope.data.currentUser.id,
								"department": $scope.data.currentUser.oblVid,
								"pkgSize": $scope.packageSize,
								"startPos": $scope.packagesLoaded
							};
									
		$http.post('php/getMyRequestList.php', JSON.stringify(requestParams)).success(function(data){	
		if(data != "" && data != null){
						//$scope.requests.splice(0, $scope.requests.length);
			angular.forEach(data, function(request, index){
			var temp_user = new User();
			temp_user.fromJSON(request);
			var temp_request = new Request(request);
					
			temp_request.driver.fromJSON(request);
			temp_request.backupObject.driver.fromAnother(temp_request.driver);
					
			temp_request.transportItem.fromJSON(request);
			temp_request.backupObject.transportItem.fromAnother(temp_request.transportItem);
					
			temp_request.status.fromJSON(request);
			temp_request.backupObject.status.fromAnother(temp_request.status);
					
			temp_request.user = temp_user;
			$scope.requests.push(temp_request);
						});
					}
					$scope.data.hideLoading();
				});	
}				
	};
	
	$scope.showAddRequestForm = function(){
		$("#addRequestLink").addClass("disabled");
		$("#addRequestLayer").animate({"margin-top" : "-10px"}, 500);
		$("#addRequestLayer").css("position", "fixed");
		$("#newRequestEndDate").datepicker('setDate', moment($scope.newRequest.startDate).toDate());
		$("#newRequestEndDate").datepicker('setStartDate', moment($scope.newRequest.startDate).toDate());
	};
	
	$scope.cancelAddRequest = function(){
		$("#addRequestLink").removeClass("disabled");
		var height = ($("#addRequestLayer").height() + 22) * -1;
		$("#addRequestLayer").animate({"margin-top" : height}, 500);
		$scope.newRequest.errors.time.splice(0, $scope.newRequest.errors.time.length);
		$scope.newRequest.errors.route.splice(0, $scope.newRequest.errors.route.length);
		$scope.newRequest.errors.otherUser.splice(0, $scope.newRequest.errors.otherUser.length);
		$("#newRequestRoute").val("");
		$scope.newRequest.info = "";
		$scope.newRequest.starTime = "08:00";
		$scope.newRequest.endTime = "";
		$scope.newRequest.route.splice(0, $scope.newRequest.route.length);
		$scope.fromAnotherUser = false;
		$("#addRequestLayer .otherUser").val("");
	};
	
	$scope.addRouteNewRequest = function(){
		var temp_route = $("#newRequestRoute").val();
		//console.log(temp_route);
		if($.trim(temp_route) != ""){
			$scope.newRequest.route.push(temp_route);
			$("#newRequestRoute").val("")
		}
	};
	
	$scope.deleteRouteNewRequest = function(routeId){
		$scope.newRequest.route.splice(routeId, 1);
	};
	
	
	
	
	
	 $(".timeInput").datetimepicker({
		language: "ru",
        format: "dd.mm.yy hh:ii",
		weekStart: 1,
		forceParse: true,
		todayHighlight: true,
        showMeridian: false,
        autoclose: true,
        todayBtn: false,
        pickerPosition: 'bottom-left',
		minuteStep: 15
		//initialDate: moment($scope.data.currentDate).hours(hours).minutes(minutes).format("DD.MM.YY HH:mm")
      });
  
}


function SorterCtrl($scope, $http, $location, GlobalData) {

    $scope.data = GlobalData;
	$scope.transportItemList = new Array();
	$scope.transportSubTypeList = new Array();
	$scope.transportTypeList = new Array();

    $scope.data.sections.items = true;
    $scope.data.sections.drivers = false;
    $scope.data.sections.list = false;
    $scope.data.sections.panorama = false;

    $scope.data.inDriverMode = false;
    $scope.data.inTransportMode = true;
	
	$scope.getTransportItemList = function(){
		$http.post('php/getTransportItemList_sorter.php').success(function(data) {
			angular.forEach(data, function(value, key){	
				var temp_transport = new TransportItem();
				temp_transport.fromJSON(value);
				$scope.transportItemList.push(temp_transport);
				//$scope.transportItemTitleList.push(temp_transport.displayLabel);
			});
		});
	};
		
	$scope.getTransportSubTypeList = function(){
		$http.post('php/getTransportSubtypeList.php').success(function(data) {
			if(data != "" && data != null){
				angular.forEach(data, function(value, key){
					var temp_subtype = {"id": value['TRANSPORT_SUBTYPE_ID'], "title": value['TRANSPORT_SUBTYPE_TITLE']};
					$scope.transportSubTypeList.push(temp_subtype);
				});
				//console.log($scope.transportSubTypeList);
			}
		});
	};
	
	$scope.getTransportTypeList = function(){
		$http.post('php/getTransportTypeList.php').success(function(data) {
			if(data != "" && data != null){
				angular.forEach(data, function(value, key){
					var temp_type = {"id": value['TRANSPORT_ID'], "title": value['TRANSPORT_TYPE_TITLE']};
					$scope.transportTypeList.push(temp_type);
				});
				//console.log($scope.transportTypeList);
			}
		});
	};
	
	$scope.saveChanges = function(transportId, typeId, subtypeId){
		$("#" + transportId + " select").attr("disabled", "disabled");
		var requestParams = {"id": transportId, "transportType": typeId, "transportSubType": subtypeId};
		$http.post('php/saveChanges_sorter.php', JSON.stringify(requestParams)).success(function(data){	
			if(data == true){
				$("#" + transportId + " select").removeAttr("disabled");
			}
		});
	};
	
	//$("#sorterLink").addClass("active");
	//$("#myRequestsLink").removeClass("active");
	//$("#allRequestsLink").removeClass("active");
	//+$("#addRequestLink").addClass("disabled");
	
	$scope.getTransportTypeList();
	$scope.getTransportSubTypeList();
	$scope.getTransportItemList();
}

function ControlPanelCtrl($scope, $http, GlobalData){
	$scope.data = GlobalData;

    // Показывает панельку добавления заявки
	$scope.showAddRequestForm = function(){
		$("#addRequestLink").addClass("disabled");
		$("#addRequestLayer").animate({"margin-top" : "-10px"}, 500);
		$("#addRequestLayer").css("position", "fixed");
		
		$("#newRequestStartDate").datepicker('setDate', moment($scope.data.newRequest.startDate).toDate());
		$("#newRequestEndDate").datepicker('setDate', moment($scope.data.newRequest.startDate).toDate());
		$("#newRequestEndDate").datepicker('setStartDate', moment($scope.data.newRequest.startDate).toDate());
	};

    // Закрывает панельку добавления заявки и очищает ее поля
	$scope.cancelAddRequest = function(){
		$("#addRequestLink").removeClass("disabled");
		var height = ($("#addRequestLayer").height() + 22) * -1;
		$("#addRequestLayer").animate({"margin-top" : height}, 500);
		$scope.data.newRequest.errors.time.splice(0, $scope.data.newRequest.errors.time.length);
		$scope.data.newRequest.errors.route.splice(0, $scope.data.newRequest.errors.route.length);
		$scope.data.newRequest.errors.otherUser.splice(0, $scope.data.newRequest.errors.otherUser.length);
		$("#newRequestRoute").val("");
		$scope.data.newRequest.info = "";
		$scope.data.newRequest.starTime = "08:00";
		$scope.data.newRequest.endTime = "";
		$scope.data.newRequest.route.splice(0, $scope.data.newRequest.route.length);
		$scope.fromAnotherUser = false;
		$("#addRequestLayer .otherUser").val("");
		$("#addRequestLayer #transportType option[value='1']").attr("selected", "selected");
	};

    // Показывает панельку добавления водителя
    $scope.showAddDriverForm = function(){
        $("#addDriverLink").addClass("disabled");
        $("#addDriverLayer").animate({"margin-top" : "115px"}, 500);
        $("#addDriverLayer").css("position", "fixed");
    };


    // Закрывает панельку добавления водителя и очищает поля
    $scope.cancelAddDriver = function(){
        $("#addDriverLink").removeClass("disabled");
        var height = ($("#addRequestLayer").height() + 22) * -1;
        $("#addDriverLayer").animate({"margin-top" : height}, 500);
        $scope.data.newDriver.errors.splice(0, $scope.data.newDriver.errors.length);
        $("#addDriverLayer #driverFio").val("");
        $("#addDriverLayer #driverPhone").val("");
    };

    // Добавляет нового водителя в БД и локальный список
    $scope.addDriver = function(){
        $scope.data.newDriver.errors.splice(0, $scope.data.newDriver.errors.length);

        if($("#addDriverLayer #driverFio").val() == ""){
            $scope.data.newDriver.errors.push("Вы не ввели фамилию, ими и отчество водителя");
        }

        if($scope.data.newDriver.errors.length == 0){
            var requestParams = {
                "driverFio" : $("#addDriverLayer #driverFio").val(),
                "driverPhone" : $("#addDriverLayer #driverPhone").val()
            };
            $http.post('php/addDriver.php', JSON.stringify(requestParams)).success(function(data){
                console.log(data);
                if(data != "fail"){
                    var temp_driver = new Driver();
                    temp_driver.fromJSON(data);
                    $scope.data.driverList.push(temp_driver);
                    $scope.cancelAddDriver();
                }
            });
        }
    };
	
	$scope.addRouteNewRequest = function(){
		var temp_route = $("#newRequestRoute").val();
		//console.log(temp_route);
		if($.trim(temp_route) != ""){
			$scope.data.newRequest.route.push(temp_route);
			$("#newRequestRoute").val("")
		}
	};
	
	$scope.deleteRouteNewRequest = function(routeId){
		$scope.data.newRequest.route.splice(routeId, 1);
	};
	
	$scope.showLoading = function(){
		
	};
	
	$scope.addRequest = function(){
		//console.log($scope.data.newRequest);
		
		$scope.data.newRequest.errors.time.splice(0, $scope.data.newRequest.errors.time.length);
		$scope.data.newRequest.errors.route.splice(0, $scope.data.newRequest.errors.route.length);
		$scope.data.newRequest.errors.otherUser.splice(0, $scope.data.newRequest.errors.otherUser.length);
		
		var startTime = new String();
		var startTimeUnix;
		var endTime;
		var endTimeUnix;
		
		if($("#addRequestLayer #newRequestStartTime").val() == ""){
		//if($scope.data.newRequest.startTime == null || $scope.data.newRequest.startTime == ""){
			$scope.data.newRequest.errors.time.push("Вы не указали дату и время отправления");
		} else {
			//startTime = $scope.data.newRequest.startTime.split(":");
			//startTime = $("#addRequestLayer #newRequestStartTime").val().split(":");
			//startTimeUnix = moment($("#addRequestLayer #newRequestStartDate").val(), "DD.MM.YY").hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
			startTimeUnix = moment($("#addRequestLayer #newRequestStartTime").val(), "DD.MM.YY HH:mm").unix();
			//startTimeUnix = moment($scope.data.newRequest.startDate).hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
		}
		
		if($("#addRequestLayer #newRequestEndTime").val() == ""){
		//if($scope.data.newRequest.endTime == null || $scope.data.newRequest.endTime == ""){
			$scope.data.newRequest.errors.time.push("Вы не указали дату и время прибытия");
		} else {
			//endTime = $("#addRequestLayer #newRequestEndTime").val().toString().split(":");
			//endTime = $scope.data.newRequest.endTime.split(":");
			//endTimeUnix = moment($("#addRequestLayer #newRequestEndDate").val(), "DD.MM.YY").hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
			endTimeUnix = moment($("#addRequestLayer #newRequestEndTime").val(), "DD.MM.YY HH:mm").unix();
			//endTimeUnix = moment($scope.data.newRequest.endDate).hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
		}
		
		
		

		if(startTimeUnix > endTimeUnix){
			//console.log(">")
			$scope.data.newRequest.errors.time.push("Время прибытия не может быть раньше времени отправления");
		//} else if(startTimeUnix == endTimeUnix && $scope.data.newRequest.startTime != "" && $scope.data.newRequest.startTime != null
		} else if(startTimeUnix == endTimeUnix && $("#addRequestLayer #newRequestStartTime").val() != ""
					&& $("#addRequestLayer #newRequestEndTime").val() != "" ){
			$scope.data.newRequest.errors.time.push("Время прибытия не может равняться времени отправления");
		}
				
		var route = new String();
		if($scope.data.newRequest.route.length != 0 && $scope.data.newRequest.route.length > 1){
			angular.forEach($scope.data.newRequest.route, function(routeItem, index){
				route = route + routeItem;
				if(index != $scope.data.newRequest.route.length - 1)
					route = route + ";";
			});
		} else if ($scope.data.newRequest.route.length == 0) {
			$scope.data.newRequest.errors.route.push("Вы не задали маршрут поездки");
		} else if ($scope.data.newRequest.route.length == 1){
			$scope.data.newRequest.errors.route.push("Маршрут не может состоять из одного элемента");
		}
		
		var userId = -1;
		var userDepartment = 0;
		if($scope.fromAnotherUser == true){
			if($(".otherUser").val() == ""){
				$scope.data.newRequest.errors.otherUser.push("Вы не указали пользователя, от чьего имени подается заявка");
			} else {
				angular.forEach($scope.data.userList, function(value, key){
					if($(".otherUser").val() == value.surname + " " + value.name + " " + value.fname){
						userId = value.id;
						userDepartment = value.oblVid;
						//console.log(value);
					}
				});
				if(userId == -1){
					$scope.data.newRequest.errors.otherUser.push("Такого пользователя нет в списке");
				}
			}
			
		}
		
		var globalTypeId = 0;
				var temp_subtype = new TransportSubtype();
				//console.log($("#transportType option:selected").val());
				angular.forEach($scope.data.transportSubtypeList, function(subtype, trkey){
					if($scope.data.newRequest.transportSubTypeId == subtype.id){
					
						globalTypeId = subtype.globalTypeId;
						//console.log("global type = " + globalTypeId);
						//temp_transport.fromAnother(transport);
						//value.backupObject.transportItem.fromAnother(transport);
						//console.log("item = " + transport.displayLabel + ", " + transport.id);
					}
				});
		
		var requestParams = {};
		
		if($scope.fromAnotherUser == true){
			requestParams = {
								"userId": userId,
								"transportGlobalTypeId": globalTypeId,
								"transportSubtypeId": $scope.data.newRequest.transportSubTypeId,
								"startDate": moment.unix(startTimeUnix).format("DD.MM.YY"),
								"startTime": startTimeUnix,
								"endDate": moment.unix(endTimeUnix).format("DD.MM.YY"),
								"endTime": endTimeUnix,
								"route": route,
								"passCount": 0,
								"info": $scope.data.newRequest.info,
								"department": userDepartment
							};
			
		} else {
			requestParams = {
								"userId": $scope.data.currentUser.id,
								"transportGlobalTypeId": globalTypeId,
								"transportSubtypeId": $scope.data.newRequest.transportSubTypeId,
								"startDate": moment.unix(startTimeUnix).format("DD.MM.YY"),
								"startTime": startTimeUnix,
								"endDate": moment.unix(endTimeUnix).format("DD.MM.YY"),
								"endTime": endTimeUnix,
								"route": route,
								"passCount": 0,
								"info": $scope.data.newRequest.info,
								"department": $scope.data.currentUser.oblVid
							};
		}
					
		
											
		if($scope.data.newRequest.errors.time.length == 0 && $scope.data.newRequest.errors.route.length == 0 && $scope.data.newRequest.errors.otherUser.length == 0){
				   $http.post('php/addRequest.php', JSON.stringify(requestParams)).success(function(data){	
				       if(data == "success"){
							//console.log("success");
							$scope.cancelAddRequest();
							//$scope.requests.splice(0, $scope.requests.length);
							//$scope.packagesLoaded = 0;
							//$scope.getMyRequestList();/	
							//$scope.data.getRequestList();
							window.location.reload();
							
					   }
			     });
		};
	}	
	
	
	
	var minutes = moment($scope.data.currentDate).minutes();
	var hours = moment($scope.data.currentDate).hours();
	if(minutes != 0 && minutes <= 15)
		minutes = 15;
	else if(minutes > 15 && minutes <= 30)
		minutes = 30;
	else if(minutes > 30 && minutes <= 45)
		minutes = 45;
	else if(minutes > 45 && minutes <= 60){
		minutes = 0;
		hours++;
		}
		
	//console.log("minutes = " + minutes);
	
	$("#newRequestStartTime").attr("value", moment($scope.data.currentDate).hours(hours).minutes(minutes).format("DD.MM.YY HH:mm"));
	
	 $("#newRequestStartTime").datetimepicker({
		language: "ru",
        format: "dd.mm.yy hh:ii",
		weekStart: 1,
		forceParse: true,
		todayHighlight: true,
        showMeridian: false,
        autoclose: true,
        todayBtn: false,
        pickerPosition: 'bottom-left',
		minuteStep: 15,
		initialDate: moment($scope.data.currentDate).hours(hours).minutes(minutes).format("DD.MM.YY HH:mm")
      });
		

	  
	 
	  $("#newRequestStartTime").datetimepicker('setStartDate', $scope.data.currentDate);
	  
	 
	  
	  $("#newRequestStartTime").bind("change", function(){
		$("#newRequestEndTime").val( moment($("#newRequestStartTime").val(), "DD.MM.YY HH:mm").format("DD.MM.YY HH:mm"));
		$("#newRequestEndTime").datetimepicker('setStartDate', moment($(this).val(), "DD.MM.YY HH:mm").format("DD.MM.YY HH:mm"));
	  });
	  
	  
	var endTimeInit = new moment($scope.data.currentTime);
	endTimeInit.hours(hours + 1);
	endTimeInit.minutes(minutes);
	$("#newRequestEndTime").datetimepicker({
		language: "ru",
        format: "dd.mm.yy hh:ii",
		weekStart: 1,
		forceParse: true,
		todayHighlight: true,
        showMeridian: false,
        autoclose: true,
        todayBtn: false,
        pickerPosition: 'bottom-left',
		minuteStep: 15,
		initialDate: moment(endTimeInit).format("DD.MM.YY HH:mm")
    });
	$("#newRequestEndTime").attr("value", endTimeInit.format("DD.MM.YY HH:mm"));
	
	//$("#newRequestStartTime").timepicker();
	
	//$("#newRequestStartTime").bind("click", function(){
	//	$('#newRequestStartTime').datetimepicker('show');
	//});
};


function HelpCtrl($scope, $http, GlobalData){
	$scope.data = GlobalData;

    $scope.data.inDriverMode = false;
    $scope.data.inTransportMode = false;
	
	$scope.cancelAddRequest = function(){
		//$("#addRequestLink").removeClass("disabled");
		var height = ($("#addRequestLayer").height() + 22) * -1;
		$("#addRequestLayer").animate({"margin-top" : height}, 500);
		$scope.data.newRequest.errors.time.splice(0, $scope.data.newRequest.errors.time.length);
		$scope.data.newRequest.errors.route.splice(0, $scope.data.newRequest.errors.route.length);
		$scope.data.newRequest.errors.otherUser.splice(0, $scope.data.newRequest.errors.otherUser.length);
		$("#newRequestRoute").val("");
		$scope.data.newRequest.info = "";
		$scope.data.newRequest.starTime = "08:00";
		$scope.data.newRequest.endTime = "";
		$scope.data.newRequest.route.splice(0, $scope.data.newRequest.route.length);
		$scope.fromAnotherUser = false;
		$("#addRequestLayer .otherUser").val("");
		$("#addRequestLayer #transportType option[value='1']").attr("selected", "selected");
	};
	
	$scope.cancelAddRequest();
	
	$scope.getUserInfo = function(){
		if($scope.data.currentUser.id == 0){
			//console.log("current user 0");
			$http.post('php/getUserInfo.php').success(function(data){
				$scope.data.currentUser = new User();
				$scope.data.currentUser.fromJSON(data);
				//console.log($scope.data.currentUser);
				
					
			});  
		}
	};
	
	$scope.getUserInfo();
	
	$("#addRequestLink").attr("disabled", true);
	$("#myRequestsLink").removeClass("active");
	$("#allRequestsLink").removeClass("active");
	$("#listViewLink").removeClass("active");
	$("#panoramaViewLink").removeClass("active");
};


function PanoramaViewCtrl($scope, $http, GlobalData){
    $scope.data = GlobalData;
    $scope.selected = -1;
    $scope.startDate = "22.08.13";
    $scope.endDate = "22.08.13";
    $scope.atomWidth = 9;
    $scope.weekStart = 0;
    $scope.header = [
                        "00", "01", "02", "03", "04", "05", "06",
                        "07", "08", "09", "10", "11", "12", "13",
                        "14", "15", "16", "17", "18", "19", "20",
                        "21", "22", "23"
                    ];

    $scope.activeTransportItems = [];
    $scope.activeRequests = [];
    $scope.requests = [];
    $scope.unsortedRequestsCount = 0;
    $scope.currentRequest = new Request();
    $scope.inAddRouteMode = false;
    $scope.newRoute = "";

    $scope.data.sections.drivers = false;
    $scope.data.sections.list = false;
    $scope.data.sections.panorama = true;
    $scope.data.sections.items = false;

    $("#addRequestLink").css("display", "block");
    $("#driversLink").css("display", "inline-block");
    $("#addDriverLink").css("display", "none");

    $scope.data.inDriverMode = false;

    $scope.$watch('currentRequest', function(newValue, oldValue){
        console.log("NR changed");
        //$scope.currentRequest = newValue;
        //$scope.$digest();
    });


    $scope.getActiveTransportItems = function(){
        $scope.activeTransportItems.splice(0, $scope.activeTransportItems.length);
        angular.forEach($scope.activeRequests, function(activeTransport, key){
            var isInList = false;
            var temp_transport = new TransportItem();
            temp_transport.fromAnother(activeTransport);

            angular.forEach($scope.activeTransportItems, function(value, key){
                if(value.id == temp_transport.id)
                    isInList = true;
            });

            if(isInList != true){
                if(temp_transport.id == 0){
                    $scope.activeTransportItems.unshift(temp_transport);
                } else
                    $scope.activeTransportItems.push(temp_transport);
            }
        });
    };

    // Загружает заявки за указанный период времени по департаменту
    $scope.getRequests = function(params){
        //$scope.requests.splice(0, $scope.requests.length);
        //console.log($scope.requests.length);
        //console.log($scope.data.currentUser);
        $("#myRequestsLink").removeClass("active");
        $("#allRequestsLink").addClass("active");
        $scope.data.showLoading();
        var requestParams = {
            "department": $scope.data.currentUser.oblVid,
            "start": moment($scope.data.weekStart).format("DD.MM.YY"),
            "end": moment($scope.data.weekEnd).format("DD.MM.YY")
        };
        console.log(params);


        $scope.requests.splice(0, $scope.requests.length);
        $scope.activeRequests.splice(0, $scope.activeRequests.length);
        $scope.activeTransportItems.splice(0, $scope.activeTransportItems.length);

        $http.post('php/getRequests.php', params).success(function(data){
            angular.forEach(data, function(value, key){
                var temp_user = new User();
                var temp_request = new Request(value);

                temp_request.driver.fromJSON(value);
                temp_request.backupObject.driver.fromAnother(temp_request.driver);

                temp_request.transportItem.fromJSON(value);
                temp_request.backupObject.transportItem.fromAnother(temp_request.transportItem);

                temp_request.status.fromJSON(value);
                temp_request.backupObject.status.fromAnother(temp_request.status);

                temp_user.fromJSON(value);
                temp_request.user = temp_user;
                $scope.requests.push(temp_request);
            });


            angular.forEach($scope.requests, function(value, key){
                var temp_transport = new TransportItem();
                var isInList = false;
                //console.log("day = " + moment(value.startDate).format("DD.MM.YYYY"));
                //console.log(moment($scope.data.currentMoment).format("DD.MM.YYYY"));

                var startOfTheDay = moment($scope.data.currentMoment).hours(0).minutes(0);
                var endOfTheDay = moment($scope.data.currentMoment).hours(23).minutes(59);
                moment(endOfTheDay).hours(23);
                //console.log("startoftheday = " + moment(startOfTheDay).format("DD.MM.YYYY HH:mm"));
                //console.log("endoftheday = " + moment(endOfTheDay).format("DD.MM.YYYY HH:mm"));

                // Начинается ранее, чем сегодня, заканчивается в течение дня
                if(moment(value.start).unix() < moment(startOfTheDay).unix() &&
                    moment(value.end).unix() >= moment(startOfTheDay).unix() &&
                    moment(value.end).unix() <= moment(endOfTheDay).unix()){
                    $scope.activeRequests.push(value);
                    //console.log("added 1," + value.id);
                    temp_transport.fromAnother(value.transportItem);
                }

                // Начинается в течении дня, заканчивается в течение дня
                if(moment(value.start).unix() >= moment(startOfTheDay).unix() &&
                    moment(value.end).unix() <= moment(endOfTheDay).unix()){
                    $scope.activeRequests.push(value);
                    //console.log("added 2, " + value.id);
                    temp_transport.fromAnother(value.transportItem);
                }

                // Начинается сегодня, заканчивается позднее, чем сегодня
                if(moment(value.start).unix() >= moment(startOfTheDay).unix() &&
                    moment(value.start).unix() < moment(endOfTheDay).unix() &&
                    moment(value.end).unix() > moment(endOfTheDay).unix()){
                    $scope.activeRequests.push(value);
                    //console.log("added 3, " + value.id);
                    temp_transport.fromAnother(value.transportItem);
                }


                // Начинается ранее, чем сегодня, заканчивается позднее, чем сегодня
                if(moment(value.start).unix() < moment(startOfTheDay).unix() &&
                    moment(value.end).unix() > moment(endOfTheDay).unix()){
                    $scope.activeRequests.push(value);
                    //console.log("added 3, " + value.id);
                    temp_transport.fromAnother(value.transportItem);
                }

                //var isInList = false;
                if(temp_transport.id != ""){
                    angular.forEach($scope.activeTransportItems, function(value, key){
                        if(value.id == temp_transport.id && temp_transport.id != "")
                            isInList = true;
                    });

                    if(isInList != true){

                        if(temp_transport.id == 0){
                            var undef = false;
                            angular.forEach($scope.activeTransportItems, function(value, key){
                                if(value.id == 0){
                                    undef = true;
                                    $scope.unsortedRequestsCount++;
                                }
                            });
                            if(undef == false)
                                $scope.activeTransportItems.unshift(temp_transport);

                        } else
                            $scope.activeTransportItems.push(temp_transport);

                    }
                }
            });


            $scope.data.hideLoading();
        });
    };


    //* Получение информации о пользователе *//
    $scope.getUserInfo = function(){
        if($scope.data.currentUser.id == 0){
            console.log("current user 0");
            $http.post('php/getUserInfo.php').success(function(data){
                $scope.data.currentUser.fromJSON(data);
                //$scope.data.getCurrentDate();
                    //console.log($scope.data.currentUser);
                    if($scope.data.currentUser.isAdmin == true){
                        //console.log("admin");

                        if($scope.data.statusList.length == 0){
                            $scope.data.getStatusList();
                        }
                        if($scope.data.driverList.length == 0)
                            $scope.data.getDriverList();
                            console.log($scope.data.driverList);
                        if($scope.data.transportItemList.length == 0)
                            $scope.data.getTransportItemList();
                        if($scope.data.rejectReasonList.length == 0)
                            $scope.data.getRejectReasonList();
                        if($scope.data.userList.length == 0)
                            $scope.data.getUserList();
                        if($scope.data.transportSubtypeList.length == 0)
                            $scope.data.getTransportSubtypeList();
                        if($scope.data.routeList.length == 0)
                            $scope.data.getRouteList();
                    } else {
                        //console.log("not admin");
                        if($scope.data.transportSubtypeList.length == 0)
                            $scope.data.getTransportSubtypeList();
                        if($scope.data.routeList.length == 0)
                            $scope.data.getRouteList();
                    }

                    var requestParams = {
                        "department": $scope.data.currentUser.oblVid,
                        "start": moment($scope.data.weekDays[0]).format("DD.MM.YY"),
                        "end": moment($scope.data.weekDays[6]).format("DD.MM.YY")
                    };

                    $scope.getRequests(requestParams);
                    //$scope.setActiveTransport(95);
                    $(".transportTab:first").addClass("active");

            });
        } else {
                console.log($scope.data.currentUser);
            var requestParams = {
                "department": $scope.data.currentUser.oblVid,
                "start": moment($scope.data.weekStart).format("DD.MM.YY"),
                "end": moment($scope.data.weekEnd).format("DD.MM.YY")
            };
                $scope.getRequests(requestParams);
        }
        };
        $scope.getUserInfo();




    /* Выбор транспортной единицы и соответсвующих ей заявок */
    $scope.setActiveTransport = function(id){
        $scope.selected = id; // изменение идентификатора текущей транспортной единицы
        console.log($scope.activeTransportItems);
        $(".transportTab").each(function(index, value){
            $(value).removeClass("active");
        });
        $("#transport" + id).addClass("active");
        //$scope.$apply();
    };


    //** Выбор дня, выборка заявок в соответсвтии с ним **//
    $scope.setDay = function(day){
        //console.log("setday = " + moment(day).format("DD.MM.YYYY"));
        $scope.selected = -1;
        console.log("selected = " + $scope.selected);
        $scope.data.currentMoment = day;
        //console.log("currentMoment = " + moment($scope.data.currentMoment).format("DD.MM.YYYY"));
        //$scope.getRequests();
        $scope.activeRequests.splice(0, $scope.activeRequests.length);
        $scope.activeTransportItems.splice(0, $scope.activeTransportItems.length);
        $scope.unsortedRequestsCount = 0;

        angular.forEach($scope.requests, function(value, key){
            var temp_transport = new TransportItem();
            var isInList = false;
            //console.log("day = " + moment(value.startDate).format("DD.MM.YYYY"));
            //console.log(moment($scope.data.currentMoment).format("DD.MM.YYYY"));

            var startOfTheDay = moment($scope.data.currentMoment).hours(0).minutes(0);
            var endOfTheDay = moment($scope.data.currentMoment).hours(23).minutes(59);
            moment(endOfTheDay).hours(23);
            //console.log("startoftheday = " + moment(startOfTheDay).format("DD.MM.YYYY HH:mm"));
            //console.log("endoftheday = " + moment(endOfTheDay).format("DD.MM.YYYY HH:mm"));

            // Начинается ранее, чем сегодня, заканчивается в течение дня
            if(moment(value.start).unix() < moment(startOfTheDay).unix() &&
               moment(value.end).unix() >= moment(startOfTheDay).unix() &&
               moment(value.end).unix() <= moment(endOfTheDay).unix()){
                $scope.activeRequests.push(value);
                //console.log("added 1," + value.id);
                temp_transport.fromAnother(value.transportItem);
            }

            // Начинается в течении дня, заканчивается в течение дня
            if(moment(value.start).unix() >= moment(startOfTheDay).unix() &&
                moment(value.end).unix() <= moment(endOfTheDay).unix()){
                $scope.activeRequests.push(value);
                //console.log("added 2, " + value.id);
                temp_transport.fromAnother(value.transportItem);
            }

            // Начинается сегодня, заканчивается позднее, чем сегодня
            if(moment(value.start).unix() >= moment(startOfTheDay).unix() &&
                moment(value.start).unix() < moment(endOfTheDay).unix() &&
                moment(value.end).unix() > moment(endOfTheDay).unix()){
                $scope.activeRequests.push(value);
                //console.log("added 3, " + value.id);
                temp_transport.fromAnother(value.transportItem);
            }


            // Начинается ранее, чем сегодня, заканчивается позднее, чем сегодня
            if(moment(value.start).unix() < moment(startOfTheDay).unix() &&
                moment(value.end).unix() > moment(endOfTheDay).unix()){
                $scope.activeRequests.push(value);
                //console.log("added 3, " + value.id);
                temp_transport.fromAnother(value.transportItem);
            }

            //var isInList = false;
            if(temp_transport.id != ""){
                angular.forEach($scope.activeTransportItems, function(value, key){
                    if(value.id == temp_transport.id && temp_transport.id != "")
                        isInList = true;
                });

                if(isInList != true){

                    if(temp_transport.id == 0){
                        var undef = false;
                        angular.forEach($scope.activeTransportItems, function(value, key){
                            if(value.id == 0){
                                undef = true;
                                $scope.unsortedRequestsCount++;
                            }
                        });
                        if(undef == false)
                            $scope.activeTransportItems.unshift(temp_transport);

                    } else
                        $scope.activeTransportItems.push(temp_transport);

                }
            }
        });
        console.log($scope.activeRequests);
        console.log($scope.activeTransportItems);
        console.log("count = " + $scope.unsortedRequestsCount);
    };

    // Перемещает
    $scope.nextWeek = function(){
        var tempDate = moment($scope.data.currentMoment);
        console.log("day = " + tempDate.day());
        tempDate.add("weeks", 1);
        console.log("newWeek = " + tempDate.format("DD.MM.YYYY"));
        $scope.data.currentMoment = tempDate.toDate();

        if(tempDate.day() == 1){
            $scope.data.weekStart = tempDate.toDate();
            //console.log("weekStart = " + moment(utils.weekStart).toDate());
        } else {
            while(tempDate.day() != 1){
                tempDate.add("days", -1);
            }
        }
            console.log("tempDate = " + tempDate.toDate());
            $scope.data.weekStart = tempDate;
            $scope.data.weekDays.splice(0, $scope.data.weekDays.length);
            //while(tempDate.day() > 0){
            //    var day = new moment(tempDate);
           //     $scope.data.weekDays.push(day);
           //     tempDate.add("days", 1);
           // }
        for(var i=0; i<=6; i++){
            var day = new moment(tempDate);
            $scope.data.weekDays.push(day);
            tempDate.add("days", 1);
        }

        var requestParams = {
            "department": $scope.data.currentUser.oblVid,
            "start": moment($scope.data.weekDays[0]).format("DD.MM.YY"),
            "end": moment($scope.data.weekDays[6]).format("DD.MM.YY")
        };
        $scope.getRequests(requestParams);

        console.log("week start = " + moment($scope.data.weekStart).toDate());
        console.log($scope.data.weekDays);
    };

    $scope.prevWeek = function(){
        var tempDate = moment($scope.data.currentMoment);
        console.log("day = " + tempDate.day());
        tempDate.add("weeks", -1);
        console.log("newWeek = " + tempDate.format("DD.MM.YYYY"));
        $scope.data.currentMoment = moment(tempDate).toDate();

        if(tempDate.day() == 1){
            $scope.data.weekStart = tempDate.toDate();
            //console.log("weekStart = " + moment(utils.weekStart).toDate());
        } else {
            while(tempDate.day() != 1){
                tempDate.add("days", -1);
            }
        }

        console.log("tempDate = " + tempDate.toDate());
        $scope.data.weekStart = tempDate.toDate();
        $scope.data.weekDays.splice(0, $scope.data.weekDays.length);
        //while(tempDate.day() > 0){
        //    var day = new moment(tempDate);
        //     $scope.data.weekDays.push(day);
        //     tempDate.add("days", 1);
        // }
        for(var i=0; i<=6; i++){
            var day = new moment(tempDate);
            $scope.data.weekDays.push(day);
            tempDate.add("days", 1);
        }


        var requestParams = {
            "department": $scope.data.currentUser.oblVid,
            "start": moment($scope.data.weekDays[0]).format("DD.MM.YY"),
            "end": moment($scope.data.weekDays[6]).format("DD.MM.YY")
        };
        $scope.getRequests(requestParams);

        console.log("week start = " + moment($scope.data.weekStart).toDate());
        console.log($scope.data.weekDays);
    };

    // Убирает панель редактирования заявки
    $scope.hideEditDialog = function(){
        var dialog = $("#editDialog");
        if(dialog.css("left") == "0px")
            dialog.animate({"left": "-270px"}, 300);
        $scope.currentRequest.isChanged = false;
        $scope.setToViewMode($scope.currentRequest.id);
    };

    // Показывает панельку редактирования заявки
    $scope.showEditDialog = function(){
        var dialog = $("#editDialog");
        if(dialog.css("left") == "-270px"){
            dialog.animate({"left": "0px"}, 300);
        }
    };

    // Помечает заявку requestId как измененную
    $scope.setToChanged = function(requestId){
        $scope.currentRequest.isChanged = true;
    };

    // Переводит заявку в режим редактирования при просмотре нераспределенных заявок
    $scope.editRequest = function(id){
        angular.forEach($scope.requests, function(value, key){
            if(value.id == id){
                $scope.currentRequest = value;
                $scope.setToEditMode(value.id);
            }
        });
        $scope.showEditDialog();
    };

    $scope.getRequestsCount = function(){
        var count = 0;
        angular.forEach($scope.activeRequests, function(request, key){
            count++;
        });
        return count;
    };

    $scope.getDay = function(date){
        if(date && typeof date == 'Number')
            return moment.unix(date).dayOfYear();
        if(date && typeof date == 'object')
            return moment(date).dayOfYear();
    };

    $scope.setToViewMode = function(requestId){
        angular.forEach($scope.requests, function(value, key){
            if(value.id == requestId){
                value.restoreBackup();
                value.inEditMode = false;
                value.inAddRouteMode = false;
                value.isChanged = false;
            }
        });
    };

    $scope.setToEditMode = function(requestId){
        angular.forEach($scope.requests, function(value, key){
            if(value.id == requestId){
                value.inEditMode = true;
                //console.log(value.backupObject.tempStartDate);
                //value.backupObject = value;
            }
        });
    };

    //$scope.calculateHeader();
    //$scope.setDay($scope.data.currentMoment);

    /* Удаляет элемент маршрута */
    $scope.deleteRoute = function(routeId){
        $scope.currentRequest.backupObject.route.splice(routeId, 1);
        $scope.currentRequest.isChanged = true;
    };

    $scope.setToAddRouteMode = function(){
        $scope.inAddRouteMode = true;
    };

    $scope.cancelAddRouteMode = function(){
        $scope.inAddRouteMode = false;
    };

    $scope.addRoute = function(){
        if($.trim($scope.newRoute) != ""){
            $scope.currentRequest.backupObject.route.push($scope.newRoute);
            $scope.currentRequest.isChanged = true;
            $scope.inAddRouteMode = false;
            $scope.newRoute = "";
        }
    };


    $scope.saveChanges = function(requestId){

        var requestParams = {};



                //var value = value;
                //console.log(value.backupObject.tempStartDate);
                $scope.currentRequest.backupObject.errors.time.splice(0, $scope.currentRequest.backupObject.errors.time.length);
                $scope.currentRequest.backupObject.errors.route.splice(0, $scope.currentRequest.backupObject.errors.route.length);
                $scope.currentRequest.backupObject.errors.transportItem.splice(0, $scope.currentRequest.backupObject.errors.transportItem.length);
                $scope.currentRequest.backupObject.errors.driver.splice(0, $scope.currentRequest.backupObject.errors.driver.length);

                var startTime = $scope.currentRequest.backupObject.tempStartTime.split(":");
                //var startTimeUnix = moment(value.backupObject.tempStartDate).hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
                var startTimeUnix = $scope.currentRequest.backupObject.startTime;
                var endTime = $scope.currentRequest.backupObject.tempEndTime.split(":");
                //var endTimeUnix = moment(value.backupObject.tempEndDate).hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
                var endTimeUnix = $scope.currentRequest.backupObject.endTime;
                //console.log("startTime = " + moment.unix(startTimeUnix).format("DD.MM.YY HH:mm") + ", endTime = " + moment.unix(endTimeUnix).format("DD.MM.YY HH:mm"));
                if(startTimeUnix > endTimeUnix){
                    $scope.currentRequest.backupObject.errors.time.push("Время прибытия не может быть раньше времени отправления");
                } else if(startTimeUnix == endTimeUnix){
                    $scope.currentRequest.backupObject.errors.time.push("Время прибытия не может равняться времени отправления");
                }

                var route = new String();
                if($scope.currentRequest.backupObject.route.length != 0 && $scope.currentRequest.backupObject.route.length > 1){
                    angular.forEach($scope.currentRequest.backupObject.route, function(routeItem, index){
                        route = route + routeItem;
                        if(index != $scope.currentRequest.backupObject.route.length - 1)
                            route = route + ";";
                    });
                } else if ($scope.currentRequest.backupObject.route.length == 0) {
                    $scope.currentRequest.backupObject.errors.route.push("Вы не задали маршрут поездки");
                } else if ($scope.currentRequest.backupObject.route.length == 1){
                    $scope.currentRequest.backupObject.errors.route.push("Маршрут не может состоять из одного элемента");
                }

                var transportId = -1;
                var temp_transport = new TransportItem();
                angular.forEach($scope.data.transportItemList, function(transport, trkey){
                    if($scope.currentRequest.backupObject.transportItem.displayLabel == transport.displayLabel){
                        transportId = transport.id;
                        temp_transport.fromAnother(transport);
                        //value.backupObject.transportItem.fromAnother(transport);
                        //console.log("item = " + transport.displayLabel + ", " + transport.id);
                    }
                });

                if($scope.currentRequest.backupObject.transportItem.displayLabel != "" && transportId == -1){
                    $scope.currentRequest.backupObject.errors.transportItem.push("Такой транспортной единицы нет в списке");
                }

                if($scope.currentRequest.backupObject.transportItem.displayLabel == ""){
                    transportId = 0;
                    temp_transport.id = 0;
                    temp_transport.model = "Не назначена";
                }


                var driverId = -1;
                var temp_driver = new Driver();
                angular.forEach($scope.data.driverList, function(driver, drkey){
                    if($scope.currentRequest.backupObject.driver.fio == driver.fio){
                        driverId = driver.id;
                        temp_driver.fromAnother(driver);
                        //console.log("driver = " + driver.fio + ", " + driver.id);
                    }
                });
                if($scope.currentRequest.backupObject.driver.fio != "" && driverId == -1){
                    $scope.currentRequest.backupObject.errors.driver.push("Такого водителя нет в списке");
                }

                requestParams = {
                    "requestId": $scope.currentRequest.id,
                    "statusId": $scope.currentRequest.backupObject.status.id,
                    "reasonId": $scope.currentRequest.backupObject.status.rejectReasonId,
                    "startTime": startTimeUnix,
                    "endTime": endTimeUnix,
                    "route": route,
                    "transportItem": transportId,
                    "info": $scope.currentRequest.backupObject.info,
                    "driverId": driverId
                };


                if(value.backupObject.errors.time.length == 0 &&
                    value.backupObject.errors.route.length == 0 &&
                    value.backupObject.errors.transportItem.length == 0 &&
                    value.backupObject.errors.driver.length == 0){
                    $http.post('php/saveChanges.php', JSON.stringify(requestParams)).success(function(data){
                        if(data == "success"){
                            value.status.id = value.backupObject.status.id;
                            value.status.rejectReasonId = value.backupObject.status.rejectReasonId;
                            angular.forEach($scope.rejectReasonList, function(reason, rskey){
                                if(value.status.rejectReasonId == reason["REASON_ID"]){
                                    value.status.rejectReasonTitle = reason["REASON_TITLE"];
                                    value.backupObject.status.rejectReasonTitle = reason["REASON_TITLE"];
                                }
                            });
                            value.startTime = startTimeUnix;
                            value.endTime = endTimeUnix;
                            value.backupObject.tempStartDate = moment.unix(startTimeUnix).toDate();
                            value.backupObject.tempStartTime = moment.unix(startTimeUnix).format("HH:mm");
                            value.backupObject.tempEndDate = moment.unix(endTimeUnix).toDate();
                            value.backupObject.tempEndTime = moment.unix(endTimeUnix).format("HH:mm");

                            value.route.splice(0, value.route.length);
                            $(value.backupObject.route).each(function(index, item){
                                value.route.push(item);
                            });

                            value.transportItem.fromAnother(temp_transport);
                            value.driver.fromAnother(temp_driver);

                            value.info = value.backupObject.info;

                            value.inEditMode = false;
                        }
                    });
                }






    };


};


/**  DRIVERS **/
function DriversCtrl($scope, $http, GlobalData, $location){
    $scope.data = GlobalData;
    $scope.drivers = new Collection();
    $scope.currentDriver = new Driver();

    $scope.dailyReportDate = $scope.data.currentDate;

    $scope.search = "";
    $scope.sort = "+fio";

    $scope.data.inDriverMode = true;
    $scope.data.inTransportMode = false;

    $scope.drivers.items = $scope.data.driverList;

    // Получает информацию о пользователе
    $scope.getUserInfo = function(){
        if($scope.data.currentUser.id == 0){
            //console.log("current user 0");
            $http.post('php/getUserInfo.php').success(function(data){
                $scope.data.currentUser.fromJSON(data);
                if($scope.data.currentUser.isAdmin == true){
                    if($scope.data.driverList.length == 0)
                        $scope.data.getDriverList();
                }
            });
        }
    };
    $scope.getUserInfo();

    // Загружает список водителей из БД и формирует локальный список
    $scope.getDriversList = function(){
        $http.post('php/getDriverList.php').success(function(data){
            angular.forEach(data, function(value, key){
                var temp_driver = new Driver();
                temp_driver.fromJSON(value);
                $scope.driversList.push(temp_driver);
                //$scope.transportItemTitleList.push(temp_transport.displayLabel);
            });
            //console.log($scope.driversList);
        });
    };

    // Удаляет водителя
    $scope.deleteDriver = function(driverId){
        $http.post('php/deleteDriver.php', {"id": driverId}).success(function(data){
            $scope.drivers.deleteItem(driverId);
            if($scope.currentDriver.id = driverId)
                $scope.currentDriver.id = 0;
        });
    };

    // Переключает водителя в режим просмотра
    $scope.setToViewMode = function(driverId){
        angular.forEach($scope.data.driverList, function(value, key){
            if(value.id == driverId){
                value.restoreBackup();
                value.inEditMode = false;
                //value.isChanged = false;
            }
        });
    }

    // Переключает водителя в режим редактирования
    $scope.setToEditMode = function(driverId){
        angular.forEach($scope.data.driverList, function(value, key){
            if(value.id == driverId){
                value.inEditMode = true;
            }
        });
    }

    // Срабатывает при изменении данных водителя
    $scope.setToChanged = function(driverId){
        angular.forEach($scope.data.driverList, function(value, key){
            if(value.id == driverId && value.isChanged == false){
                value.isChanged = true;
            }
        });
    };

    // Сохраняте изменения в БД
    $scope.saveChanges = function(driverId){
        angular.forEach($scope.data.driverList, function(value, key){
            if(value.id == driverId){
                value.errors.splice(0, value.errors.length);

                if(value.tempFio == "")
                    value.errors.push("Вы не ввели ф.и.о. водителя");

                if(value.errors.length == 0){
                    var requestParams = {
                        "id" : driverId,
                        "fio" : value.tempFio,
                        "phone" : value.tempPhone
                    };
                    $http.post('php/updateDriver.php', JSON.stringify(requestParams)).success(function(data){
                        if(data == "success"){
                            value.fio = value.tempFio;
                            value.phone = value.tempPhone;
                            value.isChanged = false;
                            value.inEditMode = false;
                        }
                        //console.log(data);
                    });
                }
            }
        });
    };

    /* Отмечает выбранного водителя как текущего */
    $scope.setCurrentDriver = function(id){
        $scope.currentDriver = $scope.drivers.findItemById(id);
        $("#driversTable tr").each(function(index, element){
            $(element).removeClass("warning");
        });
        $("#driver" + id).addClass("warning");
    };

};
