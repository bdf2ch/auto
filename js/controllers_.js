'use strict';

function Request(JSONdata){

    this.id = new Number();                   // »‰ÂÌÚËÙËÍ‡ÚÓ Á‡ˇ‚ÍË
    this.timeCreated = new String();          // ƒ‡Ú‡ Ë ‚ÂÏˇ ÒÓÁ‰‡ÌËˇ Á‡ˇ‚ÍË ‚ ÙÓÏ‡ÚÂ unix
	this.dateCreated = new String();
    this.user = new User();                   // œÓÎ¸ÁÓ‚‡ÚÂÎ¸, ÒÓÁ‰‡‚¯ËÈ Á‡ˇ‚ÍÛ
    this.status = new RequestStatus();        // —Ú‡ÚÛÒ Á‡ˇ‚ÍË
    this.transportTypeId = new Number();      // »‰ÂÌÚËÙËÍ‡ÚÓ ÚËÔ‡ Ú‡ÌÒÔÓÚÌÓ„Ó ÒÂ‰ÒÚ‚‡
    this.transportTypeTitle = new String();   // Õ‡ËÏÂÌÓ‚‡ÌËÂ ÚËÔ‡ Ú‡ÌÒÔÓÚ‡
    this.transportItem = new TransportItem(); // “‡ÌÒÔÓÚÌ‡ˇ Â‰ÂÌËˆ‡
    this.route = new Array();                 // Ã‡¯ÛÚ ÔÓÂÁ‰ÍË
    this.startTime = new Number();            // ƒ‡Ú‡ Ë ‚ÂÏˇ Ì‡˜‡Î‡ ÔÓÂÁ‰ÍË ‚ ÙÓÏ‡ÚÂ unix
	this.tempStartTime = new Date();
	this.tempStartDate = new Date();
    this.endTime = new Number();              // ƒ‡Ú‡ Ë ‚ÂÏˇ ÓÍÓÌ˜‡ÌËˇ ÔÓÂÁ‰ÍË ‚ ÙÓÏ‡ÚÂ unix
    this.driver = new Driver;                 // ¬Ó‰ËÚÂÎ¸
    this.info = new String();                 // »ÌÙÓÏ‡ˆËˇ Ó ÔÓÂÁ‰ÍÂ
    this.isChanged = new Boolean();           // ‘Î‡„, ·˚Î‡ ÎË Á‡ˇ‚Í‡ ËÁÏÂÌÂÌ
    this.inEditMode = new Boolean();          // ‘Î‡„, Ì‡ıÓ‰ËÚÒˇ ÎË Á‡ˇ‚Í‡ ‚ ÂÊËÏÂ Â‰‡ÍÚËÓ‚‡ÌËˇ
	this.inAddRouteMode = new Boolean();	  // ‘Î‡„, Ì‡ıÓ‰ËÚÒˇ ÎË Á‡ˇ‚Í‡ ‚ ÂÊËÏÂ ‰Ó·‡‚ÎÂÌËˇ ˝ÎÂÏÂÌÚ‡ Ï‡¯ÛÚ‡
	this.isRejectRecieved = new Boolean();    // ‘Î‡„, ÓÚÏÂÌÂÌ‡ ÎË Á‡ˇ‚Í‡ Á‡ˇ‚ËÚÂÎÂÏ
	this.backupObject = {};				      // ¡˝Í‡Ô Á‡ˇ‚ÍË ‰Îˇ ‚ÓÒÒÚ‡ÌÓ‚ÎÂÌËˇ ‚ ÒÎÛ˜‡Â ÓÚÏÂÌ˚ Â‰‡ÍÚËÓ‚‡ÌËˇ
	this.backupObject.driver = new Driver();
	this.backupObject.transportItem = new TransportItem();
	this.backupObject.status = new RequestStatus();
	this.backupObject.errors = {};
	this.backupObject.errors.time = [];
	this.backupObject.errors.route = [];
	this.backupObject.errors.transportItem = [];
	this.backupObject.errors.driver = [];
    
    if(JSONdata != null){
		//id
		if(JSONdata["REQUEST_ID"] != null)
			this.id = JSONdata['REQUEST_ID'].valueOf();
		else
			this.id = 0;
		//timeCreated
		if(JSONdata["REQUEST_TIME"] != null)
			this.timeCreated = JSONdata['REQUEST_TIME'];
		else
			this.timeCreated = "";
		//dateCreated
		if(JSONdata["REQUEST_DATE"] != null)
			this.dateCreated = JSONdata['REQUEST_DATE'];
		else
			this.dateCreated = "";
		//transportTypeId
		if(JSONdata["TRANSPORT_TYPE_ID"] != null){	
			this.transportTypeId = JSONdata['TRANSPORT_TYPE_ID'].valueOf();
			this.backupObject.transportTypeId = JSONdata['TRANSPORT_TYPE_ID'].valueOf();
		} else {
			this.transportTypeId = 0;
			this.backupObject.transportTypeId = 0;
		}
		//transportTypeTitle
        this.transportTypeTitle = JSONdata["TRANSPORT_TYPE_TITLE"];
		this.backupObject.transportTypeTitle = JSONdata["TRANSPORT_TYPE_TITLE"];
		//stratTime
		if(JSONdata["START_TIME"] != null){
			this.startTime = JSONdata['START_TIME'].valueOf();
			this.tempStartDate = moment.unix(JSONdata['START_TIME'].valueOf()).format("DD.MM.YY");
			this.tempStartTime = moment.unix(JSONdata['START_TIME'].valueOf()).format("HH:mm");
			this.backupObject.startTime = JSONdata['START_TIME'].valueOf();
			this.backupObject.tempStartDate = moment.unix(JSONdata['START_TIME'].valueOf()).toDate();
			this.backupObject.tempStartTime = moment.unix(JSONdata['START_TIME'].valueOf()).format("HH:mm");
		} else {
			this.startTime = 0;
			this.backupObject.startTime = 0;
			this.backupObject.tempStartDate = "0";
			this.backupObject.tempStartTime = "0";
		}
		//endTime
		if(JSONdata["END_TIME"] != null){
			this.endTime = JSONdata['END_TIME'].valueOf();
			this.backupObject.endTime = JSONdata['END_TIME'].valueOf();
			this.backupObject.tempEndDate = moment.unix(JSONdata['END_TIME'].valueOf()).toDate();
			this.backupObject.tempEndTime = moment.unix(JSONdata['END_TIME'].valueOf()).format("HH:mm");
		} else {
			this.endTime = 0;
			this.backupObject.endTime = 0;
			this.backupObject.tempEndDate = "0";
			this.backupObject.tempEndTime = "0";
		}
		//route
		if(JSONdata["REQUEST_ROUTE"] != null){
			this.route = JSONdata['REQUEST_ROUTE'].toString().split(";");
			this.backupObject.route = JSONdata['REQUEST_ROUTE'].toString().split(";");
		} else {
			this.route = [];
			this.backupObject.route = [];
		}
		//info
		if(JSONdata["REQUEST_INFO"] != null){
			this.info = JSONdata['REQUEST_INFO'];
			this.backupObject.info = JSONdata['REQUEST_INFO'];
		} else {
			this.info = "";
			this.backupObject.info = "";
		}
		//isChanged
        this.isChanged = false;
		//inEditMode
        this.inEditMode = false;
		//inAddRouteMode
		this.inAddRouteMode = false;
		//isRejectRecieved
		if(JSONdata["REQUEST_REJECT_RECIEVED"] != null){
			if(JSONdata['REQUEST_REJECT_RECIEVED'].valueOf() == new Number(1))
				this.isRejectRecieved = true;
			else
				this.isRejectRecieved = false;
		} else {
			this.isRejectRecieved = false;
			this.backupObject.isRejectRecieved = false;
		}
    }
	
	this.restoreBackup = function(){
		this.backupObject.transportTypeId = this.transportTypeId;
		this.backupObject.transportTypeTitle = this.transportTypeTitle;
		this.backupObject.startTime = this.startTime;
		this.backupObject.tempStartDate = moment.unix(this.startTime).toDate();
		this.backupObject.tempStartTime = moment.unix(this.startTime).format("HH:mm");
		this.backupObject.endTime = this.endTime;
		this.backupObject.tempEndDate = moment.unix(this.endTime).toDate();
		this.backupObject.tempEndTime = moment.unix(this.endTime).format("HH:mm");
		this.backupObject.route = this.route.slice();
		this.backupObject.info = this.info;
		this.backupObject.driver.fromAnother(this.driver);
		this.backupObject.transportItem.fromAnother(this.transportItem);
		this.backupObject.status.fromAnother(this.status);
		
		this.backupObject.errors.time.splice(0, this.backupObject.errors.time.length);
		this.backupObject.errors.route.splice(0, this.backupObject.errors.route.length);
		this.backupObject.errors.transportItem.splice(0, this.backupObject.errors.transportItem.length);
		this.backupObject.errors.driver.splice(0, this.backupObject.errors.driver.length);
	}
    
}

