var EditableItem = function(){

    /* Конструктор объекта на основе другого объекта */
    EditableItem.prototype.fromAnother = function(another){
        if(another && typeof another == "object"){
            var properties = Object.keys(this);
            for(var property in another){
                if(properties.indexOf(property) != -1){
                    if(typeof another[property] != 'object'){
                        var current_property = Object.getOwnPropertyDescriptor(another, property);
                        Object.defineProperty(this, property, { value: current_property.value});
                    } else if(typeof another[property] == "object"){
                        for(var field in another[property]){
                            var current_property = Object.getOwnPropertyDescriptor(another[property], field);
                            Object.defineProperty(this[property], field, { value: current_property.value});
                        }
                    }
                }
            }
        }
    };

    /* Обновляет объект после изменения */
    EditableItem.prototype.update = function(){
        var properties = Object.keys(this);
        for(var property in this.backup){
            if(properties.indexOf(property) != -1){
                if(typeof this.backup[property] != 'object'){
                    var current_property = Object.getOwnPropertyDescriptor(this, property);
                    Object.defineProperty(this.backup, property, { value: current_property.value});
                } else if(typeof this.backup[property] == "object"){
                    for(var field in this[property]){
                        var current_property = Object.getOwnPropertyDescriptor(this[property], field);
                        Object.defineProperty(this.backup[property], field, { value: current_property.value});
                    }
                }
            }
        }
    };

    /* Восстанавливает объект из бэкапа */
    EditableItem.prototype.restoreBackup = function(){
        var obj = this;
        var properties = Object.keys(this);
        //console.log(properties);
        for(var property in this.backup){
            if(typeof this.backup[property] == "object"){
                for(var field in this.backup[property]){
                    var object_property = Object.getOwnPropertyDescriptor(obj.backup[property], field);
                    Object.defineProperty(obj[property], field, { value: object_property.value});
                }
            } else {
                if(properties.indexOf(property) != -1 && typeof this.backup[property] != "object"){
                    var current_property = Object.getOwnPropertyDescriptor(this.backup, property);
                    Object.defineProperty(this, property, { value: current_property.value});
                }
            }
        }
        console.log(this);
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


};



var Collection = function(){

    this.items = []; // Массив элементов коллекции

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
        for(var i = 0; i < this.items.length; i++){
            if(this.items[i].id == id)
                return this.items[i];
        }
    };

    /* Возвращает количество элементов в коллекции */
    Collection.prototype.length = function(){
        return this.items.length;
    };

    /* Удаляет все элементы из коллекции */
    Collection.prototype.clear = function(){
        this.items.splice(0, this.items.length);
    };

};




