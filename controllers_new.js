'use strict';

function ListViewCtrl($scope, $http, $location, GlobalData) {
    $scope.data = GlobalData;
    //$scope.requests = new Collection();
    $scope.showMyRequests = 0;

    $scope.typeahead;
    $scope.typeaheadValue = '';

    $scope.newRoute ="";

    $scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};

    $scope.fromAnotherUser = false;

    $scope.data.inDriverMode = false;
    $scope.data.inPanoramaMode = false;

    $scope.tempDriver = new Driver();
    $scope.tempTransport = new TransportItem();


    $("#allRequestsLink").addClass("active");


    /* Получает заявки на текущую неделю */
    $scope.getRequests = function(){

        $scope.data.showLoading();
        var requestParams = {
            "department": $scope.data.currentUser.oblVid,
            "start": moment($scope.data.weekStart).unix(),
            "end": moment($scope.data.weekEnd).unix()
        };
        //console.log(moment($scope.data.weekEnd).format("DD.MM.YYYY HH:mm"));
        $http.post('php/getRequestList.php', requestParams).success(function(data){
            $scope.data.requests.clear();
            angular.forEach(data, function(request, key){
                var temp_request = new Request();
                temp_request.fromJSON(request);
                temp_request.setupBackup();
                $scope.data.requests.addItem(temp_request);
            });
            $scope.data.hideLoading();
           // console.log($scope.data.requests.items);
        });
    };

    /* Получает информацию о пользователе и загружает списки данных */
    $scope.getUserInfo = function(){
        //if($scope.data.currentUser.id == 0){
            $http.post('php/getUserInfo.php').success(function(data){
                $scope.data.currentUser = new User();
                $scope.data.currentUser.fromJSON(data);
                //console.log($scope.data.currentUser);
                if($scope.data.statuses.length() == 0)
                    $scope.data.getStatuses();
                if($scope.data.rejectReasons.length() == 0)
                    $scope.data.getRejectReasons();
                if($scope.data.drivers.length() == 0)
                    $scope.data.getDrivers();
                if($scope.data.transports.length() == 0)
                    $scope.data.getTransports();
                if($scope.data.users.length() == 0)
                    $scope.data.getUsers();
                if($scope.data.divisions.length() == 0)
                    $scope.data.getDivisions();
                if($scope.data.transportTypes.length() == 0)
                    $scope.data.getTransportTypes();
                if($scope.data.transportSubtypes.length() == 0)
                    $scope.data.getTransportSubtypes();
                if($scope.data.routes.length() == 0)
                    $scope.data.getRoutes();
                $scope.getRequests();
                $scope.data.reports.clear();
                $scope.data.reports.addItem(new Report(1, "Отчет по отклоненным заявкам", true, true, false, $scope.data.currentUser.oblVid, "php/rejectsReport.php"));
                $scope.data.reports.addItem(new Report(2, "Обзор заявок по водителю", true, true, true, $scope.data.currentUser.oblVid, "php/daily-report-by-driver.php"));
                $scope.data.reports.addItem(new Report(3, "Обзор заявок за период", true, true, false, $scope.data.currentUser.oblVid, "php/requests-period-report.php"));
            });
        //} else
        //    $scope.getRequests();
    };
    $scope.getUserInfo();
    //console.log($scope.data.requests.items);

    /* Переводит заявку в режим редактирования */
    $scope.setToEditMode = function(id){
        $scope.tempDriver.fromAnother($scope.data.drivers.findItemById($scope.data.requests.findItemById(id).driverId));
        $scope.tempTransport.fromAnother($scope.data.transports.findItemById($scope.data.requests.findItemById(id).transportItemId));
        $scope.data.requests.findItemById(id).setToEditMode();
    };

    /* Переводит заявку в режим добавления пункта маршрута */
    $scope.setToAddRouteMode = function(requestId){
        $scope.data.requests.findItemById(requestId).inAddRouteMode = true;
    };

    /* отсылает сообщение об отмене заявки */
    $scope.sendRejectRequest = function(requestId){
        $http.post('php/sendRejectRequest.php', {"id": requestId}).success(function(data){
            if(data == "success")
                $scope.data.requests.findItemById(requestId).isCanceled = true;
        });
    };

    /* Сохраняет изменения в заявке */
    $scope.saveChanges = function(requestId){
        var request = $scope.data.requests.findItemById(requestId);

        request.errors.time.splice(0, request.errors.time.length);
        request.errors.route.splice(0, request.errors.route.length);
        request.errors.transport.splice(0, request.errors.transport.length);
        request.errors.driver.splice(0, request.errors.driver.length);

        if(moment(request.start).unix() > moment(request.end).unix()){
            request.errors.time.push("Время прибытия не может быть раньше времени отправления");
        } else if(moment(request.start).unix() == moment(request.end).unix()){
            request.errors.time.push("Время прибытия не может равняться времени отправления");
        }
        var route = new String();
        if(request.route.length > 1){
            angular.forEach(request.route, function(routeItem, index){
                route = route + routeItem;
                if(index != request.route.length - 1)
                    route = route + ";";
            });
        } else if (request.route.length == 0) {
            request.errors.route.push("Вы не задали маршрут поездки");
        } else if (request.route.length == 1){
            request.errors.route.push("Маршрут не может состоять из одного элемента");
        }

        var transportId = -1;
        var transportTitle = $("#" + request.id + " #transport").val();
        if($scope.data.transports.findItemByField("displayLabel", transportTitle) != false)
            transportId = $scope.data.transports.findItemByField("displayLabel", transportTitle).id;
        if(transportTitle != "" && transportId == -1)
            request.errors.transport.push("Такой транспортной единицы нет в списке");
        if(transportTitle == "")
            transportId = 0;

        var driverId = -1;
        var driverFio =  $("#" + request.id + " #driver").val();
        if($scope.data.drivers.findItemByField("fio", driverFio) != false){
            driverId = $scope.data.drivers.findItemByField("fio", driverFio).id;
        }
        if(driverFio != "" && driverId == -1){
            request.errors.driver.push("Такого водителя нет в списке");
        }
        if(driverFio == "")
            driverId = 0;

        var requestParams = {
            "requestId": request.id,
            "statusId": request.statusId,
            "reasonId": request.rejectReasonId,
            "startTime": moment(request.start).unix(),
            "endTime": moment(request.end).unix(),
            "route": route,
            "transportItem": transportId,
            "info": request.info,
            "driverId": driverId
        };

        request.driverId = driverId;
        request.transportItemId = transportId;

        if(request.errors.time.length == 0 && request.errors.route.length == 0 &&
           request.errors.transport.length == 0 && request.errors.driver.length == 0){
            $http.post('php/saveChanges.php', requestParams).success(function(data){
                if(data == "success"){
                    //$scope.data.requests.findItemById(request.id).update();
                    $scope.data.requests.findItemById(request.id).setupBackup();
                    $scope.data.requests.findItemById(request.id).cancelEditMode();
                }
            });
        }
        console.log(requestParams);
    };

    $scope.addRoute = function(requestId){
        var temp_route = $("#" + requestId + " #newRoute").val();
        //var temp_route = $("#" + requestId + " .autocompleteInput.route").val();
        console.log(temp_route);
        if($.trim(temp_route) != ""){
            $scope.data.requests.findItemById(requestId).route.push(temp_route);
            $scope.data.requests.findItemById(requestId).inAddRouteMode = false;
            $scope.data.requests.findItemById(requestId).setToChanged();
            //$("#" + requestId + " .autocompleteInput.route").val("")
            $("#" + requestId + " #newRoute").val("");
        }
    };

    /* Удаляет пункт маршрута из заявки */
    $scope.deleteRoute = function(requestId, routeId){
        $scope.data.requests.findItemById(requestId).route.splice(routeId, 1);
        $scope.data.requests.findItemById(requestId).setToChanged();

        console.log( $scope.data.requests.findItemById(requestId).backup.route);
        console.log( $scope.data.requests.findItemById(requestId).route);
    };

    /* Перемещает календарь на неделю вперед */
    $scope.next = function(){
        if($scope.data.nextWeek() == true)
            $scope.getRequests();
    };

    /* Перемещает календарь на неделю назад */
    $scope.previous = function(){
        if($scope.data.prevWeek() == true)
            $scope.getRequests();
    };



};



