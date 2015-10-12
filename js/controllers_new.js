'use strict';

function ListViewCtrl($scope, $http, $location, GlobalData) {
    $scope.data = GlobalData;
    $scope.showMyRequests = 0;
    $scope.typeahead = "";
    $scope.typeaheadValue = '';
    $scope.newRoute = "";
    $scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};
    $scope.fromAnotherUser = false;

    $scope.data.inDriverMode = false;
    $scope.data.inTransportMode = false;
    $scope.data.inPanoramaMode = false;

    $scope.tempDriver = new Driver();
    $scope.tempTransport = new TransportItem();

    $("#allRequestsLink").addClass("active");

    $scope.$watch("data.users.isLoaded", function(value){
        if (value === true) {
            //console.log("users loaded");
            $scope.data.getActiveUsers();
            $scope.data.getActiveDivisions();
            $scope.data.getActiveStatuses();
        }

    });

    //$scope.$watch("data.requests.items.length", function (val) {
        //console.log("length = " + val);
    //});

    $scope.$watch("data.requests.isLoaded", function (value) {
        if (value === true) {
            //console.log("requests loaded");
            $scope.data.getActiveTransportSubtypes();
            $scope.data.getActiveTransportItems();
            $scope.data.getActiveDrivers();
        }

    });

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
        //console.log(requestParams);
    };

    $scope.addRoute = function(requestId){
        var temp_route = $("#" + requestId + " #newRoute").val();
        //var temp_route = $("#" + requestId + " .autocompleteInput.route").val();
        //console.log(temp_route);
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

        //console.log( $scope.data.requests.findItemById(requestId).backup.route);
        //console.log( $scope.data.requests.findItemById(requestId).route);
    };

    /* Перемещает календарь на неделю вперед */
    $scope.next = function(){
        //if($scope.data.nextWeek() == true)
        if($scope.data.nextPeriod() == true)
            //$scope.getRequests();
            $scope.data.getRequests();
    };

    /* Перемещает календарь на неделю назад */
    $scope.previous = function(){
        //if($scope.data.prevWeek() == true)
        if($scope.data.prevPeriod() == true)
            //$scope.getRequests();
            $scope.data.getRequests();
    };

};


