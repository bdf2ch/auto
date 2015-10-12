'use strict';

this.cloneObject = function(source) {
    if(source != null && source != undefined){
        if(typeof source != "function"){
            if(typeof source == "boolean"){
                return source;
            }
            if(source.constructor ==  Array){
                return source.slice(0);
            } else if (source.constructor == Date){
                return new Date(source.getTime());
            }  else if (source.constructor == String){
                return source.slice(0);
            } else if (source.constructor == Number){
                return source.valueOf();
            } else if (source.constructor == Boolean){
                return new Boolean(source.toString());

            }  else {
                var newObj = (this instanceof Array) ? [] : {};
                for (var i in source) {
                    if (i == 'clone') continue;
                    if (source[i] && typeof source[i] == "object") {
                        newObj[i] = cloneObject(source[i]);
                    } else newObj[i] = source[i];
                }
                return newObj;
            }
        }
    }
};

var EditableItem = function(){

    /* Конструктор объекта на основе другого объекта */
    EditableItem.prototype.fromAnother = function(another){
        if(another && typeof another == "object"){
            for(var property in another){
                if(another[property] != null && typeof another[property] != "function"){
                    if(typeof another[property] != 'object'){
                        this[property] = another[property];
                    } else if(typeof another[property] == "object"){
                        this[property] = cloneObject(another[property]);
                    }
                }
            }
        }
    };

    /* Обновляет объект после изменения */
    EditableItem.prototype.update = function(){
        for(var property in this.backup){
            //this[property] = cloneObject(this.backup[property]); //!!!
            this[property] = cloneObject(this.backup[property]);
        }
    };

    /* Устанавливает бэкап объекта */
    EditableItem.prototype.setupBackup = function(){
        //console.log(this);
        var obj = this;
        //console.log("...");
        for(var field in this.backup){
            if(typeof field != "function"){
                this.backup[field] = cloneObject(this[field]);
            }
        };
        //console.log(this);
    };

    /* Восстанавливает объект из бэкапа */
    EditableItem.prototype.restoreBackup = function(){
        for(var property in this.backup){
            this[property] = cloneObject(this.backup[property]);
        }
    };

    /* Переводит элемент в режим редактирования */
    EditableItem.prototype.setToEditMode = function(){
        this.inEditMode = true;
    };

    /* Выводит элемент из режима редактироваия */
    EditableItem.prototype.cancelEditMode = function(){
        this.restoreBackup();
        this.inEditMode = false;
        this.isChanged = false;
    };

    /* Переводит элемент в режим удаления */
    EditableItem.prototype.setToDeleteMode = function(){
        this.inDeleteMode = true;
    };

    /* Выводит элемент из режима удаления */
    EditableItem.prototype.cancelDeleteMode = function(){
        this.inDeleteMode = false;
    };

    /* Отмечает элемент, как измененный */
    EditableItem.prototype.setToChanged = function(){
        this.isChanged = true;
    };

    EditableItem.prototype.done = function(){
        this.inEditMode = false;
        this.isChanged = false;
    };


};



var Collection = function(){

    this.items = []; // Массив элементов коллекции
    this.isLoaded = false;

    /* Добавляет элемент в коллекцию */
    Collection.prototype.addItem = function(item){
        if(item && item != null){
            this.items.push(item);
        }
    };

    /* Удаляет элемент из коллекции */
    Collection.prototype.deleteItem = function(id){
        if(id){
            for(var i = 0; i < this.items.length; i++){
                if(this.items[i].id == id)
                    this.items.splice(i, 1);
            }
        }
    };

    /* Находит элемент в коллекции по идентификатору */
    Collection.prototype.findItemById = function(id){
        var trigger = 0;
        for(var i = 0; i < this.items.length; i++){
            if(this.items[i].id == id){
                trigger++;
                return this.items[i];
            }
        }
        if(trigger == 0)
            return false;
    };

    /* Находит элемент по значению одного из полей */
    Collection.prototype.findItemByField = function(field, value){
        //var trigger = 0;
        for(var i = 0; i < this.items.length; i++){
            if(this.items[i].hasOwnProperty(field) && this.items[i][field] == value){
                //trigger++;
                return this.items[i];
            }
        }
        //if(trigger == 0)
            return false;
    };

    /* Возвращает количество элементов в коллекции */
    Collection.prototype.length = function(){
        return this.items.length;
    };

    /* Удаляет все элементы из коллекции */
    Collection.prototype.clear = function(){
        this.items.splice(0, this.items.length);
    };

    /* Возвращает массив с элементами коллекции */
    Collection.prototype.asArray = function(){
        return this.items;
    };

};