function Driver(){

    this.id = new Number();
    this.fio = new String();
    this.name = new String();
    this.fname = new String();
    this.surname = new String();
    this.phone = new String();
	
	this.fromJSON = function(JSONdata){
		if(JSONdata != null){
			if(JSONdata["DRIVER_ID"] != null)
				this.id = JSONdata["DRIVER_ID"].valueOf();
			else 
				this.id = 0;
			this.phone = JSONdata["PHONE"];
			this.fio = JSONdata["FIO"];
			if(this.id != 0){
				var name_parts = this.fio.split(" ");
				this.surname = name_parts[0];
				this.name = name_parts[1];
				this.fname = name_parts[2];
			}
		}
	};
	
	this.fromAnother = function(driver){
		if(typeof driver == 'object'){
			this.id = driver.id;
			this.phone = driver.phone;
			this.fio = driver.fio;
			this.surname = driver.surname;
			this.name = driver.name;
			this.fname = driver.fname;
		}
	};

}

function transportType(){
	this.id = new number();
	this.subtypeId = new Number();
	this.title = new String();
	this.subtypeTitle = new String();
}

function TransportItem(){
    this.id = new Number();
    this.transportTypeId = new Number();
    this.transportTypeTitle = new String();
    this.model = new String();
    this.gid = new String();
	this.displayLabel = new String();
	
	this.fromJSON = function(JSONdata){
		if(JSONdata != null){
			if(JSONdata['ITEM_ID'] != null)
				this.id = JSONdata["ITEM_ID"].valueOf();
			else 
				this.id = 0;
			if(JSONdata["ITEM_TYPE_ID"] != null)
				this.transportTypeId = JSONdata["ITEM_TYPE_ID"].valueOf();
			else 
				this.transportTypeId = 0;
			this.model = JSONdata["ITEM_TITLE"];
			this.gid = JSONdata["ITEM_GID"];
			this.transportTypeTitle = JSONdata["TRANSPORT_TYPE_TITLE"];
			if(this.id != 0 && this.gid != null)
				this.displayLabel = "(" + JSONdata["ITEM_GID"] + ") " + JSONdata["ITEM_TITLE"];
			else if(this.id != 0 && this.gid == null)
				this.displayLabel = JSONdata["ITEM_TITLE"];
			else
				this.displayLabel = "–ù–µ –Ω–∞–∑–Ω–∞—á–µ–Ω–∞";
		}
	}
    
	this.fromAnother = function(item){
		if(typeof item == 'object'){
			this.id = item.id;
			this.transportTypeId = item.transportTypeId;
			this.transportTypeTitle = item.transportTypeTitle;
			this.model = item.model;
			this.gid = item.gid;
			this.displayLabel = item.displayLabel;
		}
	}
    
}

