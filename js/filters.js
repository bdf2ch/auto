'use strict';

/* Filters */
angular.module('filters', [])
    .filter('hdate', function() {
        return function(input, type) {
            switch(type){
                case "dateTime": return moment(input).format("DD MMM HH:mm"); break;
                case "date": return moment.unix(input).format("DD MMM"); break;
                case "time": return moment(input).format("HH:mm"); break;
                case "fullDate" : return moment.unix(input).format("DD.MM.YY"); break;
                case "dayWeek" : return moment(input).format("DD MMM, ddd"); break;
                case "dayTitle" : return moment(input).format("dddd"); break;
                case "fullDay" : return moment(input).format("DD MMMM"); break;
                case "action": return moment(input, "DD.MM.YYYY").format("DD MMM YYYY"); break;
                case "megafull": return moment(input).format("DD MMM, dddd"); break;
                case "panoramadayheader": return moment(input).format("DD MMM, ddd"); break;
                case "unix": return moment(input).inix(); break;
                case "today": return moment(input).format("DD MMMM, dddd"); break;
            };
        };
    })
    .filter('transport', function(){
        return function(input, id){
            var requests = [];
            angular.forEach(input, function(request, index){
                if(request.transportItem.id == id){
                    requests.push(request);
                }
            });
            return requests;
        };
    })
    .filter('unsorted', function(){
        return function(input, date){
            var requests = [];
            angular.forEach(input, function(request, index){
                if(request.transportItemId == 0 && moment(request.start).dayOfYear() == moment(date).dayOfYear()){
                    //console.log("matched");
                    requests.push(request);
                }
            });
            return requests;
        };
    })
    .filter('sorted', function(){
        return function(input, transportId, day){
            var requests = [];
            angular.forEach(input, function(value, index){
                if(value.transportItemId == transportId){


                    var startOfTheDay = moment(day).hours(0).minutes(0);
                    var endOfTheDay = moment(day).hours(23).minutes(59);
                    //moment(endOfTheDay).hours(23);
                    //console.log("startoftheday = " + moment(startOfTheDay).format("DD.MM.YYYY HH:mm"));
                    //console.log("endoftheday = " + moment(endOfTheDay).format("DD.MM.YYYY HH:mm"));

                    // Начинается ранее, чем сегодня, заканчивается в течение дня
                    if(moment(value.start).unix() < moment(startOfTheDay).unix() &&
                        moment(value.end).unix() >= moment(startOfTheDay).unix() &&
                        moment(value.end).unix() <= moment(endOfTheDay).unix()){
                        //$scope.activeRequests.push(value);
                        //console.log("added 1," + value.id);
                        //temp_transport.fromAnother(value.transportItem);
                        requests.push(value);
                    }

                    // Начинается в течении дня, заканчивается в течение дня
                    if(moment(value.start).unix() >= moment(startOfTheDay).unix() &&
                        moment(value.end).unix() <= moment(endOfTheDay).unix()){
                        //$scope.activeRequests.push(value);
                        //console.log("added 2, " + value.id);
                        //temp_transport.fromAnother(value.transportItem);
                        requests.push(value);
                    }

                    // Начинается сегодня, заканчивается позднее, чем сегодня
                    if(moment(value.start).unix() >= moment(startOfTheDay).unix() &&
                        moment(value.start).unix() < moment(endOfTheDay).unix() &&
                        moment(value.end).unix() > moment(endOfTheDay).unix()){
                        //$scope.activeRequests.push(value);
                        //console.log("added 3, " + value.id);
                        //temp_transport.fromAnother(value.transportItem);
                        requests.push(value);
                    }


                    // Начинается ранее, чем сегодня, заканчивается позднее, чем сегодня
                    if(moment(value.start).unix() < moment(startOfTheDay).unix() &&
                        moment(value.end).unix() > moment(endOfTheDay).unix()){
                        //$scope.activeRequests.push(value);
                        //console.log("added 3, " + value.id);
                        //temp_transport.fromAnother(value.transportItem);
                        requests.push(value);
                    }



                    //console.log("matched");
                    //requests.push(request);
                }
            });
            return requests;
        };
    })
    .filter("range", function(GlobalData){
        return function(input, start, end, user, panorama){
            var requests = [];
            angular.forEach(input, function(request, index){
                if(GlobalData.inPanoramaMode){
                    if(GlobalData.inWeekMode){
                        // Начинается ранее, чем сегодня, заканчивается в течение дня
                        if(moment(request.start).unix() < moment(GlobalData.periodStart).unix() &&
                            moment(request.end).unix() >= moment(GlobalData.periodStart).unix() &&
                            moment(request.end).unix() <= moment(GlobalData.periodEnd).unix()){
                            requests.push(request);
                        }

                        // Начинается в течении дня, заканчивается в течение дня
                        if(moment(request.start).unix() >= moment(GlobalData.periodStart).unix() && moment(request.end).unix() <= moment(GlobalData.periodEnd).unix())
                            requests.push(request);

                        // Начинается сегодня, заканчивается позднее, чем сегодня
                        if(moment(request.start).unix() >= moment(GlobalData.periodStart).unix() &&
                            moment(request.start).unix() < moment(GlobalData.periodEnd).unix() &&
                            moment(request.end).unix() > moment(GlobalData.periodEnd).unix()){
                            requests.push(request);
                        }

                        // Начинается ранее, чем сегодня, заканчивается позднее, чем сегодня
                        if(moment(request.start).unix() < moment(GlobalData.periodStart).unix() && moment(request.end).unix() > moment(GlobalData.periodEnd).unix())
                            requests.push(request);


                        //if(moment(request.start).unix() >= moment(start).unix() && moment(request.start).unix() <= moment(end).unix())
                        //    requests.push(request);
                    } else {
                        var startOfTheDay = moment(GlobalData.currentMoment).hours(0).minutes(0);
                        var endOfTheDay = moment(GlobalData.currentMoment).hours(23).minutes(59);
                        moment(endOfTheDay).hours(23);

                        // Начинается ранее, чем сегодня, заканчивается в течение дня
                        if(moment(request.start).unix() < moment(startOfTheDay).unix() &&
                            moment(request.end).unix() >= moment(startOfTheDay).unix() &&
                            moment(request.end).unix() <= moment(endOfTheDay).unix()){
                            requests.push(request);
                        }

                        // Начинается в течении дня, заканчивается в течение дня
                        if(moment(request.start).unix() >= moment(startOfTheDay).unix() && moment(request.end).unix() <= moment(endOfTheDay).unix())
                            requests.push(request);

                        // Начинается сегодня, заканчивается позднее, чем сегодня
                        if(moment(request.start).unix() >= moment(startOfTheDay).unix() &&
                            moment(request.start).unix() < moment(endOfTheDay).unix() &&
                            moment(request.end).unix() > moment(endOfTheDay).unix()){
                            requests.push(request);
                        }

                        // Начинается ранее, чем сегодня, заканчивается позднее, чем сегодня
                        if(moment(request.start).unix() < moment(startOfTheDay).unix() && moment(request.end).unix() > moment(endOfTheDay).unix())
                            requests.push(request);
                    }
                } else {
                    if(GlobalData.inWeekMode){
                        if(moment(request.start).unix() >= moment(start) && moment(request.start).unix() <= moment(end))
                            requests.push(request);
                        //console.log(requests);
                    } else {
                        if(moment(request.start).unix() >= moment(start).unix() && moment(request.start).unix() <= moment(end).unix())
                            requests.push(request);
                    }
                }



                /*
                if(panorama && panorama == true){
                    var startOfTheDay = moment(GlobalData.currentMoment).hours(0).minutes(0);
                    var endOfTheDay = moment(GlobalData.currentMoment).hours(23).minutes(59);
                    moment(endOfTheDay).hours(23);

                    // Начинается ранее, чем сегодня, заканчивается в течение дня
                    if(moment(request.start).unix() < moment(startOfTheDay).unix() &&
                        moment(request.end).unix() >= moment(startOfTheDay).unix() &&
                        moment(request.end).unix() <= moment(endOfTheDay).unix()){
                        requests.push(request);
                    }

                    // Начинается в течении дня, заканчивается в течение дня
                    if(moment(request.start).unix() >= moment(startOfTheDay).unix() && moment(request.end).unix() <= moment(endOfTheDay).unix())
                        requests.push(request);

                    // Начинается сегодня, заканчивается позднее, чем сегодня
                    if(moment(request.start).unix() >= moment(startOfTheDay).unix() &&
                        moment(request.start).unix() < moment(endOfTheDay).unix() &&
                        moment(request.end).unix() > moment(endOfTheDay).unix()){
                        requests.push(request);
                    }

                    // Начинается ранее, чем сегодня, заканчивается позднее, чем сегодня
                    if(moment(request.start).unix() < moment(startOfTheDay).unix() && moment(request.end).unix() > moment(endOfTheDay).unix())
                        requests.push(request);

                } else {
                    if(GlobalData.inWeekMode){
                        if(moment(request.start).unix() >= moment(start).unix() && moment(request.start).unix() <= moment(end).unix())
                            requests.push(request);
                        console.log("selected " + requests.length + " requests");
                    } else {
                        if(moment(request.start).unix() >= moment(start).unix() && moment(request.start).unix() <= moment(end).unix())
                            requests.push(request);
                    }
                }
                */

            });
            //console.log(requests);
            return requests;
        };
    })
    .filter("transport", function(GlobalData){
        return function(input, id){
            //console.log("id = " + id);
            var requests = [];
            angular.forEach(input, function(request, index){
                if(request.transportItemId == id)
                    requests.push(request);
            });
            //console.log(requests);
            return requests;
        }
    })
    .filter("weekmode", function(GlobalData){
        return function(input, day){
            //console.log("day = " + day);
            var requests = [];
            angular.forEach(input, function(request, index){
                if(moment(request.start).unix() >= moment(day).hours(0).minutes(0).seconds(0).unix() && moment(request.start).unix() <= moment(day).hours(23).minutes(59).seconds(59).unix())
                    requests.push(request);
            });
            //console.log(requests);
            return requests;
        }
    })
    .filter("transportsubtype", function(GlobalData){
        return function(input, id){
            var items = [];
            if(id != -1){
                angular.forEach(input, function(item, index){
                    if(item.transportSubtypeId == id)
                        items.push(item);
                });
                return items;
            } else
                return input;
        }
    }).filter("user", function(GlobalData){
        return function(input, id){
            var requests = [];
            //GlobalData.myRequestsCount = 0;
            if(id != 0){
                angular.forEach(input, function(request, index){
                    if(request.userId == id)
                        requests.push(request);
                });
                return requests;
            } else
                return input;
    }
    }).filter("transportitem", function(GlobalData){
        return function(input, id){
        var requests = [];
        if(id != -1){
            angular.forEach(input, function(request, index){
                if(request.transportItemId == id)
                    requests.push(request);
            });
            return requests;
        } else
            return input;
    }
    }).filter("division", function(GlobalData){
        return function(input, id){
            var requests = [];
            if(id != 0){
                angular.forEach(input, function(request, index){
                    if(GlobalData.users.findItemById(request.userId).divisionId == id)
                        requests.push(request);

                });
                return requests;
            } else
                return input;
        }
    }).filter("driver", function(GlobalData){
        return function(input, id){
            var requests = [];
            if(id != -1){
                angular.forEach(input, function(request, index){
                    if(request.driverId == id)
                        requests.push(request);
                });
                return requests;
            } else
                return input;
        }
    }).filter("status", function(GlobalData){
        return function(input, id){
            var requests = [];
            if(id != 0){
                angular.forEach(input, function(request, index){
                    if(request.statusId == id)
                        requests.push(request);
                });
                return requests;
            } else {
                //console.log(requests.length);
                return input;
            }
        }
    }).filter("department", function(GlobalData){
        return function(input, id){
            var items = [];
            if(id != 0){
                angular.forEach(input, function(item, index){
                    if(item.departmentId == id)
                        items.push(item);
                });
                return items;
            } else
                return input;
        }
    }).filter("megafilter", function(GlobalData){
        return function(input, start, end, userId, divisionId, transportSubtypeId, transportItemId, driverId, statusId){
            var requests = [];
            //if(id != 0){
                angular.forEach(input, function(request, index){
                    if(userId != GlobalData.filters.findItemById(1).defaultValue &&
                       divisionId != GlobalData.filters.findItemById(2).defaultValue &&
                       transportSubtypeId != GlobalData.filters.findItemById(3).defaultValue &&
                       transportItemId != GlobalData.filters.findItemById(4).defaultValue &&
                       driverId != GlobalData.filters.findItemById(5).defaultValue &&
                       statusId != GlobalData.filters.findItemById(6).defaultValue){

                        if(request.startTime >= start && request.startTime <= end){
                            requests.push(request);
                        }
                    } else
                        return input;
                });
                //console.log("megafilter = " + requests.length);
                return requests;
        }
    }).filter("decimal", function(){
        return function(input){
            if(input < 10)
                return "0" + input;
            else
                return input;
        }
    })
    .filter('groupBy', function(GlobalData){
        return function(input, order){
            var requests = [];
            var users = new Collection();
            if(order){
                switch(order){
                    case -1:
                        return input;
                        break;
                    case 1:
                        /* Группировка по пользователям */
                        var user;
                        angular.forEach(GlobalData.activeUsers.items, function(user, key){
                            if(!user.requests)
                                user.requests = [];
                            else
                                user.requests.splice(0, user.requests.length);
                        });
                        angular.forEach(input, function(request, key){
                            user = GlobalData.activeUsers.findItemById(request.userId);
                            user.requests.push(request);
                        });
                        angular.forEach(GlobalData.activeUsers.items, function(user, key){
                            angular.forEach(user.requests, function(req, key) {
                                requests.push(req);
                            });
                        });

                        return requests;
                        break;
                    case 2:
                        /* Группировка по типу транспорта */
                        var transportSubtype;
                        angular.forEach(GlobalData.activeTransportSubtypes.items, function(subtype, key){
                            if(!subtype.requests)
                                subtype.requests = [];
                            else
                                subtype.requests.splice(0, subtype.requests.length);
                        });
                        angular.forEach(input, function(request, key){
                            transportSubtype = GlobalData.activeTransportSubtypes.findItemById(request.transportSubtypeId);
                            transportSubtype.requests.push(request);
                        });
                        angular.forEach(GlobalData.activeTransportSubtypes.items, function(subtype, key){
                            angular.forEach(subtype.requests, function(req, key) {
                                requests.push(req);
                            });
                        });
                        return requests;
                        break;
                    case 3:
                        /* Группировка по отделам */
                        var user;
                        var division;
                        angular.forEach(GlobalData.activeDivisions.items, function(division, key) {
                            if(!division.requests)
                                division.requests = [];
                            else
                                division.requests.splice(0, division.requests.length);
                        });
                        angular.forEach(input, function(request, key){
                            user = GlobalData.users.findItemById(request.userId);
                            division = GlobalData.activeDivisions.findItemById(user.divisionId);
                            division.requests.push(request);
                        });
                        angular.forEach(GlobalData.activeDivisions.items, function(division, key){
                            angular.forEach(division.requests, function(req, key) {
                                requests.push(req);
                            });
                        });
                        return requests;
                        break;
                    case 4:
                        /* Группировка по транспортной единице */
                        var transportItem;
                        angular.forEach(GlobalData.activeTransports.items, function(item){
                            if(!item.requests)
                                item.requests = [];
                            else
                                item.requests.splice(0, item.requests.length);
                        });
                        angular.forEach(input, function(request){
                            transportItem = GlobalData.activeTransports.findItemById(request.transportItemId);
                            transportItem.requests.push(request);
                        });
                        angular.forEach(GlobalData.activeTransports.items, function(item){
                            angular.forEach(item.requests, function(req) {
                                requests.push(req);
                            });
                        });
                        return requests;
                        break;
                    case 5:
                        /* Группировка по водителю */
                        var driver;
                        angular.forEach(GlobalData.activeDrivers.items, function(driver, key){
                            if(!driver.requests)
                                driver.requests = [];
                            else
                                driver.requests.splice(0, driver.requests.length);
                        });
                        angular.forEach(input, function(request, key){
                            driver = GlobalData.activeDrivers.findItemById(request.driverId);
                            driver.requests.push(request);
                        });
                        angular.forEach(GlobalData.activeDrivers.items, function(driver, key){
                            angular.forEach(driver.requests, function(req, key) {
                                requests.push(req);
                            });
                        });
                        return requests;
                        break;
                    case 6:
                        /* Группировка по статусу заявки */
                        var status;
                        angular.forEach(GlobalData.activeStatuses.items, function(status, key){
                            if(!status.requests)
                                status.requests = [];
                            else
                                status.requests.splice(0, status.requests.length);
                        });
                        angular.forEach(input, function(request, key){
                            status = GlobalData.activeStatuses.findItemById(request.statusId);
                            status.requests.push(request);
                        });
                        angular.forEach(GlobalData.activeStatuses.items, function(status, key){
                            angular.forEach(status.requests, function(req, key) {
                                requests.push(req);
                            });
                        });
                        return requests;
                        break;
                    default:
                        return input;
                        break;
                }
            }
        };
});