function Request(JSONdata){
    this.id = new Number(); //this.id = 0;
    this.userId = 0;
    this.statusId = 0;
    this.rejectReasonId = 0;
    this.transportTypeId = 0;
    this.transportSubtypeId = 0;
    this.transportItemId = 0;
    this.driverId = 0;

    this.timeCreated = new String();
    this.dateCreated = new String();
    this.start = new Date();
    this.end = new Date();
    this.route = [];
    this.endTime = new Number();
    this.startTime = new Number();
    this.routeString = new String();
    this.info = new String();
    this.isCanceled = false;
    this.inAddRouteMode = false;
    this.errors = {
        time: [],
        route: [],
        driver: [],
        transport: []
    };
    this.inEditMode = false;
    this.isChanged = false;

    this.backup = {
        statusId: new Number(),
        rejectReasonId: new Number(),
        transportTypeId: new Number(),
        transportSubtypeId: new Number(),
        transportItemId: new Number(),
        driverId: 0,
        start: new Date(),
        end: new Date(),
        startTime: new Number(),
        endTime: new Number(),
        route: [],
        info: new String(),
        isCanceled: false
    };

    this.panorama = [];
    this.timeline = [];
    this.obj = this;

    this.fromJSON = function(JSONdata){
        if(JSONdata != null && JSONdata != undefined && JSONdata != ""){
            this.id = JSONdata['REQUEST_ID'];
            this.userId = JSONdata['USER_ID'];
            this.statusId = JSONdata["STATUS_ID"];
            this.rejectReasonId = JSONdata["REASON_ID"];
            this.transportTypeId = JSONdata["TRANSPORT_TYPE_ID"];
            this.transportSubtypeId = JSONdata["TRANSPORT_SUBTYPE_ID"];
            this.transportItemId = JSONdata["TRANSPORT_ITEM_ID"];
            this.driverId = JSONdata["DRIVER_ID"];

            this.timeCreated = JSONdata['REQUEST_TIME'];
            this.dateCreated = JSONdata['REQUEST_DATE'];

            if(JSONdata["START_TIME"] != null){
                this.start = moment.unix(JSONdata['START_TIME']).toDate();
                this.startTime = JSONdata['START_TIME'];
            }

            if(JSONdata["END_TIME"] != null){
                this.end = moment.unix(JSONdata['END_TIME']).toDate();
                this.endTime = JSONdata['END_TIME'];
            }

            //route
            if(JSONdata["REQUEST_ROUTE"] != null){
                this.route = JSONdata['REQUEST_ROUTE'].toString().split(";");
                this.routeString = "<ol>";
                for(var i = 0; i < this.route.length; i++){
                    this.routeString += "<li>" + this.route[i] + "</li>";
                }
                this.routeString += "</ol>";
            }

            if(JSONdata["REQUEST_INFO"] != null)
                this.info = JSONdata['REQUEST_INFO'];

            if(JSONdata["REQUEST_REJECT_RECIEVED"] != null){
                if(JSONdata['REQUEST_REJECT_RECIEVED'] == 1)
                    this.isCanceled = true;
                else
                    this.isCanceled = false;
            }
        }
    };

    this.calculatePanorama = function(weekdays) {
        this.panorama.splice(0, this.panorama.length);
        var start = -1, end = -1;

        for(var w = 0; w < weekdays.length; w++){
            var day = weekdays[w];
        //weekdays.forEach(function(day, key, weekdays){

        // Начинается сегодня - заканчивается сегодня
        if(moment(this.start).unix() >= day.start && moment(this.start).unix() <= day.end && moment(this.end).unix() >= day.start && moment(this.end).unix() <= day.end) {
            //start = key;
            start = w;
            //end = key;
            end = w;
        }

        // Начинается ранее - заканчивается сегодня
        if(moment(this.start).unix() < day.start && moment(this.end).unix() >= day.start && moment(this.end).unix() <= day.end) {
            for(var x = 0; x < w; x++) {
                // Начинается сегодня
                if(moment(this.start).unix() >= weekdays[x].start && moment(this.start).unix() <= weekdays[x].end)
                    start = x;
            }
            if(start == -1)
                start = 0;
        }

        // Начинается сегодня - заканчивается позже
        if(moment(this.start).unix() >= day.start && moment(this.start).unix() <= day.end && moment(this.end).unix() > day.end) {
            //start = key;
            start = w;
            for(var i = w; i < weekdays.length; i++) {
                // Заканчивается сегодня
                if(moment(this.end).unix() >= weekdays[i].start && moment(this.end).unix() <= weekdays[i].end)
                    end = i;
            }
            if(end == -1)
                end = 6;
        }

        // Начинается ранее - заканчивается позже

        if(moment(this.start).unix() < day.start && moment(this.end).unix() > day.end) {
            for(var x = 0; x < w; x++) {
                // Начинается сегодня
                if(moment(this.start).unix() >= weekdays[x].start && moment(this.start).unix() <= weekdays[x].end)
                    start = x;
            }
            if(start == -1)
                start = 0;
            for(var i = w; i < weekdays.length; i++) {
                // Заканчивается сегодня
                if(moment(this.end).unix() > weekdays[i].start && moment(this.end).unix() < weekdays[i].end)
                    end = i;
            }
            if(end == -1)
                end = 6;
        }


        //}, this);
    }

        if(start > 0){
            for(var b = 0; b < start; b++){
                var cell = {};
                cell.colspan = 1;
                this.panorama.push(cell);
            }
        }

        var req = {};
        req.colspan = end - start + 1;
        req.notEmpty = true;
        if(moment(this.start).unix() < weekdays[0].start)
            req.earlier = true;
        else
            req.earlier = false;
        if(moment(this.end).unix() > weekdays[6].end){
            req.later = true;
            //console.log(request);
        } else
            req.later = false;
        this.panorama.push(req);

        if(end < 6){
            for(var a = end; a < 6; a++){
                var cell = {};
                cell.colspan = 1;
                this.panorama.push(cell);
            }
        }

        //console.log(this.id + ", start = " + start + ", end = " + end);

    };


    this.calculateTimeline = function(day){
        this.timeline.splice(0, this.timeline.length);
        var dayStart = moment(day).hours(0).minutes(0).seconds(0).unix();
        var dayEnd = moment(day).hours(23).minutes(59).seconds(59).unix();
        var tempHour = dayStart;
        var start = -1, end = -1;

        for(var h = 1; h < 97; h++){
            var periodStart = dayStart + ((h - 1) * 900);
            var periodEnd = periodStart + 900;

            // Начинается сегодня - заканчивается сегодня
            if(moment(this.start).unix() >= periodStart && moment(this.start).unix() <= periodEnd && moment(this.end).unix() >= periodStart && moment(this.end).unix() <= periodEnd){
                start = h;
                end = h;
                //console.log(this.id + " ,start now - end now");
            }

            // Начинается ранее - заканчивается сегодня
            if(moment(this.start).unix() < periodStart && moment(this.start).unix() < periodEnd && moment(this.end).unix() >= periodStart && moment(this.end).unix() <= periodEnd){
                end = h;
                //console.log(this.id + " ,start earlier - end now, h = " + h);
                for(var x = 1; x < h; x++){
                    var tempStart = dayStart + ((x - 1) * 900);
                    var tempEnd = tempStart + 900;
                    // Начинается сегодня
                    if(moment(this.start).unix() >= tempStart && moment(this.start).unix() <= tempEnd && moment(this.end).unix() <= tempEnd && moment(this.end).unix() > tempStart){
                        start = x;
                        //console.log("aaaa");
                    }

                }
                if(start == -1)
                    start = 1;
            }

            // Начинается сегодня - заканчивается позже
            if(moment(this.start).unix() >= periodStart && moment(this.start).unix() <= periodEnd && moment(this.end).unix() > periodEnd){
                //console.log(this.id + " ,start now - end later");
                start = h;
                for(var i = h; i < 97; i++){
                    var tempStart = dayStart + ((i - 1) * 900);
                    var tempEnd = tempStart + 900;
                    // Заканчивается сегодня
                    if(moment(this.end).unix() >= tempStart && moment(this.end).unix() <= tempEnd && moment(this.start).unix() <= tempStart && moment(this.start).unix() < tempEnd)
                        end = i;
                }
                if(end == -1)
                    end = 96;
            }

            // Начинается ранее - заканчивается позже
            if(moment(this.start).unix() < periodStart && moment(this.end).unix() > periodEnd){
                //console.log(this.id + " , all period");
                for(var x = 1; x < h; x++){
                    var tempStart = dayStart + ((x - 1) * 900);
                    var tempEnd = tempStart + 900;
                    // Начинается сегодня
                    if(moment(this.start).unix() >= tempStart && moment(this.start).unix() <= tempEnd)
                        start = x;
                }
                if(start == -1)
                    start = 1;
                for(var i = h; i < 97; i++){
                    var tempStart = dayStart + ((i - 1) * 900);
                    var tempEnd = tempStart + 900;
                    // Заканчивается сегодня
                    if(moment(this.end).unix() > tempStart && moment(this.end).unix() < tempEnd)
                        end = i;
                }
                if(end == -1)
                    end = 96;
            }
            //tempHour = tempHour * h;
        }

        if(start > 1){
            for(var b = 1; b < start; b++){
                var cell = {};
                cell.start = dayStart + ((b - 1) * 900);
                cell.end = cell.start + 900;
                cell.colspan = 1;
                cell.before = true;
                this.timeline.push(cell);
            }
        }

        var req = {};
        req.notEmpty = true;
        if(moment(this.start).unix() < dayStart && moment(this.end).unix() <= dayEnd){
            req.earlier = true;
            req.later = false;
            req.colspan = end - start;
        } else if(moment(this.start).unix() > dayStart && moment(this.end).unix() < dayEnd){
            req.colspan = end - start;
            req.earlier = false;
            req.later = false;
        } else if(moment(this.end).unix() > dayEnd && moment(this.start).unix() >= dayStart){
            req.colspan = end - start + 1;
            req.earlier = false;
            req.later = true;
        } else if(moment(this.start).unix() < dayStart && moment(this.end).unix() > dayStart && moment(this.end).unix() > dayEnd && moment(this.end).unix() > dayStart){
            req.earlier = true;
            req.later = true;
            req.colspan = 96;
        }
        this.timeline.push(req);

        if(end < 96){
            for(var a = end; a < 97; a++){
                var cell = {};
                cell.start = dayStart + ((a - 1) * 900);
                cell.end = cell.start + 900;
                cell.after = true;
                cell.colspan = 1;
                this.timeline.push(cell);
            }
        }

        //console.log("timeline: " + this.id + ", start = " + start + ", end = " + end);
    };

};
Request.prototype = new EditableItem();

