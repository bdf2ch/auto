'use strict';

app.factory("GlobalData", ['$http', function($http){
    var utils = {};

    utils.currentDate = new Date();
    utils.currentMoment = new Date();
    utils.currentUser = new User();
    utils.weekStart = new Date();
    utils.weekEnd = new Date();
    utils.periodStart = new Date();
    utils.periodEnd = new Date();
    utils.weekDays = [];
    utils.periodDays = [];
    utils.isLoading = new Boolean(false);
    utils.newRequest = new RequestTemplate();
    utils.newRequest.startTime = "08:00";
    utils.newRequest.endTime = "12:00";
    utils.newDriver = new DriverTemplate();
    utils.currentReport = 0;
    utils.currentSubtype = 1;

    utils.hours = [
        "00", "01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12", "13",
        "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23"
    ];

    utils.periods = [];
    for(var i = 1; i < 97; i++){
        var period = {};
        if(i % 4 == 0)
            period.limit = true;
        utils.periods.push(period);
    }


    utils.activeTransports = new Collection();
    utils.activeUsers = new Collection();
    utils.activeTransportSubtypes = new Collection();
    utils.activeDivisions = new Collection();
    utils.activeDrivers = new Collection();
    utils.activeStatuses = new Collection();
    utils.rangeStart = new Date();
    utils.rangeEnd = new Date();


    /* Collections */
    utils.requests = new Collection();
    utils.statuses = new Collection();
    utils.drivers = new Collection();
    utils.transports = new Collection();
    utils.rejectReasons = new Collection();
    utils.routes = new Collection();
    utils.transportTypes = new Collection();
    utils.transportSubtypes = new Collection();
    utils.departments = new Collection();
    utils.divisions = new Collection();
    utils.users = new Collection();
    utils.reports = new Collection();
    utils.filters = new Collection();
    utils.messages = new Collection();

    utils.messages.addItem(new Message(
        {
            id: 1,
            type: "success",
            title: "Success",
            content: "Ваша заявка успешно добавлена",
            ttl: 300,
            date: new moment().unix()
        }
    ));

    utils.messages.addItem(new Message(
        {
            id: 2,
            type: "error",
            title: "Error",
            content: "В ходе работы системы возникла ошибка",
            ttl: 150,
            date: new moment().unix()
        }
    ));
    utils.messages.addItem(new Message(
        {
            id: 1,
            type: "warning",
            title: "Warning",
            content: "Предупреждение об опасности",
            ttl: 200,
            date: new moment().unix()
        }
    ));

    /* Templates */
    utils.newTransport = {
        transportSubtypeId: 0,
        model: "",
        gid: "",
        departmentId: 0,
        errors: {
            model: [],
            gid: [],
            department: [],
            subtype: []
        }
    };

    utils.driverFioList = new Array();
    utils.transportItemTitleList = new Array();
    utils.userFioList = new Array();
    utils.routeLabels = new Array();

    /* Filters */
    utils.currentFilter = 4;
    utils.currentGroup = -1;
    utils.myRequestsFilter = false;
    utils.myRequestsCount = 0;
    utils.filters.addItem(new Filter(
        {
            id: 1,
            title: "по заказчику",
            innerTitle: "user",
            target: "Заказчики",
            collection: utils.activeUsers,
            displayField: "fio",
            defaultValue: 0,
            sortBy: "title"
        }
    ));
    utils.filters.addItem(new Filter(
        {
            id: 2,
            title: "по типу транспорта",
            innerTitle: "transporttype",
            target: "Типы транспорта",
            collection: utils.activeTransportSubtypes,
            displayField: "title",
            defaultValue: -1
        }
    ));
    utils.filters.addItem(new Filter(
        {
            id: 3,
            title: "по структурному отделению",
            innerTitle: "division",
            target: "Структурные отделения",
            collection: utils.activeDivisions,
            displayField: "title",
            defaultValue: 0
        }
    ));
    utils.filters.addItem(new Filter(
        {
            id: 4,
            title: "по транспортной единице",
            innerTitle: "transportitem",
            target: "Транспортные единицы",
            collection: utils.activeTransports,
            displayField: "displayLabel",
            defaultValue: -1
        }
    ));
    utils.filters.addItem(new Filter(
        {
            id: 5,
            title: "по водителю",
            innerTtile: "driver",
            target: "Водители",
            collection: utils.activeDrivers,
            displayField: "fio",
            defaultValue: -1
        }
    ));
    utils.filters.addItem(new Filter(
        {
            id: 6,
            title: "по статусу заявки",
            innerTitle: "status",
            target: "Статусы заявки",
            collection: utils.activeStatuses,
            displayField: "title",
            defaultValue: 0
        }
    ));


    //console.log(utils.filters.items);
    //utils.filterUser = 0;
    //utils.filterTransportSubtype = -1;
    //utils.filterTransportItem = -1;
    //utils.filterDivision = 0;
    //utils.filterDriver = -1;
    //utils.filterStatus = 0;

    /* Mode triggers */
    utils.inDriverMode = false;
    utils.inTransportMode = false;
    utils.inPanoramaMode = false;
    utils.inPanoramaWeekMode = false;
    utils.inWeekMode = false;


    $("#report-start").datetimepicker({
        language: "ru",
        format: "dd.mm.yyyy",
        autoclose: true,
        minView: "month",
        maxView: "day"
    });
    $("#report-end").datetimepicker({
        language: "ru",
        format: "dd.mm.yyyy",
        autoclose: true,
        minView: "month",
        maxView: "day"
    });
    //console.log(utils.reports.items);

    /* Получает текущую дату на сервере */
    utils.getCurrentDate = function(){
        $http.post('php/getDate.php').success(function(data){
            if(data){
                utils.currentDate = moment.unix(data).hours(0).minutes(0).seconds(0).toDate();
                utils.currentMoment = moment.unix(data).hours(0).minutes(0).seconds(0).toDate();

                utils.rangeStart = new moment(utils.currentMoment).hours(0).minutes(0).seconds(0);
                utils.rangeEnd = new moment(utils.currentMoment).hours(23).minutes(59).seconds(59);



                var tempDate = moment(utils.currentDate);
                //console.log("day = " + tempDate.day());
                if(tempDate.day() == 1){
                    utils.weekStart = tempDate.hours(0).minutes(0).seconds(0).toDate();

                    //console.log("weekStart = " + moment(utils.weekStart).toDate());
                } else {
                    while(tempDate.day() != 1){
                        tempDate.add("days", -1);
                    }
                }


                var tempWeekStart = tempDate;
                utils.weekStart = moment(tempWeekStart).hours(0).minutes(0).toDate();
                //console.log("weekStart = " + utils.weekStart);
                var tempWeekEnd = new moment(tempDate);
                tempWeekEnd.add("days", 6);
                utils.weekEnd = moment(tempWeekEnd).hours(23).minutes(59).toDate();
                //console.log("weekEnd = " + utils.weekEnd);

                for(var i=0; i<=6; i++){
                    var day = new moment(tempDate);
                    utils.weekDays.push(day);
                    utils.weekDays[i].start = moment(day).hours(0).minutes(0).seconds(0).unix();
                    utils.weekDays[i].end = moment(day).hours(23).minutes(59).seconds(59).unix();
                    tempDate.add("days", 1);
                }

                /* PERIODS */
                utils.periodStart = moment.unix(data).hours(0).minutes(0).seconds(0).toDate();
                utils.periodEnd = moment(new moment(utils.periodStart)).add("days", 6).hours(23).minutes(59).seconds(59).toDate();

                var period = moment(moment.unix(data));
                for(var i = 0; i <= 6; i++){
                    var day = new moment(period);
                    utils.periodDays.push(moment(day).toDate());
                    utils.periodDays[i].start = moment(period).hours(0).minutes(0).seconds(0).unix();
                    utils.periodDays[i].end = moment(period).hours(23).minutes(59).seconds(59).unix();
                    period.add("days", 1);
                }

                utils.currentMoment = utils.currentDate;


                //console.log("period start = " + moment(utils.periodStart).format("DD.MM.YYYY HH:mm"));
                //console.log("period end = " + moment(utils.periodEnd).format("DD.MM.YYYY HH:mm"));
                //angular.forEach(utils.periodDays, function(day) {
                //    console.log("day start = " + moment.unix(day.start).format("DD.MM.YY HH:mm"));
                //    console.log("day end = " + moment.unix(day.end).format("DD.MM.YY HH:mm"));
                //});

            }
        });
    };

    /* Получает информацию о пользователе и загружает списки данных */
    utils.getUserInfo = function(){
        //if($scope.data.currentUser.id == 0){
        $http.post('php/getUserInfo.php').success(function(data){
            utils.currentUser = new User();
            utils.currentUser.fromJSON(data);
            //console.log($scope.data.currentUser);
            if(utils.statuses.length() == 0)
                utils.getStatuses();
            if(utils.rejectReasons.length() == 0)
                utils.getRejectReasons();
            if(utils.drivers.length() == 0)
                utils.getDrivers();
            if(utils.transports.length() == 0)
                utils.getTransports();
            if(utils.users.length() == 0)
                utils.getUsers();
            if(utils.divisions.length() == 0)
                utils.getDivisions();
            if(utils.transportTypes.length() == 0)
                utils.getTransportTypes();
            if(utils.transportSubtypes.length() == 0)
                utils.getTransportSubtypes();
            if(utils.routes.length() == 0)
                utils.getRoutes();
            if(utils.departments.length() == 0)
                utils.getDepartments();
            utils.getRequests();
            utils.reports.clear();
            utils.reports.addItem(new Report(
                {
                    id: 1,
                    title: "Отчет по отклоненным заявкам",
                    start: moment("12.01.2014 03:50", "DD.MM.YYYY HH:mm").toDate(),
                    end: moment("13.04.2014 03:50", "DD.MM.YYYY HH:mm").toDate(),
                    department: utils.currentUser.oblVid,
                    url: "php/rejectsReport.php"
                }
            ));
            utils.reports.addItem(new Report(
                {
                    id: 2,
                    title: "Обзор заявок по водителю",
                    start: true,
                    end: true,
                    driver: true,
                    department: utils.currentUser.oblVid,
                    url: "php/daily-report-by-driver.php"
                }
            ));
            utils.reports.addItem(new Report(
                {
                    id: 3,
                    title: "Обзор заявок за период",
                    start: true,
                    end: true,
                    department: utils.currentUser.oblVid,
                    url: "php/requests-period-report.php"
                }
            ));
            /*
            utils.reports.addItem(new Report(
                {
                    id: 4,
                    title: "График поездок на неделю",
                    start: utils.weekStart,
                    end: utils.weekEnd,
                    department: utils.currentUser.oblVid,
                    url: "php/reports/weekly-timetable-report.php"
                }
            ));
            */

            //console.log(utils.reports.items);
        });
        //} else
        //    $scope.getRequests();
    };

    /* Возвращает порядковый номер дня в году */
    utils.getDay = function(date){
        if(date)
            return moment(date).dayOfYear();
    };

    /* Выбирает текущий день дня и заявки в соответствии с ним в соответсвтии с ним, формирует списки фильтров */
    utils.setDay = function(day){
        if(utils.inPanoramaWeekMode == false){
            utils.currentMoment = day;
            //console.log(utils.currentMoment);
            utils.rangeStart = moment(day).hours(0).minutes(0).seconds(0);
            utils.rangeEnd = moment(day).hours(23).minutes(59).seconds(59);
           // console.log("start = " + moment(utils.rangeStart).format("DD.MM.YYYY HH:mm"));
            //console.log("end = " + moment(utils.rangeEnd).format("DD.MM.YYYY HH:mm"));

            utils.activeTransports.clear();
            angular.forEach(utils.requests.items, function(request, key){
                var startOfTheDay = moment(utils.currentMoment).hours(0).minutes(0);
                var endOfTheDay = moment(utils.currentMoment).hours(23).minutes(59);
                moment(endOfTheDay).hours(23);

                // Начинается ранее, чем сегодня, заканчивается в течение дня
                if(moment(request.start).unix() < moment(startOfTheDay).unix() &&
                    moment(request.end).unix() >= moment(startOfTheDay).unix() &&
                    moment(request.end).unix() <= moment(endOfTheDay).unix()){
                    if(utils.activeTransports.findItemById(request.transportItemId) == false){
                        utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId));
                    }
                }

                // Начинается в течении дня, заканчивается в течение дня
                if(moment(request.start).unix() >= moment(startOfTheDay).unix() &&
                    moment(request.end).unix() <= moment(endOfTheDay).unix()){
                    if(utils.activeTransports.findItemById(request.transportItemId) == false){
                        utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId));
                    }
                }

                // Начинается сегодня, заканчивается позднее, чем сегодня
                if(moment(request.start).unix() >= moment(startOfTheDay).unix() &&
                    moment(request.start).unix() < moment(endOfTheDay).unix() &&
                    moment(request.end).unix() > moment(endOfTheDay).unix()){
                    if(utils.activeTransports.findItemById(request.transportItemId) == false){
                        utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId));
                    }
                }

                // Начинается ранее, чем сегодня, заканчивается позднее, чем сегодня
                if(moment(request.start).unix() < moment(startOfTheDay).unix() &&
                    moment(request.end).unix() > moment(endOfTheDay).unix()){
                    if(utils.activeTransports.findItemById(request.transportItemId) == false){
                        utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId));
                    }
                }
                request.calculateTimeline(utils.currentMoment);

                //}
            });
            utils.getActiveTransportSubtypes();
            if(utils.activeTransportSubtypes.findItemById(utils.filterTransportSubtype) == false)
                utils.filterTransportSubtype = -1;
            utils.getActiveUsers();
            if(utils.activeUsers.findItemById(utils.filterUser) == false)
                utils.filterUser = 0;
            utils.getActiveDivisions();
            if(utils.activeDivisions.findItemById(utils.filterDivision) == false)
                utils.filterDivision = 0;
            utils.getActiveTransportItems();
            if(utils.activeTransports.findItemById(utils.filterTransportItem) == false)
                utils.filterTransportItem = -1;
            utils.getActiveDrivers();
            if(utils.activeDrivers.findItemById(utils.filterDriver) == false)
                utils.filterDriver = -1;
            utils.getActiveStatuses();
            if(utils.activeStatuses.findItemById(utils.filterStatus) == false)
                utils.filterStatus = 0;
        }

        //console.log(utils.activeTransports.items);
    };

    /* Получает заявки на текущую неделю */
    utils.getRequests = function(){
        utils.requests.isLoaded = false;
        utils.showLoading();
        var requestParams = {
            "department": utils.currentUser.oblVid,
            "start": moment(utils.periodStart).unix(),//moment(utils.weekStart).unix(),
            "end": moment(utils.periodEnd).unix()//moment(utils.weekEnd).unix()
        };
       // console.log(moment($scope.data.weekEnd).format("DD.MM.YYYY HH:mm"));
        $http.post('php/getRequestList.php', requestParams).success(function(data){
            utils.requests.clear();
            utils.myRequestsCount = 0;
            angular.forEach(data, function(request, key){
                var temp_request = new Request();
                temp_request.fromJSON(request);
                temp_request.calculatePanorama(utils.periodDays);
                temp_request.calculateTimeline(utils.currentMoment);
                temp_request.setupBackup();
                if(temp_request.userId == utils.currentUser.id)
                    utils.myRequestsCount++;
                utils.requests.addItem(temp_request);
            });
            utils.requests.isLoaded = true;
            utils.getActiveTransportSubtypes();
            utils.getActiveUsers();
            utils.getActiveDivisions();
            utils.getActiveTransportItems();
            utils.getActiveDrivers();
            utils.getActiveStatuses();
            utils.hideLoading();
            // console.log($scope.data.requests.items);
        });
    };

    /* Получает список пользователей, подавших заявки, для фильтра */
    utils.getActiveUsers = function(){
        utils.activeUsers.clear();
        if(utils.inWeekMode){
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.weekStart).unix() && request.startTime <= moment(utils.weekEnd).unix()){
                    if(utils.activeUsers.findItemById(request.userId) == false)
                        utils.activeUsers.addItem(utils.users.findItemById(request.userId));
                }
            });
        }
        angular.forEach(utils.requests.items, function(request, key){
            if(request.startTime >= moment(utils.rangeStart).unix() && request.startTime <= moment(utils.rangeEnd).unix()){
                if(utils.activeUsers.findItemById(request.userId) == false)
                    utils.activeUsers.addItem(utils.users.findItemById(request.userId));
            }
        });

        utils.activeUsers.items.sort(function(a, b){
            return (a.fio > b.fio);
        });
    };

    /* Получает список транспортных средств, назначенных на заявки, для фильтра */
    utils.getActiveTransportItems = function(){
        utils.activeTransports.clear();
        //if(!utils.inPanoramaMode){
            if(utils.inWeekMode){
                angular.forEach(utils.requests.items, function(request, key){
                    if(request.startTime >= moment(utils.weekStart).unix() && request.startTime <= moment(utils.weekEnd).unix()){
                        if(utils.activeTransports.findItemById(request.transportItemId) == false)
                            utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId))
                    }
                    if(request.startTime < moment(utils.weekStart).unix() && request.endTime > moment(utils.weekEnd).unix()){
                        if(utils.activeTransports.findItemById(request.transportItemId) == false)
                            utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId))
                    }
                    if(request.startTime >= moment(utils.weekStart).unix() && request.startTime <= moment(utils.weekEnd).unix() && request.endTime > moment(utils.weekEnd).unix()){
                        if(utils.activeTransports.findItemById(request.transportItemId) == false)
                            utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId))
                    }
                    if(request.startTime < moment(utils.weekStart).unix() && request.endTime >= moment(utils.weekStart).unix() && request.endTime <= moment(utils.weekEnd).unix()){
                        if(utils.activeTransports.findItemById(request.transportItemId) == false)
                            utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId))
                    }
                });
            } else {
                angular.forEach(utils.requests.items, function(request, key){
                    if(request.startTime >= moment(utils.rangeStart).unix() && request.startTime <= moment(utils.rangeEnd).unix()){
                        if(utils.activeTransports.findItemById(request.transportItemId) == false)
                            utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId))
                    }
                });
            }
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.rangeStart).unix() && request.startTime <= moment(utils.rangeEnd).unix()){
                    if(utils.activeTransports.findItemById(request.transportItemId) == false)
                        utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId))
                }
            });
            utils.activeTransports.items.sort(function(a, b){
                return (a.displayLabel > b.displayLabel);
        });

    };

    /* Получает список типов транспорта, на которые получены заявки, для фильтра */
    utils.getActiveTransportSubtypes = function(){
        utils.activeTransportSubtypes.clear();
        if(utils.inWeekMode){
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.weekStart).unix() && request.startTime <= moment(utils.weekEnd).unix()){
                    if(utils.activeTransportSubtypes.findItemById(request.transportSubtypeId) == false)
                        utils.activeTransportSubtypes.addItem(utils.transportSubtypes.findItemById(request.transportSubtypeId));
                }
            });
        } else {
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.rangeStart).unix() && request.startTime <= moment(utils.rangeEnd).unix()){
                    if(utils.activeTransportSubtypes.findItemById(request.transportSubtypeId) == false)
                        utils.activeTransportSubtypes.addItem(utils.transportSubtypes.findItemById(request.transportSubtypeId));
                }
            });
        }
        utils.activeTransportSubtypes.items.sort(function(a, b) {
            return (a.title > b.title);
        });
    };

    /* Получает список отделов, пользователи которых подали заявки, для фильтра */
    utils.getActiveDivisions = function(){
        utils.activeDivisions.clear();
        if(utils.inWeekMode){
            angular.forEach(utils.activeUsers.items, function(user, key){
                if(utils.activeDivisions.findItemById(user.divisionId) == false)
                    utils.activeDivisions.addItem(utils.divisions.findItemById(user.divisionId));
            });
        } else {
            angular.forEach(utils.activeUsers.items, function(user, key){
                if(utils.activeDivisions.findItemById(user.divisionId) == false)
                    utils.activeDivisions.addItem(utils.divisions.findItemById(user.divisionId));
            });
        }
        utils.activeDivisions.items.sort(function(a, b) {
            return (a.title > b.title);
        });
    };

    /* Получает список водителей, назначенных на заявки, для фильтра */
    utils.getActiveDrivers = function(){
        utils.activeDrivers.clear();
        if(utils.inWeekMode){
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.weekStart).unix() && request.startTime <= moment(utils.weekEnd).unix()){
                    if(utils.activeDrivers.findItemById(request.driverId) == false)
                        utils.activeDrivers.addItem(utils.drivers.findItemById(request.driverId));
                }
            });
        } else {
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.rangeStart).unix() && request.startTime <= moment(utils.rangeEnd).unix()){
                    if(utils.activeDrivers.findItemById(request.driverId) == false)
                        utils.activeDrivers.addItem(utils.drivers.findItemById(request.driverId));
                }
            });
        }
        utils.activeDrivers.items.sort(function(a, b) {
            return (a.fio > b.fio);
        });
    };

    /* Получает список статусов заявок, для фильтра */
    utils.getActiveStatuses = function(){
        utils.activeStatuses.clear();
        if(utils.inWeekMode){
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.weekStart).unix() && request.startTime <= moment(utils.weekEnd).unix()){
                    if(utils.activeStatuses.findItemById(request.statusId) == false)
                        utils.activeStatuses.addItem(utils.statuses.findItemById(request.statusId));
                }
            });
        } else {
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.rangeStart).unix() && request.startTime <= moment(utils.rangeEnd).unix()){
                    if(utils.activeStatuses.findItemById(request.statusId) == false)
                        utils.activeStatuses.addItem(utils.statuses.findItemById(request.statusId));
                }
            });
        }
        utils.activeStatuses.items.sort(function(a, b) {
            return (a.id > b.id);
        });
    };

    /* Сбрасывает все фильтры */
    utils.cancelFilters = function(){
        angular.forEach(utils.filters.items, function(filter, key){
            filter.filterValue = filter.defaultValue;
        });
        //utils.cancelGroup();
    };

    /* Сбрасывает группировку */
    utils.cancelGroup = function(){
        utils.currentGroup = -1;
    };


    /* Перемещает календарь на неделю вперед */
    utils.nextWeek = function(){
        var currentWeekStart = moment(utils.weekStart);
        currentWeekStart.add("weeks", 1);
        var day = moment(currentWeekStart);
        utils.weekDays.splice(0, utils.weekDays.length);
        for(var i = 1; i < 8; i++){
            utils.weekDays.push(moment(day));
            utils.weekDays[i-1].start = moment(day).hours(0).minutes(0).seconds(0).unix();
            utils.weekDays[i-1].end = moment(day).hours(23).minutes(59).seconds(59).unix();
            day.add("days", 1);
        }
        utils.weekEnd = moment(utils.weekDays[6]);
        utils.weekEnd = moment(utils.weekEnd).hours(23).minutes(59).seconds(59);
        utils.weekStart = currentWeekStart;
        //utils.rangeStart = utils.weekStart;
        //utils.rangeEnd = utils.weekEnd;
        if(moment(utils.weekStart).unix() > moment(utils.currentMoment).unix())
            utils.currentMoment = utils.setDay(utils.currentDate);

        utils.reports.findItemById(4).start = utils.weekStart;
        utils.reports.findItemById(4).end = utils.weekEnd;

        return true;
    };

    utils.nextPeriod = function(){
        var currentPeriodStart = moment(utils.periodStart);
        currentPeriodStart.add("week", 1);
        var day = moment(currentPeriodStart);
        utils.periodDays.splice(0, utils.periodDays.length);
        for(var i = 0; i <= 6; i++){
            utils.periodDays.push(moment(day));
            utils.periodDays[i].start = moment(day).hours(0).minutes(0).seconds(0).unix();
            utils.periodDays[i].end = moment(day).hours(23).minutes(59).seconds(59).unix();
            if(day == utils.currentDate)
                utils.setDay(moment(day).toDate());
            day.add("days", 1);
        }
        utils.periodEnd = moment(utils.periodDays[6]);
        utils.periodEnd = moment(utils.periodEnd).hours(23).minutes(59).seconds(59);
        utils.periodStart = currentPeriodStart;

        //if(moment(utils.periodStart).unix() > moment(utils.currentMoment).unix())
        //    utils.currentMoment = utils.setDay(moment(utils.periodDays[0]).toDate());


        //if(moment(utils.currentDate).unix() < moment(utils.periodStart).unix() || moment(utils.currentDate).unix() > moment(utils.periodEnd).unix()){
            //utils.currentMoment = utils.periodDays[0];
            utils.setDay(utils.periodDays[0]);
        //}

        
        //console.log(moment(utils.currentMoment).unix());

        //utils.reports.findItemById(4).start = utils.periodStart;
        //utils.reports.findItemById(4).end = utils.periodEnd;

        //console.log("current date = " + moment(utils.currentDate).unix());
        //console.log("period start = " + moment(utils.periodStart).unix());
        //console.log("period end = " + moment(utils.periodEnd).unix());
        //console.log("current moment day = " + utils.getDay(utils.currentMoment));
        //console.log("current date day = " + utils.getDay(utils.currentDate));
        //console.log("next week first day = " + utils.getDay(utils.periodDays[0]));

        return true;
    };

    /* Перемещает календарь на неделю назад */
    utils.prevWeek = function(){
        var currentWeekStart = moment(utils.weekStart);
        currentWeekStart.add("weeks", -1);
        var day = moment(currentWeekStart);
        utils.weekDays.splice(0, utils.weekDays.length);
        for(var i = 1; i < 8; i++){
            utils.weekDays.push(moment(day));
            utils.weekDays[i-1].start = moment(day).hours(0).minutes(0).seconds(0).unix();
            utils.weekDays[i-1].end = moment(day).hours(23).minutes(59).seconds(59).unix();
            if(new moment(day) == moment(utils.currentDate))
                utils.setDay(new moment(day).toDate());
            day.add("days", 1);
        }
        utils.weekEnd = moment(utils.weekDays[6]);
        utils.weekEnd = moment(utils.weekEnd).hours(23).minutes(59).seconds(59);
        utils.weekStart = currentWeekStart;
        //if(moment(utils.weekEnd).unix() < moment(utils.currentMoment).unix())
        //    utils.currentMoment = utils.setDay(utils.currentDate);
        utils.reports.findItemById(4).start = utils.weekStart;
        utils.reports.findItemById(4).end = utils.weekEnd;
        return true;
    };

    utils.prevPeriod = function(){
        var currentPeriodStart = moment(utils.periodStart);
        currentPeriodStart.add("weeks", -1);
        var day = moment(currentPeriodStart);
        utils.periodDays.splice(0, utils.periodDays.length);
        for(var i = 1; i < 8; i++){
            utils.periodDays.push(moment(day));
            utils.periodDays[i-1].start = moment(day).hours(0).minutes(0).seconds(0).unix();
            utils.periodDays[i-1].end = moment(day).hours(23).minutes(59).seconds(59).unix();
            day.add("days", 1);
        }
        utils.periodEnd = moment(utils.periodDays[6]);
        utils.periodEnd = moment(utils.periodEnd).hours(23).minutes(59).seconds(59);
        utils.periodStart = currentPeriodStart;
        //if(moment(utils.periodEnd).unix() < moment(utils.currentMoment).unix())
        //    utils.currentMoment = utils.setDay(utils.currentDate);

        //if(moment(utils.currentDate).unix() < moment(utils.periodStart).unix() || moment(utils.currentDate).unix() > moment(utils.periodEnd).unix()){
            //utils.currentMoment = moment(utils.periodDays[0]).toDate();
            utils.setDay(utils.periodDays[0]);
        //}

        //utils.reports.findItemById(4).start = utils.periodStart;
        //utils.reports.findItemById(4).end = utils.periodEnd;

        //console.log("current date = " + moment(utils.currentDate).unix());
        //console.log("period start = " + moment(utils.periodStart).unix());
        //console.log("period end = " + moment(utils.periodEnd).unix());
        //console.log("current moment day = " + utils.getDay(utils.currentMoment));
        //console.log("current date day = " + utils.getDay(utils.currentDate));
        //console.log("prev week first day = " + utils.getDay(utils.periodDays[0]));
        return true;
    };

    /* Получает список статусов заявки */
    utils.getStatuses = function(){
        utils.statuses.clear();
        $http.post('php/getStatusList.php').success(function(data){
            angular.forEach(data, function(status, key){
                var temp_status = new RequestStatus();
                temp_status.fromJSON(status);
                utils.statuses.addItem(temp_status);
            });
            //console.log(utils.statuses.items);
        });
    };

    /* Получает список причин отказа заявки */
    utils.getRejectReasons = function(){
        utils.rejectReasons.clear();
        $http.post('php/getRejectReasonList.php').success(function(data){
            angular.forEach(data, function(reason, key){
                var temp_reason = new RejectReason();
                temp_reason.fromJSON(reason);
                utils.rejectReasons.addItem(temp_reason);
            });
            //console.log(utils.rejectReasons.items);
        });
    };

    /* Получает список водителей */
    utils.getDrivers = function(){
        utils.drivers.clear();
        $http.post('php/getDriverList.php').success(function(data){
            angular.forEach(data, function(driver, key){
                var temp_driver = new Driver();
                temp_driver.fromJSON(driver);
                utils.drivers.addItem(temp_driver);
                utils.driverFioList.push(temp_driver.fio);
            });
        });
        //console.log(utils.drivers.items);
    };

    /* Получает список транспортных единиц */
    utils.getTransports = function(){
        utils.transports.clear();
        $http.post('php/getTransportItemList.php').success(function(data) {
            angular.forEach(data, function(transport, key){
                var temp_transport = new TransportItem();
                temp_transport.fromJSON(transport);
                //temp_transport.setupBackup();
                utils.transports.addItem(temp_transport);
                utils.transportItemTitleList.push(temp_transport.displayLabel);
            });
        });
        //console.log(utils.transports.items);
    };

    /* Получает список пунктов маршрута */
    utils.getRoutes = function(){
        utils.routes.clear();
        $http.post('php/getRouteList.php').success(function(data){
            angular.forEach(data, function(route, key){
                var temp_route = new Route();
                temp_route.fromJSON(route);
                utils.routes.addItem(temp_route);
                utils.routeLabels.push(temp_route.title);
            });
            //console.log(utils.routes.items);
        });
    };

    /* Получает список пользователей */
    utils.getUsers = function(){
        $http.post('php/getUserList.php').success(function(data){
            if(data != null){
                angular.forEach(data, function(user, key){
                    var temp_user = new User();
                    temp_user.fromJSON(user);
                    utils.users.addItem(temp_user);
                    utils.userFioList.push(temp_user.surname + " " + temp_user.name + " " + temp_user.fname);
                });
                utils.users.isLoaded = true;
            }
            //console.log(utils.users.items);
        });
    };

    /* Получает список глобальных типов транспорта */
    utils.getTransportTypes = function(){
        $http.post('php/getTransportTypeList.php').success(function(data) {
            if(data != "" && data != null){
                utils.transportTypes.clear();
                angular.forEach(data, function(type, key){
                    var temp_type = new TransportType();
                    temp_type.fromJSON(type);
                    utils.transportTypes.addItem(temp_type);
                });
                //console.log(utils.transportTypes);
            }
        });
    };

    /* Получает список подтипов транспорта */
    utils.getTransportSubtypes = function(){
        $http.post('php/getTransportSubtypeList.php').success(function(data) {
            if(data != "" && data != null){
                utils.transportSubtypes.clear();
                angular.forEach(data, function(subtype, key){
                    var temp_subtype = new TransportSubtype();
                    temp_subtype.fromJSON(subtype);
                    if(temp_subtype.id != 0)
                        utils.transportSubtypes.addItem(temp_subtype);
                });
                //console.log(utils.transportSubtypes.items);
            }
        });
    };

    /* Прлучает список производственных отделений */
    utils.getDepartments = function(){
        $http.post('php/getDepartments.php').success(function(data) {
            if(data != "" && data != null){
                angular.forEach(data, function(department, key){
                    var temp_department = new Department();
                    temp_department.fromJSON(department);
                    utils.departments.addItem(temp_department);
                });
                //console.log(utils.departments.items);
            }
        });
    };

    /* Прлучает список производственных отделений */
    utils.getDivisions = function(){
        $http.post('php/getDivisions.php').success(function(data) {
            if(data != "" && data != null){
                angular.forEach(data, function(division, key){
                    var temp_division = new Division();
                    temp_division.fromJSON(division);
                    utils.divisions.addItem(temp_division);
                });
                //console.log(utils.divisions.items);
            }
        });
    };

    utils.setRequestsFilter = function(){
        utils.myRequestsFilter = true;
        utils.filters.findItemById(1).filterValue = utils.currentUser.id;
        //console.log("userId = " + utils.requestsFilter);
        $("#").addClass("active");
        $("#allRequestsLink").removeClass("active");
    };

    utils.cancelRequestsFilter = function(){
        utils.myRequestsFilter = false;
        //utils.myRequestsCount = 0;
        utils.filters.findItemById(1).cancel();
        //console.log("userId = " + utils.requestsFilter);
        $("#myRequestsLink").removeClass("active");
        $("#allRequestsLink").addClass("active");
    };

    /* Подсчитывает неподтвержденные заявки в указанный день */
    utils.countUnapproved = function(day){
        var counter = 0;
        if(utils.inWeekMode){
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.weekStart).unix() && request.startTime <= moment(utils.weekEnd).unix() && request.statusId == 1 && request.isCanceled == false)
                    counter++;
            });
        } else {
            var period_start = moment(day).hours(0).minutes(0).seconds(0).unix();
            var period_end = moment(day).hours(23).minutes(59).seconds(59).unix();
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= period_start && request.startTime <= period_end && request.statusId == 1 && request.isCanceled == false)
                    counter++;
            });
        }
        return counter;
    };

    /* Подсчитывает все неотмененные заявки в указанный день */
    utils.countAll = function(day){
        var period_start = moment(day).hours(0).minutes(0).seconds(0).unix();
        var period_end = moment(day).hours(23).minutes(59).seconds(59).unix();
        var counter = 0;
        angular.forEach(utils.requests.items, function(request, key){
            if(request.startTime >= period_start && request.startTime <= period_end && request.isCanceled == false)
                counter++;
        });
        return counter;
    };

    /* Подсчитывает количество примененных фильтров */
    utils.countFilters = function(){
        var counter = 0;
        angular.forEach(utils.filters.items, function(filter, key){
            if(filter.id == 1){
                if(filter.filterValue == utils.currentUser.id){
                    if(!utils.myRequestsFilter)
                        counter++;
                } else {
                    if(filter.defaultValue != filter.filterValue)
                        counter++;
                }
            } else {
                if(filter.defaultValue != filter.filterValue)
                    counter++;
            }
        });
        if(utils.currentGroup != -1)
            counter++;
        return counter;
    };

    /* Подсчитывает заявки с не заданным транспортом в указанный день */
    utils.countWithoutTransport = function(day){
        var period_start = moment(day).hours(0).minutes(0).seconds(0).unix();
        var period_end = moment(day).hours(23).minutes(59).seconds(59).unix();
        var counter = 0;
        angular.forEach(utils.requests.items, function(request, key){
            if(request.startTime >= period_start && request.endTime <= period_end && request.transportItemId == 0)
                counter++;
        });
        return counter;
    };

    /**/
    utils.getDivisionRoute = function(divisionId){
        var route;
        var temp_route = utils.divisions.findItemById(divisionId);
        if(temp_route.parentId != 0){
            route = " / " + utils.getDivisionRoute(temp_route.id);
        }
        //console.log(route);
        return route;
    };

    utils.getDivision = function(id){
        if(utils.divisions.findItemById(id) != false)
            return utils.divisions.findItemById(id).title;
    };

    /* Показывает индикатор загрузки */
    utils.showLoading = function(){
        utils.isLoading = true;
        $("#loadingIndicator").css("display", "inline-block");
    };

    /* Скрывает индикатор загрузки */
    utils.hideLoading = function(){
        utils.isLoading = false;
        $("#loadingIndicator").css("display", "none");
    };

    /* Показывает панельку отчетов */
    utils.showReports = function(){
        if($("#editDialog").length > 0){
            var editDialog = $("#editDialog");
            if($(editDialog).position().left >= 0)
                $(editDialog).animate({"left" : "-270px"}, 300);
        }

        var filter = $("#filter");
        if($(filter).position().left >= 0)
            $(filter).animate({"left" : "-280px"}, 300);
        $("#filterLink").removeClass("active");

        var reports = $("#reports");
        if($(reports).position().left < 0)
            $(reports).animate({"left" : "0px"}, 300);
    };

    /* Скрывает панельку отчетов */
    utils.hideReports = function(){
        var reports = $("#reports");
        if($(reports).position().left >= 0)
            $(reports).animate({"left" : "-280px"}, 300);
        utils.currentReport = 0;
    };

    /* Показывает панельку фильтров */
    utils.showFilter = function(){

        if($("#editDialog").length > 0){
            var editDialog = $("#editDialog");
            if($(editDialog).position().left >= 0)
                $(editDialog).animate({"left" : "-270px"}, 300);
        }


        var reports = $("#reports");
        if($(reports).position().left >= 0)
            $(reports).animate({"left" : "-280px"}, 300);

        var filter = $("#filter");
        if($(filter).position().left < 0)
            $(filter).animate({"left" : "0px"}, 300);
        $("#filterLink").addClass("active");
    };

    /* Скрывает панельку фильтров */
    utils.hideFilter = function(){
        var filter = $("#filter");
        if($(filter).position().left >= 0)
            $(filter).animate({"left" : "-280px"}, 300);
        $("#filterLink").removeClass("active");
    };

    /* Переключает заявки в режим обзора заявок за день */
    utils.setToDayMode = function(){
        if(!utils.inTransportMode || !utils.inDriverMode){
            utils.inWeekMode = false;
            $("#weekLink").removeClass("active");
            $("dayLink").addClass("active");
            utils.activeTransports.clear();
            angular.forEach(utils.requests.items, function(request, key){
                if(request.startTime >= moment(utils.weekStart).unix() && request.endTime <= moment(utils.weekEnd).unix()){
                    if(utils.activeTransports.findItemById(request.transportItemId) == false && request.transportItemId != 0){
                        utils.activeTransports.addItem(utils.transports.findItemById(request.transportItemId));
                    }
                }
            });
            utils.getActiveUsers();
            utils.getActiveDivisions();
            utils.getActiveTransportItems();
            utils.getActiveTransportSubtypes();
            utils.getActiveDrivers();
            utils.getActiveStatuses();
        }
    };

    /* Переключает заявки в режим обзора заявок на неделю */
    utils.setToWeekMode = function(){
        if(!utils.inTransportMode || !utils.inDriverMode){
            utils.inWeekMode = true;
            $("#weekLink").removeClass("active");
            $("#dayLink").addClass("active");
            utils.getActiveUsers();
            utils.getActiveDivisions();
            utils.getActiveTransportItems();
            utils.getActiveTransportSubtypes();
            utils.getActiveDrivers();
            utils.getActiveStatuses();
        }
    };


    utils.getCurrentDate();
    utils.getUserInfo();
    return utils;
}]);

