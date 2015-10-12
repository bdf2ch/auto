'use strict';

/* Services */

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
    utils.drivers = new Collection();
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

    /* Mode triggers */
    utils.inDriverMode = new Boolean(false);
    utils.inTransportMode = new Boolean(false);

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
                var JSONdata = {
                    "DRVR_ID": value["DRVR_ID"],
                    "PHONE": value["PHONE"],
                    "FIO": value["FIO"]};
                var temp_driver = new Driver();
                console.log(temp_driver);
                temp_driver.fromJSON(value);
                utils.driverList.push(temp_driver);
                utils.drivers.addItem(temp_driver);
            });
        });
        //console.log(utils.driverList);
        console.log(utils.drivers.items);
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