function Driver(){
    this.id = 0;
    this.fio = new String();
    this.tempFio = new String();
    this.name = new String();
    this.fname = new String();
    this.surname = new String();
    this.phone = new String();
    this.tempPhone = new String();
    this.inEditMode = new Boolean(false);
    this.isChanged = new Boolean(false);
    this.backup = {
        id: 0,
        name: new String(),
        surname: new String(),
        fname: new String(),
        fio: new String(),
        tempFio: new String()
    };
    this.errors = [];

    // Конструктор объекта на основе JSON-данных
    this.fromJSON = function(JSONdata){
        if(JSONdata != null){
            if(JSONdata["DRVR_ID"] != null){
                this.id = JSONdata["DRVR_ID"];
                this.backup.id = JSONdata["DRVR_ID"];
            }


            this.phone = JSONdata["PHONE"];
            this.backup.phone = JSONdata["PHONE"];
            this.tempPhone = JSONdata["PHONE"];

            this.fio = JSONdata["FIO"];
            this.backup.fio = JSONdata["FIO"];
            this.tempFio = JSONdata["FIO"];

            if(this.id != 0 && this.fio != ""){
                var name_parts = this.fio.split(" ");
                this.surname = name_parts[0];
                this.backup.surname = name_parts[0];
                this.name = name_parts[1];
                this.backup.name = name_parts[1];
                this.fname = name_parts[2];
                this.backup.fname = name_parts[2];
            }
        }
    };
};
Driver.prototype = new EditableItem();