function SorterCtrl($scope, $http, GlobalData) {
    $scope.data = GlobalData;
    $scope.data.inDriverMode = false;
    $scope.data.inTransportMode = true;

    /* Получает информацию о пользователе и загружает списки данных */
    $scope.getUserInfo = function(){
        if($scope.data.currentUser.id == 0){
            $http.post('php/getUserInfo.php').success(function(data){
                $scope.data.currentUser = new User();
                $scope.data.currentUser.fromJSON(data);
                if($scope.data.transports.length() == 0)
                    $scope.data.getTransports();
                if($scope.data.transportTypes.length() == 0)
                    $scope.data.getTransportTypes();
                if($scope.data.transportSubtypes.length() == 0)
                    $scope.data.getTransportSubtypes();
                if($scope.data.departments.length() == 0)
                    $scope.data.getDepartments();
            });
        }
    };
    $scope.getUserInfo();

    $scope.saveChanges = function(transportId, typeId, subtypeId){
        $("#" + transportId + " select").attr("disabled", "disabled");
        var requestParams = {"id": transportId, "transportType": typeId, "transportSubType": subtypeId};
        $http.post('php/saveChanges_sorter.php', JSON.stringify(requestParams)).success(function(data){
            if(data == true){
                $("#" + transportId + " select").removeAttr("disabled");
            }
        });
    };
};