function RequestStatus(){
    this.NOT_APPROVED = 1;
    this.APPROVED = 2;
    this.REJECTED = 3;
    
    this.id = new Number();
    this.title = new String();
    this.rejectReasonId = new Number();
    this.rejectReasonTitle = new String();
    
	this.fromJSON = function(JSONdata){
		if(JSONdata != null){
			if(JSONdata['REQUEST_STATUS'] != null)
				this.id = JSONdata["REQUEST_STATUS"].valueOf();
			else this.id = 0;
			this.title = JSONdata["REQUEST_STATUS_TITLE"];
			if(JSONdata["REASON_ID"] != null){
				this.rejectReasonId = JSONdata["REASON_ID"].valueOf();
				this.rejectReasonTitle = JSONdata["REASON_TITLE"];
			}
			else
				this.rejectReasonId = 0;
		}
	}
	
	this.fromAnother = function(status){
		if(typeof status == 'object'){
			this.id = status.id;
			this.title = status.title;
			this.rejectReasonId = status.rejectReasonId;
			this.rejectReasonTitle = status.rejectReasonTitle;
		}
	}
	
}


function User(){
    this.id = new Number();
    this.oblVid = new Number();
	this.oblVidTitle = new String();
    this.isAdmin = new Boolean();
    this.surname = new String();
    this.name = new String();
    this.fname = new String();
    this.phone = new String();
    
	
	this.fromJSON = function(JSONdata){
		if(JSONdata != null){
			if(JSONdata["ID"] != null)
				this.id = JSONdata["ID"].valueOf();
			else this.id = 0;
			if(JSONdata["OBL_VID"] != null)
				this.oblVid = JSONdata["OBL_VID"].valueOf();
			else this.oblVid = 1;
			if(JSONdata["ADMIN_DEP_ID"] != null){
				if(JSONdata["ADMIN_DEP_ID"].valueOf() == 0)
					this.isAdmin = false;
				 this.isAdmin = true;
			}
			   
			this.surname = JSONdata["FAM_NAME"];
			this.name = JSONdata["FST_NAME"];
			this.fname = JSONdata["LST_NAME"];
			this.oblVidTitle = JSONdata["FULL_NAME"];
		} else if(JSONdata == null){
			this.id = 0;
			this.oblVid = 0;
			this.oblVidTitle = "";
			this.isAdmin = false;
			this.surname = "";
			this.name = "";
			this.fname = "";
			this.phone = "";
		}
	}
};