function TransportType(){
    this.id = 0;
    this.title = new String();

    this.fromJSON = function(JSONdata){
        if(JSONdata && JSONdata != null){
            this.id = JSONdata["TRANSPORT_ID"];
            this.title = JSONdata["TRANSPORT_TYPE_TITLE"];
        }
    };
}

function TransportSubtype(){
    this.id = 0;
    this.globalTypeId = 0;
    this.title = new String();

    this.fromJSON = function(JSONdata){
        if(JSONdata != null){
            this.id = JSONdata["TRANSPORT_SUBTYPE_ID"];
            this.globalTypeId = JSONdata["TRANSPORT_SUBTYPE_GLOBAL"];
            this.title = JSONdata["TRANSPORT_SUBTYPE_TITLE"];
        }
    };
};


function TransportItem(){
    this.id = 0;
    this.transportTypeId = 0;
    this.transportSubtypeId = 0;
    this.model = new String();
    this.gid = new String();
    this.departmentId = 0;
    this.departmentTitle = new String();
    this.displayLabel = new String();

    this.backup = {
        transportTypeId: new Number(),
        transportSubtypeId: new Number(),
        model: new String(),
        gid: new String(),
        departmentId: new Number()
    };

    this.fromJSON = function(JSONdata){
        if(JSONdata != null){
            this.id = JSONdata["ITEM_ID"];
            this.transportTypeId = JSONdata["ITEM_TYPE_ID"];
            this.model = JSONdata["ITEM_TITLE"];
            this.gid = JSONdata["ITEM_GID"];
            this.transportTypeTitle = JSONdata["TRANSPORT_TYPE_TITLE"];
            this.transportSubtypeId = JSONdata["ITEM_SUBTYPE_ID"];

            if(this.id != 0 && this.gid != null && this.gid != "")
                this.displayLabel = "(" + this.gid + ") " + this.model;
            else if(this.id != 0 && this.gid == null)
                this.displayLabel = this.model;
            else if(this.id != 0 && this.gid == "")
                this.displayLabel = this.model;
            else if(this.id == 0)
                this.displayLabel = "Не назначена";

            if(JSONdata["DEP_ID"] != null){
                this.departmentId = JSONdata["DEP_ID"];
                this.departmentTitle = JSONdata["FULL_NAME"];
            }
        }
    };
};
TransportItem.prototype = new EditableItem();