/****  Транспортные средства ****/
function SorterCtrl($scope, $http, GlobalData) {
    $scope.data = GlobalData;
    $scope.data.inDriverMode = false;
    $scope.data.inTransportMode = true;
    $scope.search = "";
    $scope.department = $scope.data.currentUser.oblVid;
    $scope.subtype = 0;

    $scope.saveChanges = function(transportId, typeId, subtypeId, departmentId){
        $("#transport" + transportId + " select").attr("disabled", "disabled");
        var requestParams = {
            action: "edit",
            id: transportId,
            transportTypeId: typeId,
            transportSubtypeId: subtypeId,
            departmentId: departmentId
        };
        $http.post('php/transport/transport.php', requestParams).success(function(data){
            if(data == true){
                $("#transport" + transportId + " select").removeAttr("disabled");
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
                //console.log(data);
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
                angular.forEach($scope.data.users.items, function(user, key){
                    if($(".otherUser").val() == user.surname + " " + user.name + " " + user.fname){
                        userId = user.id;
                        userDepartment = user.oblVid;
                        //console.log(user);
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
        else
            //console.log("type not found");
        //console.log("global Type ID = " + globalTypeId);

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
                    //console.log(data);
                    var temp_request = new Request();
                    temp_request.fromJSON(data);
                    temp_request.setupBackup();
                    $scope.data.requests.addItem(temp_request);
                    //.log($scope.data.requests.items);
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


    /*** Инициализация полей панельки отчетов ***/
    $("#reportstart").datetimepicker({
        language: "ru",
        format: "dd.mm.yyyy",
        weekStart: 1,
        minView: 'month',
        forceParse: true,
        todayHighlight: true,
        showMeridian: false,
        autoclose: true,
        todayBtn: false,
        pickerPosition: 'bottom-left'
    });

    $("#reportend").datetimepicker({
        language: "ru",
        format: "dd.mm.yyyy",
        weekStart: 1,
        minView: 'month',
        forceParse: true,
        todayHighlight: true,
        showMeridian: false,
        autoclose: true,
        todayBtn: false,
        pickerPosition: 'bottom-left'
    });



    /*** Показывает панелку добавления транспорта ***/
    $scope.showAddTransportForm = function(){
        $("#addTransportLink").addClass("disabled");
        $("#addTransportLayer").animate({"margin-top" : "115px"}, 500);
        $("#addTransportLayer").css("position", "fixed");
    };

    /*** Закрывает панельку добавления транспорта ***/
    $scope.cancelAddTransport = function(){
        $("#addTransportLink").removeClass("disabled");
        var height = ($("#addTransportLayer").height() + 22) * -1;
        $("#addTransportLayer").animate({"margin-top" : height}, 500);
        $scope.data.newTransport.errors.department.splice(0, $scope.data.newTransport.errors.department.length);
        $scope.data.newTransport.errors.model.splice(0, $scope.data.newTransport.errors.model.length);
        $scope.data.newTransport.errors.gid.splice(0, $scope.data.newTransport.errors.gid.length);
        $scope.data.newTransport.errors.subtype.splice(0, $scope.data.newTransport.errors.subtype.length);
        $scope.data.newTransport.model = "";
        $scope.data.newTransport.gid = "";
        $scope.data.newTransport.departmentId = 0;
        $scope.data.newTransport.transportSubtypeId = 0;
    };

    /*** Добавляет новую транспортную единицу ***/
    $scope.addTransport = function(){
        $scope.data.newTransport.errors.model.splice(0, $scope.data.newTransport.errors.model.length);
        $scope.data.newTransport.errors.gid.splice(0, $scope.data.newTransport.errors.gid.length);
        $scope.data.newTransport.errors.department.splice(0, $scope.data.newTransport.errors.department.length);
        $scope.data.newTransport.errors.subtype.splice(0, $scope.data.newTransport.errors.subtype.length);

        if($scope.data.newTransport.model == "")
            $scope.data.newTransport.errors.model.push("Вы не указали модель транспортного средства");
        if($scope.data.newTransport.gid == "")
            $scope.data.newTransport.errors.gid.push("Вы не указали регистрационный номер транспортного средства");
        if($scope.data.newTransport.departmentId == 0)
            $scope.data.newTransport.errors.department.push("Вы не выбрали производственное отделение, к которому относится транспортное средство");
        if($scope.data.newTransport.transportSubtypeId == 0)
            $scope.data.newTransport.errors.subtype.push("Вы не выбрали тип транспортного средства");

        if($scope.data.newTransport.errors.model.length == 0 && $scope.data.newTransport.errors.gid.length == 0 &&
           $scope.data.newTransport.errors.department.length == 0 && $scope.data.newTransport.errors.subtype.length == 0){
            var globalTransportTypeId = $scope.data.transportSubtypes.findItemById($scope.data.newTransport.transportSubtypeId).globalTypeId;
            var requestParams = {
                action: "add",
                model: $scope.data.newTransport.model,
                gid: $scope.data.newTransport.gid,
                departmentId: $scope.data.newTransport.departmentId,
                transportTypeId: globalTransportTypeId,
                transportSubtypeId: $scope.data.newTransport.transportSubtypeId
            };
            $http.post('php/transport/transport.php', requestParams).success(function(data){
                if(data && data != "fail"){
                    var temp_transport = new TransportItem();
                    temp_transport.fromJSON(data);
                    $scope.data.transports.addItem(temp_transport);
                    $scope.cancelAddTransport();
                }
            });
        }
    };


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

    //$scope.currentFilter = 4;


    $("#addRequestLink").css("display", "block");
    $("#driversLink").css("display", "inline-block");
    $("#addDriverLink").css("display", "none");

    $scope.data.inDriverMode = false;
    $scope.data.inPanoramaMode = true;

    //console.log("period start = " + $scope.data.periodStart);
    //console.log("period end = " + $scope.data.periodEnd);

    $scope.$watch('currentRequest.start', function(newValue, oldValue){
        //console.log("NR changed");
        $scope.currentRequest.calculatePanorama($scope.data.periodDays);
        $scope.currentRequest.calculateTimeline($scope.data.currentMoment);
        //$scope.currentRequest = newValue;
        //$scope.$digest();
    });

    $scope.$watch('currentRequest.end', function(newValue, oldValue){
        //console.log("NR changed");
        $scope.currentRequest.calculatePanorama($scope.data.periodDays);
        $scope.currentRequest.calculateTimeline($scope.data.currentMoment);
        //$scope.currentRequest = newValue;
        //$scope.$digest();
    });



    /* Перемещает календарь на неделю вперед */
    $scope.next = function(){
        if($scope.data.nextPeriod() == true)
            $scope.data.getRequests();
    };

    /* Перемещает календарь на неделю назад */
    $scope.previous = function(){
        if($scope.data.prevPeriod() == true)
            $scope.data.getRequests();
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


    // Убирает панель редактирования заявки
    $scope.hideEditDialog = function(){
        var dialog = $("#editDialog");
        if(dialog.css("left") == "0px")
            dialog.animate({"left": "-270px"}, 300);
        //$scope.currentRequest.isChanged = false;
       // $scope.setToViewMode($scope.currentRequest.id);

        $scope.currentRequest.setToChanged();
        $scope.currentRequest.cancelEditMode();
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
        //console.log("id = " + id);
        angular.forEach($scope.data.requests.items, function(value, key){
            if(value.id == id){
                //console.log("YES");
                $scope.currentRequest = value;
                $scope.currentRequest.setToEditMode();
            }
        });
        //console.log($scope.currentRequest);
        $scope.showEditDialog();
    };




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

        $scope.currentRequest.errors.time.splice(0, $scope.currentRequest.errors.time.length);
        $scope.currentRequest.errors.route.splice(0, $scope.currentRequest.errors.route.length);
        $scope.currentRequest.errors.transport.splice(0, $scope.currentRequest.errors.transport.length);
        $scope.currentRequest.errors.driver.splice(0, $scope.currentRequest.errors.driver.length);


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
        //console.log("TRANSPORT_TITLE = " + transportTitle);
        var temp_transport = new TransportItem();
        angular.forEach($scope.data.transports.items, function(transport, trkey){
            if(transportTitle == transport.displayLabel){
                transportId = transport.id;
                temp_transport.fromAnother(transport);
                //console.log("BINGO ID = " + transport.id);
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
        //console.log("TRANSPORT = " + transportId);


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
                    //$scope.currentRequest.update();
                    $scope.currentRequest.setupBackup();
                    $scope.hideEditDialog();
                    //$scope.currentRequest.calculatePanorama($scope.data.weekDays);
                    //$scope.data.requests.findItemById($scope.currentRequest.id).calculatePanorama($scope.data.weekDays);
                    //$scope.$apply();
                }
            });
        } //else
            //console.log("ERRORS!");






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
    //$scope.getUserInfo = function(){
    //    if($scope.data.currentUser.id == 0){
    //        $http.post('php/getUserInfo.php').success(function(data){
    //            $scope.data.currentUser = new User();
    //            $scope.data.currentUser.fromJSON(data);
    //            if($scope.data.drivers.length() == 0)
    //                $scope.data.getDrivers();
    //        });
    //    }
    //};
    //$scope.getUserInfo();

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
            $http.post('php/updateDriver.php', requestParams).success(function(data){
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

    $scope.changeDepartment = function(){
        //console.log("department changed");
        $scope.divisions.clear();
        angular.forEach($scope.data.divisions.items, function(division, key){
            if(division.departmentId == $scope.department){
                $scope.divisions.addItem(division);
                //console.log("bingo");
            }

        });
        //console.log($scope.divisions.items);
    };

    $scope.saveChanges = function(userId, departmentId, divisionId){
        $("#" + userId + " select").attr("disabled", "disabled");
        var requestParams = {
            "id": userId,
            "departmentId": departmentId,
            "divisionId": divisionId
        };
        //console.log(requestParams);
        $http.post('php/saveChanges_users.php', requestParams).success(function(data){
            if(data == true){
                $("#" + userId + " select").removeAttr("disabled");
            }
        });
    };
};