function RequestTemplate(){
	this.transportTypeId = new Number();
	this.startDate = new Date();
	this.startTime = new String();
	this.endDate = new Date();
	this.endTime = new String();
	this.route = [];
	this.info = "";
	this.errors = {};
	this.errors.time = [];
	this.errors.route = [];
	this.errors.otherUser = [];
}


/* Controllers */
function ListViewCtrl($scope, $http, $location) {
	$scope.currentDate = new Date();
	$scope.currentUser = new User();
	$scope.requests = new Array();
	$scope.statusList = new Array();
	$scope.rejectReasonList = new Array();
	$scope.driverList = new Array();
	$scope.driverFioList = new Array();
	$scope.transportSubtypeList = new Array();
	$scope.transportItemList = new Array();
	$scope.transportItemTitleList = new Array();
	$scope.routeList = new Array();
	$scope.userList = new Array();
	$scope.userFioList = new Array();
	
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
	
	//$scope.$watch('newRequest', function(newValue, oldValue) {
		//scope.greeting = scope.salutation + ' ' + scope.name + '!';
		//oldValue = newValue;
	//}); // initialize the watch
  
  
	$scope.getCurrentDate = function(){
		$http.post('php/getDate.php').success(function(data){
			if(data != "" && data != null){
				console.log(data);
				$scope.currentDate = moment.unix(data.valueOf()).toDate();
				$scope.newRequest.startDate = $scope.currentDate;
				$scope.newRequest.endDate = $scope.currentDate;
				console.log($scope.currentDate);
				$scope.getUserInfo();
			}
			
		}); 
	};
	
	$scope.getTransportSubtypeList = function(){
		$http.post('php/getTransportSubtypeList.php').success(function(data) {
			if(data != "" && data != null){
				angular.forEach(data, function(value, key){
					var temp_subtype = {"id": value['TRANSPORT_SUBTYPE_ID'].valueOf(), "title": value['TRANSPORT_SUBTYPE_TITLE']};
					$scope.transportSubtypeList.push(temp_subtype);
				});
				console.log($scope.transportSubtypeList);
			}
		});
	};
	
	$scope.getRouteList = function(){
		$http.post('php/getRouteList.php').success(function(data){	
			angular.forEach(data, function(value, key){	
				var JSONdata = {"POINT_ID": value["POINT_ID"],
							"POINT_TITLE": value["POINT_TITLE"]}
				$scope.routeList.push(JSONdata["POINT_TITLE"]);
				//$scope.routeList.labels.push(JSONdata["POINT_TITLE"]);
			});
			//$scope.typeahead = $scope.routeList.slice();
			if($scope.currentUser.isAdmin == false)
				$scope.getRequestList();
		});
	}
	
	$scope.getUserInfo = function(){
		$http.post('php/getUserInfo.php').success(function(data){
			$scope.currentUser = new User();
			$scope.currentUser.fromJSON(data);
			//$scope.getRequestList();
			if($scope.currentUser.isAdmin == true){
				$scope.getStatusList();
				//$scope.getDriverList();
				//$scope.getTransportItemList();
				//$scope.getRejectReasonList();
				//$scope.getUserList();
			} else {
				//$scope.getRequestList();
			}
		});  
	};
	
	$scope.getCurrentDate();
	//$scope.getUserInfo();
	$scope.getTransportSubtypeList();
	$scope.getRouteList();
	
	
	$scope.showLoading = function(){
		$("#loadingIndicator").css("display", "inline-block");
	};
	
	$scope.hideLoading = function(){
		$("#loadingIndicator").css("display", "none");
	};
	
	$scope.getRequestList = function(){
		//$("#myRequestsLink").removeClass("active");
		//$("#allRequestsLink").addClass("active");
		$scope.showLoading();
	
		if($scope.myRequestsMode == true){
			$scope.myRequestsMode = false;
			$scope.packagesLoaded = 0;
			$scope.requests.splice(0, $scope.requests.length);
		}
		$http.post('php/getRequestList.php', {"department": $scope.currentUser.oblVid, "pkgSize": $scope.packageSize, "startPos": $scope.packagesLoaded}).success(function(data) {
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
			$scope.hideLoading();
		
    });
	};
  
  $scope.getStatusList = function(){
		$scope.statusList.splice(0, $scope.statusList.length);
		$http.post('php/getStatusList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
			var JSONdata = {"REQUEST_STATUS": value["STATUS_ID"],
							"REQUEST_STATUS_TITLE": value["STATUS_TITLE"],
							"REASON_ID": 0,
							"REASON_TITLE": ""}
			var temp_status = new RequestStatus();
			temp_status.fromJSON(JSONdata);
			$scope.statusList.push(temp_status);
		});
		console.log($scope.statusList);
		$scope.getDriverList();
	});
  };
  
	
  
  $scope.getDriverList = function(){
		$http.post('php/getDriverList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
			$scope.driverFioList.push(value["FIO"]);
			var JSONdata = {"DRIVER_ID": value["DRVR_ID"],
							"PHONE": value["PHONE"],
							"FIO": value["FIO"]};
			var temp_driver = new Driver();
			temp_driver.fromJSON(JSONdata);
			$scope.driverList.push(temp_driver);
		});
		$scope.getTransportItemList();
	});
	console.log($scope.driverList);
  };
  
	$scope.getTransportItemList = function(){
		$http.post('php/getTransportItemList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
				var temp_transport = new TransportItem();
				temp_transport.fromJSON(value);
				$scope.transportItemList.push(temp_transport);
				$scope.transportItemTitleList.push(temp_transport.displayLabel);
			});
			$scope.getRejectReasonList();
		});
	};
  
  $scope.getRejectReasonList = function(){
		$http.post('php/getRejectReasonList.php').success(function(data) {
			angular.forEach(data, function(value, key){	
			var JSONdata = {"REASON_ID": value["REASON_ID"],
							"REASON_TITLE": value["REASON_TITLE"]}
			$scope.rejectReasonList.push(JSONdata);
		});
		$scope.getUserList();
	});
  };
  
	
  
	$scope.getUserList = function(){
		$http.post('php/getUserList.php').success(function(data){
			if(data != null){
				angular.forEach(data, function(value, key){
					var temp_user = new User();
					temp_user.fromJSON(value);
					$scope.userList.push(temp_user);
					$scope.userFioList.push(temp_user.surname + " " + temp_user.name + " " + temp_user.fname);
				});
			}

			if($scope.currentUser.isAdmin == true){
				$scope.getRequestList();
			}
		});
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
  }
  
  $scope.setToEditMode = function(requestId){
      angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
             value.inEditMode = true;
			 console.log(value.backupObject.tempStartDate);
			 //value.backupObject = value;
         } 
      });
  }
  
  $scope.setToChanged = function(requestId){
	angular.forEach($scope.requests, function(value, key){
         if(value.id == requestId){
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
						console.log("rejectRequest sent");
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
				var startTimeUnix = moment(value.backupObject.tempStartDate).hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
				var endTime = value.backupObject.tempEndTime.split(":");
				var endTimeUnix = moment(value.backupObject.tempEndDate).hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
				//console.log("startTime = " + moment.unix(startTimeUnix).format("DD.MM.YY HH:mm") + ", endTime = " + moment.unix(endTimeUnix).format("DD.MM.YY HH:mm"));
				if(startTimeUnix > endTimeUnix){
					value.backupObject.errors.time.push("–í—Ä–µ–º—è –ø—Ä–∏–±—ã—Ç–∏—è –Ω–µ –º–æ–∂–µ—Ç –±—ã—Ç—å —Ä–∞–Ω—å—à–µ –≤—Ä–µ–º–µ–Ω–∏ –æ—Ç–ø—Ä–∞–≤–ª–µ–Ω–∏—è");
				} else if(startTimeUnix == endTimeUnix){
					value.backupObject.errors.time.push("–í—Ä–µ–º—è –ø—Ä–∏–±—ã—Ç–∏—è –Ω–µ –º–æ–∂–µ—Ç —Ä–∞–≤–Ω—è—Ç—å—Å—è –≤—Ä–µ–º–µ–Ω–∏ –æ—Ç–ø—Ä–∞–≤–ª–µ–Ω–∏—è");
				}
				
				var route = new String();
				if(value.backupObject.route.length != 0 && value.backupObject.route.length > 1){
					angular.forEach(value.backupObject.route, function(routeItem, index){
						route = route + routeItem;
						if(index != value.backupObject.route.length - 1)
							route = route + ";";
					});
				} else if (value.backupObject.route.length == 0) {
					value.backupObject.errors.route.push("–í—ã –Ω–µ –∑–∞–¥–∞–ª–∏ –º–∞—Ä—à—Ä—É—Ç –ø–æ–µ–∑–¥–∫–∏");
				} else if (value.backupObject.route.length == 1){
					value.backupObject.errors.route.push("–ú–∞—Ä—à—Ä—É—Ç –Ω–µ –º–æ–∂–µ—Ç —Å–æ—Å—Ç–æ—è—Ç—å –∏–∑ –æ–¥–Ω–æ–≥–æ —ç–ª–µ–º–µ–Ω—Ç–∞");
				}
				
				var transportId = -1;
				var temp_transport = new TransportItem();
				angular.forEach($scope.transportItemList, function(transport, trkey){
					if(value.backupObject.transportItem.displayLabel == transport.displayLabel){
						transportId = transport.id;
						temp_transport.fromAnother(transport);
						//value.backupObject.transportItem.fromAnother(transport);
						//console.log("item = " + transport.displayLabel + ", " + transport.id);
					}
				});
					
				if(value.backupObject.transportItem.displayLabel != "" && transportId == -1){
					value.backupObject.errors.transportItem.push("–¢–∞–∫–æ–π —Ç—Ä–∞–Ω—Å–ø–æ—Ä—Ç–Ω–æ–π –µ–¥–∏–Ω–∏—Ü—ã –Ω–µ—Ç –≤ —Å–ø–∏—Å–∫–µ");
				}
				
				if(value.backupObject.transportItem.displayLabel == ""){
					transportId = 0;
					temp_transport.id = 0;
					temp_transport.model = "–ù–µ –Ω–∞–∑–Ω–∞—á–µ–Ω–∞";
				}

				
				var driverId = -1;
				var temp_driver = new Driver();
				angular.forEach($scope.driverList, function(driver, drkey){
					if(value.backupObject.driver.fio == driver.fio){
						driverId = driver.id;
						temp_driver.fromAnother(driver);
						//console.log("driver = " + driver.fio + ", " + driver.id);
					}
				});
				if(value.backupObject.driver.fio != "" && driverId == -1){
					value.backupObject.errors.driver.push("–¢–∞–∫–æ–≥–æ –≤–æ–¥–∏—Ç–µ–ª—è –Ω–µ—Ç –≤ —Å–ø–∏—Å–∫–µ");
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
		if($scope.requests.length != 0){
			if($scope.myRequestsMode == false){
				$scope.packagesLoaded++;
				$http.post('php/getRequestList.php', {"department": $scope.currentUser.oblVid, "pkgSize": $scope.packageSize, "startPos": $scope.packagesLoaded}).success(function(data) {
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
		
				});
			} else if($scope.myRequestsMode == true){
				$scope.packagesLoaded++;
				var requestParams = {
										"userId": $scope.currentUser.id,
										"department": $scope.currentUser.oblVid,
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
				});					
			}
		
		console.log($scope.packagesLoaded);
		}
	};
	
	$scope.showAddRequestForm = function(){
		$("#addRequestLink").addClass("disabled");
		$("#addRequestLayer").animate({"margin-top" : "-10px"}, 500);
		$("#addRequestLayer").css("position", "fixed");
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
	
	$scope.addRequest = function(){
		console.log($scope.newRequest);
		
		$scope.newRequest.errors.time.splice(0, $scope.newRequest.errors.time.length);
		$scope.newRequest.errors.route.splice(0, $scope.newRequest.errors.route.length);
		$scope.newRequest.errors.otherUser.splice(0, $scope.newRequest.errors.otherUser.length);
		
		var startTime;
		var startTimeUnix;
		var endTime;
		var endTimeUnix;
		
		if($scope.newRequest.startTime == null || $scope.newRequest.startTime == ""){
			$scope.newRequest.errors.time.push("–í—ã –Ω–µ —É–∫–∞–∑–∞–ª–∏ –≤—Ä–µ–º—è –æ—Ç–ø—Ä–∞–≤–ª–µ–Ω–∏—è");
		} else {
			startTime = $scope.newRequest.startTime.split(":");
			startTimeUnix = moment($scope.newRequest.startDate).hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
		}
		
		if($scope.newRequest.endTime == null || $scope.newRequest.endTime == ""){
			$scope.newRequest.errors.time.push("–í—ã –Ω–µ —É–∫–∞–∑–∞–ª–∏ –≤—Ä–µ–º—è –ø—Ä–∏–±—ã—Ç–∏—è");
		} else {
			endTime = $scope.newRequest.endTime.split(":");
			endTimeUnix = moment($scope.newRequest.endDate).hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
		}
		
		
		

		if(startTimeUnix > endTimeUnix){
			$scope.newRequest.errors.time.push("–í—Ä–µ–º—è –ø—Ä–∏–±—ã—Ç–∏—è –Ω–µ –º–æ–∂–µ—Ç –±—ã—Ç—å —Ä–∞–Ω—å—à–µ –≤—Ä–µ–º–µ–Ω–∏ –æ—Ç–ø—Ä–∞–≤–ª–µ–Ω–∏—è");
		} else if(startTimeUnix == endTimeUnix && $scope.newRequest.startTime != "" && $scope.newRequest.startTime != null
					&& $scope.newRequest.endTime != "" && $scope.newRequest.endTime != null){
			$scope.newRequest.errors.time.push("–í—Ä–µ–º—è –ø—Ä–∏–±—ã—Ç–∏—è –Ω–µ –º–æ–∂–µ—Ç —Ä–∞–≤–Ω—è—Ç—å—Å—è –≤—Ä–µ–º–µ–Ω–∏ –æ—Ç–ø—Ä–∞–≤–ª–µ–Ω–∏—è");
		}
				
		var route = new String();
		if($scope.newRequest.route.length != 0 && $scope.newRequest.route.length > 1){
			angular.forEach($scope.newRequest.route, function(routeItem, index){
				route = route + routeItem;
				if(index != $scope.newRequest.route.length - 1)
					route = route + ";";
			});
		} else if ($scope.newRequest.route.length == 0) {
			$scope.newRequest.errors.route.push("–í—ã –Ω–µ –∑–∞–¥–∞–ª–∏ –º–∞—Ä—à—Ä—É—Ç –ø–æ–µ–∑–¥–∫–∏");
		} else if ($scope.newRequest.route.length == 1){
			$scope.newRequest.errors.route.push("–ú–∞—Ä—à—Ä—É—Ç –Ω–µ –º–æ–∂–µ—Ç —Å–æ—Å—Ç–æ—è—Ç—å –∏–∑ –æ–¥–Ω–æ–≥–æ —ç–ª–µ–º–µ–Ω—Ç–∞");
		}
		
		var userId = -1;
		var userDepartment = 0;
		if($scope.fromAnotherUser == true){
			if($(".otherUser").val() == ""){
				$scope.newRequest.errors.otherUser.push("–í—ã –Ω–µ —É–∫–∞–∑–∞–ª–∏ –ø–æ–ª—å–∑–æ–≤–∞—Ç–µ–ª—è, –æ—Ç —á—å–µ–≥–æ –∏–º–µ–Ω–∏ –ø–æ–¥–∞–µ—Ç—Å—è –∑–∞—è–≤–∫–∞");
			} else {
				angular.forEach($scope.userList, function(value, key){
					if($(".otherUser").val() == value.surname + " " + value.name + " " + value.fname){
						userId = value.id;
						userDepartment = value.oblVid;
						console.log(value);
					}
				});
				if(userId == -1){
					$scope.newRequest.errors.otherUser.push("–¢–∞–∫–æ–≥–æ –ø–æ–ª—å–∑–æ–≤–∞—Ç–µ–ª—è –Ω–µ—Ç –≤ —Å–ø–∏—Å–∫–µ");
				}
			}
			
		}
		
		var requestParams = {};
		
		if($scope.fromAnotherUser == true){
			requestParams = {
								"userId": userId,
								"transportTypeId": $scope.newRequest.transportTypeId,
								"startDate": moment.unix(startTimeUnix).format("DD.MM.YY"),
								"startTime": startTimeUnix,
								"endDate": moment.unix(endTimeUnix).format("DD.MM.YY"),
								"endTime": endTimeUnix,
								"route": route,
								"passCount": 0,
								"info": $scope.newRequest.info,
								"department": userDepartment
							};
			
		} else {
			requestParams = {
								"userId": $scope.currentUser.id,
								"transportTypeId": $scope.newRequest.transportTypeId,
								"startDate": moment.unix(startTimeUnix).format("DD.MM.YY"),
								"startTime": startTimeUnix,
								"endDate": moment.unix(endTimeUnix).format("DD.MM.YY"),
								"endTime": endTimeUnix,
								"route": route,
								"passCount": 0,
								"info": $scope.newRequest.info,
								"department": $scope.currentUser.oblVid
							};
		}
					
		
											
		if($scope.newRequest.errors.time.length == 0 && $scope.newRequest.errors.route.length == 0 && $scope.newRequest.errors.otherUser.length == 0){
				   $http.post('php/addRequest.php', JSON.stringify(requestParams)).success(function(data){	
				       if(data == "success"){
							console.log("success");
							$scope.cancelAddRequest();
							$scope.getMyRequestList();
							
					   }
			     });
		};
	}	
	
	$scope.getMyRequestList = function(){
		$scope.myRequestsMode = true;
		console.log($scope.myRequestsMode);
		$scope.packagesLoaded = 0;
		$("#myRequestsLink").addClass("active");
		$("#allRequestsLink").removeClass("active");
		
		var requestParams = {
								"userId": $scope.currentUser.id,
								"department": $scope.currentUser.oblVid,
								"pkgSize": $scope.packageSize,
								"startPos": $scope.packagesLoaded
							};
		$http.post('php/getMyRequestList.php', JSON.stringify(requestParams)).success(function(data){	
			if(data != "" && data != null){
				console.log("data != null");
				//$scope.requests.splice(0, $scope.requests.length);
				console.log($scope.requests.length);
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
					//$scope.requests.push(temp_request);
				});
			}
		});					
	};
  
}