function RequestStatus(){
    this.id = 0;
    this.title = new String();

    this.fromJSON = function(JSONdata){
        if(JSONdata != null){
            this.id = JSONdata["STATUS_ID"];
            this.title = JSONdata["STATUS_TITLE"];
        }
    }

    this.fromAnother = function(status){
        if(typeof status == 'object' && status.constructor == RequestStatus){
            this.id = status.id;
            this.title = status.title;
        }
    }

}

function RejectReason(){
    this.id = 0;
    this.title = new String();

    this.fromJSON = function(JSONdata){
        if(JSONdata != null){
            this.id = JSONdata["REASON_ID"];
            this.title = JSONdata["REASON_TITLE"];
        }
    };

    this.fromAnother = function(reason){
        if(typeof reason == 'object' && reason.constructor == RejectReason){
            this.id = reason.id;
            this.title = reason.title;
        }
    };
}

function Route(){
    this.id = 0;
    this.title = new String;

    this.fromJSON = function(JSONdata){
        if(JSONdata && JSONdata != undefined){
            this.id = JSONdata["POINT_ID"];
            this.title = JSONdata["POINT_TITLE"];
        }
    };
};


function User(){
    this.id = new Number();
    this.oblVid = new Number();
    this.oblVidTitle = new String();
    this.isAdmin = new Boolean(false);
    this.surname = new String();
    this.name = new String();
    this.fname = new String();
    this.phone = new String();
    this.fio = new String();
    this.position = new String();
    this.divisionId = 0;


    this.id = 0;
    this.oblVid = 0;
    this.oblVidTitle = "";
    //this.isAdmin = false;
    this.surname = "";
    this.name = "";
    this.fname = "";
    this.phone = "";
    this.email = "";


    this.fromJSON = function(JSONdata){
        if(JSONdata != null){
            if(JSONdata["ID"] != null)
                this.id = JSONdata["ID"];
            else this.id = 0;
            if(JSONdata["OBL_VID"] != null)
                this.oblVid = JSONdata["OBL_VID"];
            else this.oblVid = 1;
            if(JSONdata["DIVISION_ID"] != null)
                this.divisionId = JSONdata["DIVISION_ID"];
            if(JSONdata["ADMIN_DEP_ID"] != null){
                if(JSONdata["ADMIN_DEP_ID"] != 2)
                    this.isAdmin = false;
                else if(JSONdata["ADMIN_DEP_ID"] == 2)
                    this.isAdmin = true;
                if(this.id == 984)
                    this.isAdmin = true;
            }

            this.surname = JSONdata["FAM_NAME"];
            this.name = JSONdata["FST_NAME"];
            this.fname = JSONdata["LST_NAME"];
            this.fio = this.surname + " " + this.name + " " + this.fname;
            this.oblVidTitle = JSONdata["FULL_NAME"];
            this.email = JSONdata["E_MAIL"];
            this.position = JSONdata["DOLZH"];
        }
    }

    //this.fromAnother = function(user){
    //    if(typeof user == "object"){
    //        this.id = user.id;
    //        this.oblVid = user.oblVid;
    //        this.oblVidTitle = user.oblVidTitle;
    //        this.isAdmin = user.isAdmin;
    //        this.surname = user.surname;
    //        this.name = user.name;
    //        this.fname = user.fname;
    //        this.phone = user.phone;
    //        this.email = user.email;
    //        this.position = user.position;
    //    }
    //};
};
User.prototype = new EditableItem();