function ControlPanelCtrl($scope, $http, GlobalData){
    $scope.data = GlobalData;

    // Показывает панельку добавления заявки
    $scope.showAddRequestForm = function(){
        $("#addRequestLink").addClass("disabled");
        $("#addRequestLayer").animate({"margin-top" : "110px"}, 500);
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
            $http.post('php/addDriver.php', requestParams).success(function(data){
                console.log(data);
                if(data != "fail"){
                    var temp_driver = new Driver();
                    temp_driver.fromJSON(data);
                    $scope.data.drivers.addItem(temp_driver);
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

        if($("#addRequestLayer #newRequestStartTime").val() == "")
            $scope.data.newRequest.errors.time.push("Вы не указали дату и время отправления");
         else
            startTimeUnix = moment($("#addRequestLayer #newRequestStartTime").val(), "DD.MM.YY HH:mm").unix();

        if($("#addRequestLayer #newRequestEndTime").val() == "")
            $scope.data.newRequest.errors.time.push("Вы не указали дату и время прибытия");
         else
            endTimeUnix = moment($("#addRequestLayer #newRequestEndTime").val(), "DD.MM.YY HH:mm").unix();

        if(startTimeUnix > endTimeUnix)
            $scope.data.newRequest.errors.time.push("Время прибытия не может быть раньше времени отправления");
        else if(startTimeUnix == endTimeUnix && $("#addRequestLayer #newRequestStartTime").val() != "" && $("#addRequestLayer #newRequestEndTime").val() != "" )
            $scope.data.newRequest.errors.time.push("Время прибытия не может равняться времени отправления");

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

        /* Опрееделение глобального типа транспортного средства */
        var globalTypeId = 0;
        if($scope.data.transportSubtypes.findItemById($scope.data.newRequest.transportSubTypeId) != false)
            globalTypeId = $scope.data.transportSubtypes.findItemById($scope.data.newRequest.transportSubTypeId).globalTypeId;
        console.log("global Type ID = " + globalTypeId);

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
            $("#addRequestLink").attr("disabled", "disabled");
            $http.post('php/addRequest_new.php', requestParams).success(function(data){
                if(data && data != null && data != undefined){
                    console.log(data);
                    var temp_request = new Request();
                    temp_request.fromJSON(data);
                    temp_request.setupBackup();
                    $scope.data.requests.addItem(temp_request);
                    console.log($scope.data.requests.items);
                    $scope.cancelAddRequest();
                    $("#addRequestLink").removeAttr("disabled");
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


    $scope.activeTransports = new Collection();


    $("#addRequestLink").css("display", "block");
    $("#driversLink").css("display", "inline-block");
    $("#addDriverLink").css("display", "none");

    $scope.data.inDriverMode = false;
    $scope.data.inPanoramaMode = true;

    $scope.$watch('currentRequest', function(newValue, oldValue){
        console.log("NR changed");
        //$scope.currentRequest = newValue;
        //$scope.$digest();
    });


    /* Перемещает календарь на неделю вперед */
    $scope.next = function(){
        if($scope.data.nextWeek() == true)
            $scope.getRequests();
    };

    /* Перемещает календарь на неделю назад */
    $scope.previous = function(){
        if($scope.data.prevWeek() == true)
            $scope.getRequests();
    };

    $scope.getActiveTransportItems = function(){
        $scope.activeTransportItems.splice(0, $scope.activeTransportItems.length);
        $scope.activeTransports.clear();
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

    /* Получает заявки на текущую неделю */
    $scope.getRequests = function(){

        $scope.data.showLoading();
        var requestParams = {
            "department": $scope.data.currentUser.oblVid,
            "start": moment($scope.data.weekStart).unix(),
            "end": moment($scope.data.weekEnd).unix()
        };
        console.log(moment($scope.data.weekEnd).format("DD.MM.YYYY HH:mm"));
        $http.post('php/getRequestList.php', requestParams).success(function(data){
            $scope.data.requests.clear();
            angular.forEach(data, function(request, key){
                var temp_request = new Request();
                temp_request.fromJSON(request);
                temp_request.setupBackup();
                $scope.data.requests.addItem(temp_request);
            });


            console.log("start = " + moment($scope.data.rangeStart).format("DD.MM.YYYY HH:mm"));
            console.log("end = " + moment($scope.data.rangeEnd).format("DD.MM.YYYY HH:mm"));
            $scope.data.activeTransports.clear();
            angular.forEach($scope.data.requests.items, function(request, key){
                if($scope.data.inPanoramaWeekMode){
                    if(request.startTime >= moment($scope.data.weekStart).unix() && request.endTime <= moment($scope.data.weekEnd).unix()){
                        if($scope.data.activeTransports.findItemById(request.transportItemId) == false && request.transportItemId != 0){
                            $scope.data.activeTransports.addItem($scope.data.transports.findItemById(request.transportItemId));
                        }
                    }
                } else {
                    if(request.startTime >= moment($scope.data.rangeStart).unix() && request.endTime <= moment($scope.data.rangeEnd).unix()){
                        if(request.transportItemId == 0)console.log("zero");
                        console.log(request);
                        if($scope.data.activeTransports.findItemById(request.transportItemId) == false){
                            $scope.data.activeTransports.addItem($scope.data.transports.findItemById(request.transportItemId));
                        }
                    }
                }



            });
            console.log($scope.data.activeTransports.items);
            $scope.data.hideLoading();
            // console.log($scope.data.requests.items);
        });
    };




    /* Получает информацию о пользователе и загружает списки данных */
    $scope.getUserInfo = function(){
        $http.post('php/getUserInfo.php').success(function(data){
            $scope.data.currentUser = new User();
            $scope.data.currentUser.fromJSON(data);
            //console.log($scope.data.currentUser);
            if($scope.data.statuses.length() == 0)
                $scope.data.getStatuses();
            if($scope.data.rejectReasons.length() == 0)
                $scope.data.getRejectReasons();
            if($scope.data.drivers.length() == 0)
                $scope.data.getDrivers();
            if($scope.data.transports.length() == 0)
                $scope.data.getTransports();
            if($scope.data.users.length() == 0)
                $scope.data.getUsers();
            if($scope.data.divisions.length() == 0)
                $scope.data.getDivisions();
            if($scope.data.transportTypes.length() == 0)
                $scope.data.getTransportTypes();
            if($scope.data.transportSubtypes.length() == 0)
                $scope.data.getTransportSubtypes();
            if($scope.data.routes.length() == 0)
                $scope.data.getRoutes();
            $scope.getRequests();
            $scope.data.reports.clear();
            $scope.data.reports.addItem(new Report(1, "Отчет по отклоненным заявкам", true, true, false, $scope.data.currentUser.oblVid, "php/rejectsReport.php"));
            $scope.data.reports.addItem(new Report(2, "Обзор заявок по водителю", true, true, true, $scope.data.currentUser.oblVid, "php/daily-report-by-driver.php"));
            $scope.data.reports.addItem(new Report(3, "Обзор заявок за период", true, true, false, $scope.data.currentUser.oblVid, "php/requests-period-report.php"));
        });
    };
    $scope.getUserInfo();
    console.log($scope.data.requests.items);





    /* Выбор транспортной единицы и соответсвующих ей заявок */
    $scope.setActiveTransport = function(id){
        if($scope.id == id){
            $scope.selected = -1;
            //$scope.selected = id;
        } else
            $scope.selected = id; // изменение идентификатора текущей транспортной единицы
        //console.log($scope.activeTransportItems);
        $(".transportTab").each(function(index, value){
            $(value).removeClass("active");
        });
        $("#transport" + id).addClass("active");
        //$scope.$apply();
    };


    /*
    // Выбор дня, выборка заявок в соответсвтии с ним
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
    */

    /*
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
    */

    /*
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
    */

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
        console.log("id = " + id);
        angular.forEach($scope.data.requests.items, function(value, key){
            if(value.id == id){
                console.log("YES");
                $scope.currentRequest = value;
                $scope.setToEditMode(value.id);
            }
        });
        console.log($scope.currentRequest);
        $scope.showEditDialog();
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
        $scope.currentRequest.route.splice(routeId, 1);
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
            $scope.currentRequest.route.push($scope.newRoute);
            $scope.currentRequest.isChanged = true;
            $scope.inAddRouteMode = false;
            $scope.newRoute = "";
       }
    };



    $scope.saveChanges = function(requestId){
        var requestParams = {};
        //var value = value;
        //console.log(value.backupObject.tempStartDate);
        $scope.currentRequest.errors.time.splice(0, $scope.currentRequest.errors.time.length);
        $scope.currentRequest.errors.route.splice(0, $scope.currentRequest.errors.route.length);
        $scope.currentRequest.errors.transport.splice(0, $scope.currentRequest.errors.transport.length);
        $scope.currentRequest.errors.driver.splice(0, $scope.currentRequest.errors.driver.length);

        ///var startTime = $scope.currentRequest.tempStartTime.split(":");
        //var startTimeUnix = moment(value.backupObject.tempStartDate).hours(startTime[0].valueOf()).minutes(startTime[1].valueOf()).unix();
        ///var startTimeUnix = $scope.currentRequest.startTime;
        ///var endTime = $scope.currentRequest.tempEndTime.split(":");
        //var endTimeUnix = moment(value.backupObject.tempEndDate).hours(endTime[0].valueOf()).minutes(endTime[1].valueOf()).unix();
        ///var endTimeUnix = $scope.currentRequest.endTime;
        //console.log("startTime = " + moment.unix(startTimeUnix).format("DD.MM.YY HH:mm") + ", endTime = " + moment.unix(endTimeUnix).format("DD.MM.YY HH:mm"));
        //if(startTimeUnix > endTimeUnix){
        if(moment($scope.currentRequest.start).unix() > moment($scope.currentRequest.end).unix()){
            $scope.currentRequest.errors.time.push("Время прибытия не может быть раньше времени отправления");
        } else if(moment($scope.currentRequest.start).unix() == moment($scope.currentRequest.end).unix()){
            $scope.currentRequest.errors.time.push("Время прибытия не может равняться времени отправления");
        }

        var route = new String();
        if($scope.currentRequest.route.length != 0 && $scope.currentRequest.route.length > 1){
            angular.forEach($scope.currentRequest.route, function(routeItem, index){
                route = route + routeItem;
                if(index != $scope.currentRequest.route.length - 1)
                    route = route + ";";
            });
        } else if ($scope.currentRequest.route.length == 0) {
            $scope.currentRequest.errors.route.push("Вы не задали маршрут поездки");
        } else if ($scope.currentRequest.route.length == 1){
            $scope.currentRequest.errors.route.push("Маршрут не может состоять из одного элемента");
        }

        var transportId = -1;
        var transportTitle = $("#edit-dialog-transport").val();
        console.log("TRANSPORT_TITLE = " + transportTitle);
        var temp_transport = new TransportItem();
        angular.forEach($scope.data.transports.items, function(transport, trkey){
            if(transportTitle == transport.displayLabel){
                transportId = transport.id;
                temp_transport.fromAnother(transport);
                console.log("BINGO ID = " + transport.id);
                return;
                //value.backupObject.transportItem.fromAnother(transport);
                //console.log("item = " + transport.displayLabel + ", " + transport.id);
            }
        });

        if(transportTitle != "" && transportId == -1){
            $scope.currentRequest.errors.transport.push("Такой транспортной единицы нет в списке");
        }

        if(transportTitle == ""){
            transportId = 0;
            temp_transport.id = 0;
            temp_transport.model = "Не назначена";
        }
        console.log("TRANSPORT = " + transportId);


        var driverId = -1;
        var driverTitle = $("#edit-dialog-driver").val();
        var temp_driver = new Driver();
        angular.forEach($scope.data.drivers.items, function(driver, drkey){
            if(driverTitle == driver.fio){
                driverId = driver.id;
                temp_driver.fromAnother(driver);
                //console.log("driver = " + driver.fio + ", " + driver.id);
            }
        });
        if(driverTitle != "" && driverId == -1){
            $scope.currentRequest.errors.driver.push("Такого водителя нет в списке");
        }

        requestParams = {
            "requestId": $scope.currentRequest.id,
            "statusId": $scope.currentRequest.statusId,
            "reasonId": $scope.currentRequest.rejectReasonId,
            "startTime": moment($scope.currentRequest.start).unix(),
            "endTime": moment($scope.currentRequest.end).unix(),
            "route": route,
            "transportItem": transportId,
            "info": $scope.currentRequest.info,
            "driverId": driverId
        };


        if($scope.currentRequest.errors.time.length == 0 &&
           $scope.currentRequest.errors.route.length == 0 &&
           $scope.currentRequest.errors.transport.length == 0 &&
           $scope.currentRequest.errors.driver.length == 0){
            $http.post('php/saveChanges.php', requestParams).success(function(data){
                if(data == "success"){
                    //value.status.id = value.backupObject.status.id;
                    //value.status.rejectReasonId = value.backupObject.status.rejectReasonId;
                    //angular.forEach($scope.rejectReasonList, function(reason, rskey){
                    //    if(value.status.rejectReasonId == reason["REASON_ID"]){
                    //        value.status.rejectReasonTitle = reason["REASON_TITLE"];
                    //        value.backupObject.status.rejectReasonTitle = reason["REASON_TITLE"];
                    //    }
                    //});
                   // value.startTime = startTimeUnix;
                    //value.endTime = endTimeUnix;
                    //value.backupObject.tempStartDate = moment.unix(startTimeUnix).toDate();
                    //value.backupObject.tempStartTime = moment.unix(startTimeUnix).format("HH:mm");
                    //value.backupObject.tempEndDate = moment.unix(endTimeUnix).toDate();
                    //value.backupObject.tempEndTime = moment.unix(endTimeUnix).format("HH:mm");

                    //value.route.splice(0, value.route.length);
                    //$(value.backupObject.route).each(function(index, item){
                    //    value.route.push(item);
                    //});

                    //value.transportItem.fromAnother(temp_transport);
                    //value.driver.fromAnother(temp_driver);

                    //value.info = value.backupObject.info;

                    //value.inEditMode = false;
                    $scope.currentRequest.update();
                }
            });
        } else
            console.log("ERRORS!");






    };


};


/**  DRIVERS **/
function DriversCtrl($scope, $http, GlobalData, $location){
    $scope.data = GlobalData;
    $scope.currentDriver = new Driver();
    $scope.dailyReportDate = $scope.data.currentDate;
    $scope.search = "";
    $scope.sort = "+fio";
    $scope.data.inDriverMode = true;
    $scope.data.inTransportMode = false;


    /* Получает информацию о пользователе и загружает списки данных */
    $scope.getUserInfo = function(){
        if($scope.data.currentUser.id == 0){
            $http.post('php/getUserInfo.php').success(function(data){
                $scope.data.currentUser = new User();
                $scope.data.currentUser.fromJSON(data);
                if($scope.data.drivers.length() == 0)
                    $scope.data.getDrivers();
            });
        }
    };
    $scope.getUserInfo();

    // Удаляет водителя
    $scope.deleteDriver = function(driverId){
        $http.post('php/deleteDriver.php', {"id": driverId}).success(function(data){
            $scope.data.drivers.deleteItem(driverId);
            if($scope.currentDriver.id = driverId)
                $scope.currentDriver.id = 0;
        });
    };

    // Сохраняте изменения в БД
    $scope.saveChanges = function(driverId){
        var driver = $scope.data.drivers.findItemById(driverId);
        driver.errors.splice(0, driver.errors.length);
        if(driver.fio == "")
            driver.errors.push("Вы не ввели ф.и.о. водителя");

        if(driver.errors.length == 0){
            var requestParams = {
                "id" : driverId,
                "fio" : driver.fio,
                "phone" : driver.phone
            };
            $http.post('php/updateDriver.php', JSON.stringify(requestParams)).success(function(data){
                if(data == "success")
                    driver.done();
            });
        }
    };

    /* Отмечает выбранного водителя как текущего */
    $scope.setCurrentDriver = function(id){
        $scope.currentDriver = $scope.data.drivers.findItemById(id);
        $("#driversTable tr").each(function(index, element){
            $(element).removeClass("warning");
        });
        $("#driver" + id).addClass("warning");
    };

};


function UsersCtrl($scope, $http, GlobalData){
    $scope.data = GlobalData;
    $scope.divisions = new Collection();
    $scope.search = "";
    $scope.department = 1;
    $scope.division = 0;

    /* Получает информацию о пользователе и загружает списки данных */
    $scope.getUserInfo = function(){
        if($scope.data.currentUser.id == 0){
            $http.post('php/getUserInfo.php').success(function(data){
                $scope.data.currentUser = new User();
                $scope.data.currentUser.fromJSON(data);
                if($scope.data.users.length() == 0)
                    $scope.data.getUsers();
                if($scope.data.departments.length() == 0)
                    $scope.data.getDepartments();
                if($scope.data.divisions.length() == 0)
                    $scope.data.getDivisions();
            });
        }
    };
    $scope.getUserInfo();

    $scope.changeDepartment = function(){
        console.log("department changed");
        $scope.divisions.clear();
        angular.forEach($scope.data.divisions.items, function(division, key){
            if(division.departmentId == $scope.department){
                $scope.divisions.addItem(division);
                console.log("bingo");
            }

        });
        console.log($scope.divisions.items);
    };

    $scope.saveChanges = function(userId, departmentId, divisionId){
        $("#" + userId + " select").attr("disabled", "disabled");
        var requestParams = {
            "id": userId,
            "departmentId": departmentId,
            "divisionId": divisionId
        };
        console.log(requestParams);
        $http.post('php/saveChanges_users.php', requestParams).success(function(data){
            if(data == true){
                $("#" + userId + " select").removeAttr("disabled");
            }
        });
    };
};