function Request(JSONdata){

    this.id = new Number();                   
    this.timeCreated = new String();          
	this.dateCreated = new String();
    this.user = new User();                   
    this.status = new RequestStatus();        
    this.transportTypeId = new Number();      
	this.transportSubTypeTitle = new String();
    this.transportItem = new TransportItem();  
	
	this.start = new Date();
	this.end = new Date();
	
	this.tempStartTime = new Date();
	this.tempStartDate = new Date();
    this.endTime = new Number();
    this.startTime = new Number();
    this.driver = new Driver;
    this.driverId = new Number();
    this.route = [];
    this.routeString = new String("");
	this.inAddRouteMode = new Boolean();
	this.backupObject = {};
	this.backupObject.driver = new Driver();
    this.backupObject.driverId = new Number();
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
		//transportSubTypeTypeId
		if(JSONdata["TRANSPORT_SUBTYPE_ID"] != null){	
			this.transportSubTypeId = JSONdata['TRANSPORT_SUBTYPE_ID'].valueOf();
			this.backupObject.transportSubTypeId = JSONdata['TRANSPORT_SUBTYPE_ID'].valueOf();
		} else {
			this.transportSubTypeId = 0;
			this.backupObject.transportSubTypeId = 0;
		}
		//transportSubTypeTitle
        this.transportSubTypeTitle = JSONdata["TRANSPORT_SUBTYPE_TITLE"];
		this.backupObject.transportSubTypeTitle = JSONdata["TRANSPORT_SUBTYPE_TITLE"];
		//stratTime
		if(JSONdata["START_TIME"] != null){
			this.start = moment.unix(JSONdata['START_TIME']).toDate();
			this.backupObject.start = moment.unix(JSONdata['START_TIME']).toDate();
		
			this.startTime = JSONdata['START_TIME'];
			this.tempStartDate = moment.unix(JSONdata['START_TIME']).format("DD.MM.YY");
			this.tempStartTime = moment.unix(JSONdata['START_TIME']).format("HH:mm");
			this.backupObject.startTime = JSONdata['START_TIME'];
			this.backupObject.tempStartDate = moment.unix(JSONdata['START_TIME']).toDate();
			this.backupObject.tempStartTime = moment.unix(JSONdata['START_TIME']).format("HH:mm");
		} else {
			this.startTime = 0;
			this.backupObject.startTime = 0;
			this.backupObject.tempStartDate = "0";
			this.backupObject.tempStartTime = "0";
		}
		//endTime
		if(JSONdata["END_TIME"] != null){
			this.end = moment.unix(JSONdata['END_TIME']).toDate();
			this.backupObject.end = moment.unix(JSONdata['END_TIME']).toDate();
		
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

            this.routeString = "<ol>";
            for(var i = 0; i < this.route.length; i++){
                this.routeString += "<li>" + this.route[i] + "</li>";
            }
            this.routeString += "</ol>";
		} else {
			this.route = [];
			this.backupObject.route = [];
		}
        //driver
        if(JSONdata["DRIVER_ID"] != undefined){
            this.driverId = JSONdata['DRIVER_ID'];
            this.backupObject.driverId = JSONdata['DRIVER_ID'];
        } else {
            this.driverId = 0;
            this.backupObject.driverId = 0;
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

    this.fromAnother = function(another){
        if(another && typeof another == "object"){
            this.id = another.id;
            this.timeCreated = another.timeCreated;
            this.dateCreated = another.dateCreated;
            this.user.fromAnother(another.user);
            this.status.fromAnother(another.status);
            this.transportTypeId = another.transportTypeId;
            this.transportSubTypeTitle = another.transportSubTypeTitle;
            this.transportItem.fromAnother(another.transportItem);
            this.info = another.info;

            this.start = another.start;
            this.end = another.end;

            this.tempStartTime = another.tempStartTime;
            this.tempStartDate = another.tempStartDate;
            this.endTime = another.endTime;
            this.driver.fromAnother(another.driver);
            this.backupObject = another.backupObject;
            this.backupObject.driver.fromAnother(another.driver);
            this.backupObject.transportItem.fromAnother(another.transportItem);
            this.backupObject.status.fromAnother(another.status);
        }
    };
	
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

    this.id = new Number(0);
    this.fio = new String();
    this.tempFio = new String();
    this.name = new String();
    this.fname = new String();
    this.surname = new String();
    this.phone = new String();
    this.tempPhone = new String();
    this.inEditMode = new Boolean(false);
    this.isChanged = new Boolean(false);
    this.backup = {};
    this.errors = [];

    // Конструктор объекта на основе JSON-данных
	this.fromJSON = function(JSONdata){
        //console.log(JSONdata);
		if(JSONdata != null){
			if(JSONdata["DRVR_ID"] != 0){
				this.id = JSONdata["DRVR_ID"];
                this.backup.id = JSONdata["DRVR_ID"];
            } else {
				this.id = 0;
                this.backup.id = 0;
                console.log("shit");
            }

			this.phone = JSONdata["PHONE"];
            this.backup.phone = JSONdata["PHONE"];
            this.tempPhone = JSONdata["PHONE"];

			this.fio = JSONdata["FIO"];
            this.backup.fio = JSONdata["FIO"];
            this.tempFio = JSONdata["FIO"];

			if(this.id != 0){
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

    // Конструктор объекта на основе другого объекта
	this.fromAnother = function(driver){
		if(typeof driver == 'object'){
			this.id = driver.id;
            this.backup.id = driver.id;
			this.phone = driver.phone;
            this.backup.phone = driver.phone;
			this.fio = driver.fio;
            this.backup.fio = driver.fio;
			this.surname = driver.surname;
            this.backup.surname = driver.surname;
			this.name = driver.name;
            this.backup.name = driver.name;
			this.fname = driver.fname;
            this.backup.fname = driver.fname;
		}
	};

    // Восстанавливает первоначальные данные из бэкапа
    this.restoreBackup = function(){
        this.phone = this.backup.phone;
        this.tempPhone = this.backup.phone;
        this.fio = this.backup.fio;
        this.tempFio = this.backup.fio;
        this.surname = this.backup.surname;
        this.name = this.backup.name;
        this.fname = this.backup.fname;
        this.isChanged = false;
        this.errors.splice(0, this.errors.length);
    };

}

function transportType(){
	this.id = new Number(0);
	this.subtypeId = new Number();
	this.title = new String();
	this.subtypeTitle = new String();
}

function TransportSubtype(){
	this.id = new Number();
	this.globalTypeId = new Number();
	this.title = new String();
	
	this.fromJSON = function(data){
		if(data != null){
			this.id = data["TRANSPORT_SUBTYPE_ID"];
			this.globalTypeId = data["TRANSPORT_SUBTYPE_GLOBAL"];
			this.title = data["TRANSPORT_SUBTYPE_TITLE"];
		}
	};
};

function TransportItem(){
    this.id = new Number(0);
    this.transportTypeId = new Number(0);
    this.transportTypeTitle = new String();
	this.transportSubTypeId = new Number(0);
	this.transportSubTypeTitle = new String();
    this.model = new String();
    this.gid = new String();
	this.department = new Number();
	this.departmentTitle = new String();
	this.displayLabel = new String();
	
	this.transportSubTypeId = 0;
	this.transportSubTypeTitle = "";
	
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
			if(JSONdata["ITEM_SUBTYPE_ID"] != null){
				this.transportSubTypeId = JSONdata["ITEM_SUBTYPE_ID"].valueOf();
				this.transportSubTypeTitle = JSONdata["TRANSPORT_SUBTYPE_TITLE"];
			}
			else {
				this.transportSubTypeId = 0;
				this.transportSubTypeTitle = "";
			}
			if(this.id != 0 && this.gid != null)
				this.displayLabel = "(" + JSONdata["ITEM_GID"] + ") " + JSONdata["ITEM_TITLE"];
			else if(this.id != 0 && this.gid == null)
				this.displayLabel = JSONdata["ITEM_TITLE"];
			else
				this.displayLabel = "Не назначена";
			if(JSONdata["DEP_ID"] != null){
				this.department = JSONdata["DEP_ID"].valueOf();
				this.departmentTitle = JSONdata["FULL_NAME"];
			}
			else { 
				this.department = 0;	
				this.departmentTitle = "";
			}
			
				
		}
	}
    
	this.fromAnother = function(item){
		if(typeof item == 'object'){
			this.id = item.id;
			this.transportTypeId = item.transportTypeId;
			this.transportTypeTitle = item.transportTypeTitle;
			this.transportSubTypeId = item.transportSubTypeId;
			this.model = item.model;
			this.gid = item.gid;
			this.department = item.department;
			this.departmentTitle = item.departmentTitle;
			this.displayLabel = item.displayLabel;

            this.backupObject = item.backupObject;
		}
	}
    
}

function RequestStatus(){
    this.NOT_APPROVED = 1;
    this.APPROVED = 2;
    this.REJECTED = 3;
    
    this.id = new Number(0);
    this.title = new String("");
    this.rejectReasonId = new Number(0);
    this.rejectReasonTitle = new String("");
    
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
    this.isAdmin = new Boolean(false);
    this.surname = new String();
    this.name = new String();
    this.fname = new String();
    this.phone = new String();
    this.position = new String();
    
	
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
				this.id = JSONdata["ID"].valueOf();
			else this.id = 0;
			if(JSONdata["OBL_VID"] != null)
				this.oblVid = JSONdata["OBL_VID"].valueOf();
			else this.oblVid = 1;
			if(JSONdata["ADMIN_DEP_ID"] != null){
				if(JSONdata["ADMIN_DEP_ID"] != 2)
					this.isAdmin = false;
				else if(JSONdata["ADMIN_DEP_ID"] == 2)
				 this.isAdmin = true;
			}
			   
			this.surname = JSONdata["FAM_NAME"];
			this.name = JSONdata["FST_NAME"];
			this.fname = JSONdata["LST_NAME"];
			this.oblVidTitle = JSONdata["FULL_NAME"];
            this.email = JSONdata["E_MAIL"];
            this.position = JSONdata["DOLZH"];
		}
	}
	
	this.fromAnother = function(user){
		if(typeof user == "object"){
			this.id = user.id;
			this.oblVid = user.oblVid;
			this.oblVidTitle = user.oblVidTitle;
			this.isAdmin = user.isAdmin;
			this.surname = user.surname;
			this.name = user.name;
			this.fname = user.fname;
			this.phone = user.phone;
            this.email = user.email;
            this.position = user.position;
		}
	};
};

function RequestTemplate(){
	this.transportTypeId = new Number();
	this.transportSubTypeId = new Number(1);
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