function Department(){
    this.id = 0;
    this.title = new String();

    this.fromJSON = function(JSONdata){
        if(JSONdata && JSONdata != null){
            this.id = JSONdata["OV_ID"];
            this.title = JSONdata["FULL_NAME"];
        }
    };
};

function Division(){
    this.id = 0;
    this.title = new String();
    this.parentId = 0;
    this.departmentId = 0;

    this.fromJSON = function(JSONdata){
        if(JSONdata && JSONdata != null){
            this.id = JSONdata["DIVISION_ID"];
            this.parentId = JSONdata["PARENT_DIVISION_ID"];
            this.departmentId = JSONdata["DEPARTMENT_ID"];
            this.title = JSONdata["DIVISION_TITLE"];
        }
    };
};

function RequestTemplate(){
    this.transportTypeId = 0;
    this.transportSubTypeId = 1;
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

function DriverTemplate(){
    this.fio = new String();
    this.errors = [];
};


function Report(parameters){
    this.id = new Number();
    this.title = new String();
    this.start = new Boolean(false);
    this.end = new Boolean(false);
    this.driver = false;
    this.department = 0;
    this.url = new String();

    if(parameters){
        for(var option in parameters){
            if(this.hasOwnProperty(option)){
                switch(option){
                    case "start":
                        if(parameters["start"] == true)
                            this.start = new Date();
                        if(parameters[option] instanceof Date)
                            this.start = parameters["start"];
                        break;
                    case "end":
                        if(parameters["end"] == true)
                            this.end = new Date();
                        if(parameters["end"] instanceof Date)
                            this.end = parameters["end"];
                        break;
                    default:
                        this[option] = parameters[option];
                        break;
                }
            }
        }
    }

    this.setUrl = function(){
        var url = this.url;
        if(this.start != false){
            url += "?start=";
            url += moment(this.start).hours(0).minutes(0).seconds(0).unix();
        }
        if(this.end != false){
            url += "&end=";
            url += moment(this.end).hours(23).minutes(59).seconds(59).unix();
            //console.log();
        }
        if(this.driver != false){
            url += "&driver=";
            url += this.driver;
        }
        if(this.department != false){
            url += "&department=";
            url += this.department;
        }

        return url;
    };

    this.isCorrect = function(){
        if(this.start != false && this.end != false && this.driver != false){
            if(moment(this.start).hours(0).minutes(0).seconds(0).unix() < moment(this.end).hours(23).minutes(59).seconds(59).unix() && this.driver != true)
                return true;
            else
                return false;
        }
        if(this.start != false && this.end != false && this.driver == false){
            if(moment(this.start).hours(0).minutes(0).seconds(0).unix() < moment(this.end).hours(23).minutes(59).seconds(59).unix())
                return true;
            else
                return false;
        }
        if(this.start != false && this.end == false && this.driver == false){
                return true;
        }
    };
};


function Filter(parameters){
    this.id = 0;
    this.title = new String();
    this.innerTitle = "";
    this.target = new String();
    this.collection = null;
    this.displayField = "";
    this.defaultValue = new Number();
    this.filterValue = new Number();
    this.sortBy = "";

    if(parameters){
        for(var option in parameters){
            if(this.hasOwnProperty(option)){
                switch(option){
                    case "defaultValue":
                        this["defaultValue"] = parameters[option];
                        this["filterValue"] = parameters[option];
                        break;
                    case "sortBy":
                        if(this.hasOwnProperty(option.valueOf()))
                            this["sortBy"] = parameters[option];
                        break;
                    default:
                        this[option] = parameters[option];
                        break;
                }
            }
        }
    }
    //console.log(this);
};
Filter.prototype.cancel = function(){
    this.filterValue = this.defaultValue;
};


function Message(parameters){
    this.id = 0;
    this.type = "default";
    this.title = "";
    this.content = "";
    this.date = 0;
    this.ttl = 60;

    if(parameters){
        for(var option in parameters){
            if(this.hasOwnProperty(option)){
                switch(option){
                    default:
                        this[option] = parameters[option];
                        break;
                }
            }
        }
    }
};
