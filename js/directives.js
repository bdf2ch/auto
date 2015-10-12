'use strict';

// no console

/* Directives */
angular.module("directives", [])
    .directive('hdate', function($filter) {
	return {
		require: 'ngModel',
		//restrict: 'E',
		//scope: { ngModel: '=' },
		link: function(scope, element, attr, ctrl){
			var type = attr.hdate;
			ctrl.$formatters.push(function(modelValue){	
				switch(type){
					case "dateTime": return moment.unix(modelValue).format("DD MMM HH:mm");
						break;
					case "date": return moment.unix(modelValue).format("DD MMM");
						break;
					case "time": return moment.unix(modelValue).format("HH:mm");
						break;         
					case "fullDate" : return moment.unix(modelValue).format("DD.MM.YY");
						break; 
				}
			});
			
			ctrl.$parsers.unshift(function(viewValue){
				if(moment(viewValue, "DD.MM.YY").isValid()){
					//switch(type){
					//	case "date": return
					//}
				// it is valid
				//ctrl.$setValidity('hdate', true);
				//return moment(viewValue, "DD.MM.YY").unix();
				
				//console.log(scope.request.id);
				return "000222333";
				//console.log("valid");
				} else
					return "";
			});
	  
		}
	};
}).directive('keyFocus', function(){
	return {
		restrict: 'A',
		link:   function(scope, elem, attrs){
					//elem.bind('keydown', function(e){
					//	if (e.keyCode == 13){
					//		alert("enter pressed");
					//	}
					//});
					
					elem.on('keydown', function (e) {
						if (e.keyCode === 38){
							e.preventDefault();
							alert("enter");
						}
					});
			    }
			};
}).directive('transportitem', function() {
	return {
		require: 'ngModel',
		//restrict: 'E',
		//scope: { ngModel: '=' },
		link: function(scope, element, attr, ctrl){
			//var gscope = angular.element(element).scope();
			ctrl.$formatters.push(function(modelValue){	
				angular.forEach(scope.root.transportItemList, function(value, index){
					if(value.id == modelValue){
						return ("(" + value.gid + ") " + value.model);
						//console.log(value.id);
					}
				});
			});
			
			ctrl.$parsers.unshift(function(viewValue){
				
			});
	  
		}
	}
});
	
	app.directive('dateTimePicker', ['GlobalData', function(gd){
  return {
    restrict: 'E',
    replace: true,
    //scope: {
    //    
    //},
	//require: "?ngModel",
    template: 
		  //'<div class="input-append date" id="datetimepicker" data-date="12-02-2012" data-date-format="dd-mm-yyyy">'+
    '<input size="16" type="text" class="dateTime" >',
    //'<span class="add-on"><i class="icon-remove"></i></span>'+
    //'<span class="add-on"><i class="icon-th"></i></span></div>' ,
	 //compile: function compile(tElement, tAttrs, transclude) {
     // return {
    //    pre: function preLink(scope, iElement, iAttrs, controller){
	//		if(iAttrs.id){
	//			$(iElement).attr("id", iAttrs.id);
	//		}
//		}
 //     }
  //  },
	
    link: function(scope, element, attrs){
		if(attrs.id){
			$(element).attr("id", attrs.id);
		}
		
		element.bind('$create', function() {
			element.datetimepicker({
				format: "dd.mm.yy hh:ii",
				weekStart: 1,
				forceParse: true,
				todayHighlight: true,
				showMeridian: false,
				autoclose: true,
				todayBtn: true,
				pickerPosition: 'bottom-left',
				minuteStep: 15,
				initialDate: moment(gd.currentDate).format("DD.MM.YY HH:mm")
			});
      });
	//scope.$watch("data", function(value){
	//	scope.data = value;
	//});
	//console.log("data = " + ngModel);
	//if(scope.data == undefined){
	//	gd.getCurrentDate();
	//}
	
	//ngModel.$parsers.push(function(value){
	//	return moment(value).format("DD.MM.YY HH:mm");
	//});
	
	//ngModel.$formatters.push(function(value){
	//	return moment(value).toDate();
	//});
		
        var input = element.find('input');
	//	console.log("controller = " + ngModel);
		
	//	ngModel.$render = function(){
	//		console.log("render");
	//		$(input).val(moment(scope.data).format("DD.MM.YY HH:mm"));
	//	};
		
	//ngModel.$parsers.push(function(value){
	//	if(typeof value = 'Date')
	//		return moment(value).format("DD.MM.YY  hh:mm");
	//});	
		
      element.datetimepicker({
        format: "dd.mm.yy hh:ii",
		weekStart: 1,
		forceParse: true,
		todayHighlight: true,
        showMeridian: false,
        autoclose: true,
        todayBtn: true,
        pickerPosition: 'bottom-left',
		minuteStep: 15,
		initialDate: moment(gd.currentDate).format("DD.MM.YY HH:mm")
      });
	  
	  $(element).attr("value", moment(gd.currentDate).format("DD.MM.YY HH:mm"));
	  
	  //console.log("date = " + gd.currentDate)
  
      $(element).datetimepicker('setStartDate', moment(gd.currentDate).format("DD.MM.YY HH:mm"));
	  
	  if(scope.id=="newRequestStartDate"){
		$("#newRequestEndDate").timepicker('setStartDate', moment($(element).val(), "DD.MM.YY HH:mm"));
	  }
	  
      element.bind('blur keyup change', function() {
		//ngModel.$setViewValue(moment(element.val(), "DD.MM.YY HH:mm").toDate());
		//console.log(moment($(element).val(), "DD.MM.YY HH:mm").toDate());
        //scope.$apply(read);
		if(attrs.id && attrs.id == "newRequestStartTime"){
			//console.log("that's it " + attrs.id);
			$("#newRequestEndTime").timepicker('setStartDate', moment($(element).val(), "DD.MM.YY HH:mm"));
	  }
      });
      
      function read() {
        scope.ngModel = input.val();
		//console.log(controller);
      }
    }
  }
}]);


app.directive('time', function(){
	var linkFn = function(scope, element, attrs, ngModel){
		//console.log(ngModel);
		
		var date = new moment(ngModel.$modelValue);
		//console.log(ngModel.$viewValue);
		//console.log("moment = " + date);
		
		ngModel.$render = function(){
			//console.log("value = " + ngModel.$modelValue);
			//$(element).val(moment.unix(ngModel.$modelValue).format("DD.MM.YY HH:mm"));
            $(element).val(moment(ngModel.$modelValue).format("DD.MM.YY HH:mm"));
		}
		
		ngModel.$parsers.push(function(value){
            //console.log("return = " + moment(value, "DD.MM.YY HH:mm").toDate());
            //ngModel.$modelValue = moment(value, "DD.MM.YY HH:mm").toDate();
            //console.log("ngModel = " + ngModel.$modelValue);
			return moment(value, "DD.MM.YY HH:mm").toDate();


		});
		
		//ngModel.$formatters.push(function(value){
		//	var val = moment(value, "DD.MM.YY HH:mm");
		//	return val.unix();
		//});
		//controller.$setViewValue(moment.unix(controller.$modelValue).format("DD.MM.YY HH:mm"));
		//$(element).attr("value", moment(controller.$modelValue).format("DD.MM.YY HH:mm"));
		//$(element).val(moment(controller.$modelValue).format("DD.MM.YY HH:mm"));
		//var requestId = $(element).parent("div").parent("td").parent("tr").attr("id");
		//console.log($(element).parent("div").parent("td").parent("tr").attr("id"));
		
		//if(attrs.request)
			var requestId = $(element).attr("request");
		//console.log(scope.request);
		//console.log(attrs.$attr['request']);
		
		$(element).datetimepicker({
		language: "ru",
        format: "dd.mm.yy hh:ii",
		startView: 'month',
		weekStart: 1,
		forceParse: true,
		todayHighlight: true,
        showMeridian: false,
        autoclose: true,
        todayBtn: false,
        pickerPosition: 'bottom-left',
		minuteStep: 15
		//initialDate: moment(controller.$modelValue).format("HH:mm")
      });


        element.on("change", function(){
            element.trigger('input');
            ngModel.$setViewValue($(element).val());
        });
	};
	
	return {
		restrict: "A",
		require: "?ngModel",
		link: linkFn
		//compile: compileFn
	}
});


app.directive('reportdate', function(){
    var linkFn = function(scope, element, attrs, ngModel){
        //console.log(ngModel);

        var date = new moment(ngModel.$modelValue);
        //console.log(ngModel.$viewValue);
        //console.log("moment = " + date);

        ngModel.$render = function(){
            //console.log("value = " + ngModel.$modelValue);
            //$(element).val(moment.unix(ngModel.$modelValue).format("DD.MM.YY HH:mm"));
            $(element).val(moment(ngModel.$modelValue).format("DD.MM.YYYY"));
        }

        ngModel.$parsers.push(function(value){
            //console.log("return = " + moment(value, "DD.MM.YY HH:mm").toDate());
            //ngModel.$modelValue = moment(value, "DD.MM.YY HH:mm").toDate();
            //console.log("ngModel = " + ngModel.$modelValue);
            return moment(value, "DD.MM.YYYY").toDate();
        });

        /*
        $(element).datetimepicker({
            language: "ru",
            format: "dd.mm.yyy",
            startView: 'month',
            weekStart: 1,
            forceParse: true,
            todayHighlight: true,
            showMeridian: false,
            autoclose: true,
            todayBtn: false,
            pickerPosition: 'bottom-left'
            //initialDate: moment(controller.$modelValue).format("HH:mm")
        });
        */



        element.on("change", function(){
            element.trigger('input');
            ngModel.$setViewValue($(element).val());
        });
    };

    return {
        restrict: "A",
        require: "?ngModel",
        link: linkFn
        //compile: compileFn
    }
});

app.directive("request", function($window, GlobalData){
    return {
        restrict: "A",
        require: "?ngModel",
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {},
                post: function postLink(scope, iElement, iAttrs, controller){
                    if(controller){
                        if(GlobalData.inPanoramaMode){
                            if(GlobalData.inWeekMode){


                            }
                        } else {
                            var startOfTheCurrentDay = moment(scope.data.currentMoment).hours(0).minutes(0).unix();
                            var endOfTheCurrentDay = moment(scope.data.currentMoment).hours(23).minutes(59).unix();
                            // moment(endOfTheCurrentDay).hours(23).minutes(59);


                            //console.log("startOfTheCurrentDay = " + startOfTheCurrentDay);
                            //console.log("endOfTheCurrentDay = " + endOfTheCurrentDay);
                            //console.log("startTime = " + controller.$modelValue.startTime);
                            //console.log("endTime = " + controller.$modelValue.endTime);
                            //console.log("");



                            // Пересчет размеров блока заявки при изменении модели данных
                            scope.$watch(controller.$modelValue, function(modelValue){
                                var tw = $(iElement).parent("div").width();
                                var startOfTheDay = moment.unix(controller.$modelValue.startTime).hour(0).minutes(0).unix();
                                var width, left;

                                // Начинается ранее, чем сегодня, заканчивается в течение дня
                                if(controller.$modelValue.startTime < startOfTheCurrentDay &&
                                    controller.$modelValue.endTime >= startOfTheCurrentDay &&
                                    controller.$modelValue.endTime <= endOfTheCurrentDay){
                                    //console.log(controller.$modelValue.id + " = CASE 1");
                                    width = ((controller.$modelValue.endTime - startOfTheCurrentDay) / 60) / 15 * (tw / 96);
                                    left = 0;
                                    $(iElement).addClass("request_ left");
                                    $(iElement).children(".leftArrow").css("display", "block");
                                }
                                // Начинается ранее, чем сегодня и заканчивается позднее, чем сегодня
                                if(controller.$modelValue.startTime < startOfTheCurrentDay &&
                                    controller.$modelValue.endTime > endOfTheCurrentDay){
                                    width = tw;
                                    left = 0;
                                    $(iElement).addClass("request_ both");
                                    $(iElement).children(".leftArrow").css("display", "block");
                                    $(iElement).children(".rightArrow").css("display", "block");
                                    //console.log("BINGO");
                                } else {
                                    // width = ((controller.$modelValue.endTime - controller.$modelValue.startTime) / 60) / 15 * (tw / 96) - 2;
                                    // left = ((controller.$modelValue.startTime - startOfTheDay) / 60) / 15 * (tw / 96);
                                    //console.log("NO BINGO");
                                }

                                // Начинается в течении дня, заканчивается в течение дня
                                if(controller.$modelValue.startTime >= startOfTheCurrentDay &&
                                    controller.$modelValue.endTime <= endOfTheCurrentDay){
                                    //console.log(controller.$modelValue.id + " = CASE 2");
                                    width = ((controller.$modelValue.endTime - controller.$modelValue.startTime) / 60) / 15 * (tw / 96);
                                    left = ((controller.$modelValue.startTime - startOfTheCurrentDay) / 60) / 15 * (tw / 96);
                                }

                                // Начинается сегодня, заканчивается позднее, чем сегодня
                                if(controller.$modelValue.startTime >= startOfTheCurrentDay &&
                                    controller.$modelValue.startTime < endOfTheCurrentDay &&
                                    controller.$modelValue.endTime > endOfTheCurrentDay){
                                    //console.log(controller.$modelValue.id + " = CASE 3");
                                    width = ((endOfTheCurrentDay - controller.$modelValue.startTime) / 60) / 15 * (tw / 96);
                                    left = ((controller.$modelValue.startTime - startOfTheCurrentDay) / 60) / 15 * (tw / 96);
                                    $(iElement).addClass("request_ right");
                                    $(iElement).children(".rightArrow").css("display", "block");
                                }


                                $(iElement).css("width", width);
                                $(iElement).css("left", left);
                            });

                            // Пересчет размеров блока заявки при изменении размеров окна
                            $($window).resize(function(){
                                //var tw = $(iElement).parent("div").width();
                                //var width = ((controller.$modelValue.endTime - controller.$modelValue.startTime) / 60) / 15 * (tw / 96);
                                //var startOfTheDay = moment.unix(controller.$modelValue.startTime).hour(0).minutes(0).unix();
                                //var left = ((controller.$modelValue.startTime - startOfTheDay) / 60) / 15 * (tw / 96);

                                var tw = $(iElement).parent("div").width();
                                var startOfTheDay = moment.unix(controller.$modelValue.startTime).hour(0).minutes(0).unix();
                                var width, left;

                                // Начинается ранее, чем сегодня, заканчивается в течение дня
                                if(controller.$modelValue.startTime < startOfTheCurrentDay &&
                                    controller.$modelValue.endTime >= startOfTheCurrentDay &&
                                    controller.$modelValue.endTime <= endOfTheCurrentDay){
                                    width = ((controller.$modelValue.endTime - startOfTheCurrentDay) / 60) / 15 * (tw / 96);
                                    left = 0;
                                    $(iElement).addClass("request_ left");
                                }
                                // Начинается ранее, чем сегодня и заканчивается позднее, чем сегодня
                                if(controller.$modelValue.startTime < startOfTheCurrentDay &&
                                    controller.$modelValue.endTime > endOfTheCurrentDay){
                                    width = tw;
                                    left = 0;
                                    $(iElement).addClass("request_ both");
                                }
                                // Начинается в течении дня, заканчивается в течение дня
                                if(controller.$modelValue.startTime >= startOfTheCurrentDay &&
                                    controller.$modelValue.endTime <= endOfTheCurrentDay){
                                    width = ((controller.$modelValue.endTime - controller.$modelValue.startTime) / 60) / 15 * (tw / 96);
                                    left = ((controller.$modelValue.startTime - startOfTheCurrentDay) / 60) / 15 * (tw / 96);
                                }
                                // Начинается сегодня, заканчивается позднее, чем сегодня
                                if(controller.$modelValue.startTime >= startOfTheCurrentDay &&
                                    controller.$modelValue.startTime < endOfTheCurrentDay &&
                                    controller.$modelValue.endTime > endOfTheCurrentDay){
                                    width = ((endOfTheCurrentDay - controller.$modelValue.startTime) / 60) / 15 * (tw / 96);
                                    left = ((controller.$modelValue.startTime - startOfTheCurrentDay) / 60) / 15 * (tw / 96);
                                    $(iElement).addClass("request_ right");
                                }




                                $(iElement).css("width", width);
                                $(iElement).css("left", left);
                            });

                            // Обработчик двойного клика
                            $(iElement).dblclick(function(){
                                //console.log("dblclick");
                                scope.editRequest(controller.$modelValue.id);
                                //console.log(scope.data.requests.findItemById(controller.$modelValue.id));
                                //if(scope.data.requests.findItemById(controller.$modelValue.id) != false){
                                //    scope.currentRequest = scope.data.requests.findItemById(controller.$modelValue.id);
                                //    console.log(scope.currentRequest);
                                //    scope.showEditDialog();
                                //}

                                //angular.forEach(scope.requests.items, function(value, key){
                                //   if(value.id == controller.$modelValue.id){
                                //var temp_request = new Request();
                                //var temp_user = new User();
                                //temp_user.fromAnother(value.user);
                                //temp_request.fromAnother(value);
                                //temp_request.user.fromAnother(temp_user);
                                //scope.currentRequest.fromAnother(temp_request);
                                //       scope.currentRequest = value;
                                // scope.currentRequest.user.fromAnother(temp_user);
                                //console.log(scope.currentRequest);
                                scope.$apply();

                                //   }
                                //});
                            });
                        }




                    } // if(controller)

                } // postLink()
            }
        } // compile()
    };
});

app.directive("timeheader", function($window){
    return {
        restrict: "A",
        transclude: true,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {},
                post: function postLink(scope, iElement, iAttrs, controller){


                    $($window).resize(function(){
                        //console.log("resized");
                        var tt = $("#timetable").width();
                        var tw = $(".timeline_:first").width();
                    });

                }
            }
        }
    };
});

app.directive("datenavigation", function($window){
    return {
        restrict: "A",
        require: "?ngModel",
        compile: function compile(tElement, tAttrs, transclude){
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {},
                post: function postLink(scope, iElement, iAttrs, controller){
                    var parentWidth = $(iElement).parent().width();
                    $(iElement).css("width", (parentWidth / 7));

                    $($window).resize(function(){
                        var parentWidth = $(iElement).parent().width();
                        $(iElement).css("width", (parentWidth / 7));
                    });

                    /*
                    scope.$watch("data.currentMoment", function(value){
                        $(iElement).removeClass("active");
                        //$("#" + moment(value).format("DDMMYYYY")).addClass("active");
                        //console.log(moment(value).format("DD.MM.YYYY"));
                        if(moment(value).format("DDMMYYYY") == iElement.attr("id"))
                            $(iElement).addClass("active");
                    });

                    scope.$watch("data.currentDate", function(value){
                        if(moment(value).format("DDMMYYYY") == $(iElement).attr("id") && moment(value).format("DDMMYYYY") == moment(scope.currentMoment).format("DDMMYYYY")){
                            $(iElement).addClass("active");
                        } else
                            $(iElement).removeClass("active");


                    });
                    */
                }
            }
        }
    };
});

app.directive("hour", function($window){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            var parentWidth = $(element).parent().width();
            $(element).css("width", (parentWidth / 24)-1);

            $($window).resize(function(){
                var parentWidth = $(element).parent().width();
                $(element).css("width", (parentWidth / 24)-1);
            });
        }
    }
});

app.directive("report", function(){
    return {
        restrict: "A",
        compile: function compile(element, attrs, transclude){
            return {
                pre: function preLink(scope, iElement, iAttrs, controller){

                },
                post: function postLink(scope, iElement, iAttrs, controller){
                    //console.log(iAttrs);
                    var driverId = iAttrs.driver;
                    scope.$watch('dailyReportDate', function(newval, oldval){
                        var start = moment(scope.dailyReportDate).hours(0).minutes(0).unix();
                        var end = moment(scope.dailyReportDate).hours(23).minutes(59).unix();
                        var link = "php/daily-report-by-driver.php?driver=" + iAttrs.driver + "&start=" + start + "&end=" + end + "&date=" + moment(scope.dailyReportDate).format("DD.MM.YYYY");
                        $(element).attr("href", link);
                        //console.log(newval);
                    });

                    iElement.on("click", function(){
                        scope.hide();
                    });
                }
            }
        }
    }
});


app.directive("smartinput", function(){
    return {
        restrict: "A",
        require: "^ngModel",
        scope: {
            collection: "=",
            field: "@",
            ngModel: '='
        },
        compile: function compile(element, attrs){
            return {
                pre: function preLink(scope, iElement, iAttrs, ctrl){
                    //console.log(ngModel);
                },
                post: function postLink(scope, iElement, iAttrs, ctrl){

                    scope.$watch(attrs.ngModel, function(value){
                        //console.log(scope.ngModel);
                        //$(iElement).val(scope.ngModel);
                    });

                    ctrl.$render = function(){
                        //console.log("value = " + ngModel.$modelValue);
                        //$(element).val(moment.unix(ngModel.$modelValue).format("DD.MM.YY HH:mm"));
                        $(iElement).val(scope.ngModel);
                    }

                    ctrl.$parsers.push(function(value){
                        //console.log("return = " + moment(value, "DD.MM.YY HH:mm").toDate());
                        //ngModel.$modelValue = moment(value, "DD.MM.YY HH:mm").toDate();
                        //console.log("ngModel = " + ngModel.$modelValue);
                        //return moment(value, "DD.MM.YY HH:mm").toDate();


                    });

                }
            }
        }
    }
});


app.directive("panoramaweekday", function($window){
    return {
        restrict: "A",
        require: "?ngModel",
        priority: 0,
        link: function(scope, element, attrs){
            var parentWidth = $(element).parent().width() - 17;

            $($window).resize(function(){
                var parentWidth = $(element).parent().width() - 17;
                $(element).css("width", (parentWidth / 7) - 1);
            });
            $(element).css("width", (parentWidth / 7) - 1);
        }
    };
});

app.directive("panoramaweekday2", function($window){
    return {
        restrict: "A",
        require: "?ngModel",
        priority: 0,
        link: function(scope, element, attrs){
            var parentWidth = $(element).parent().width();

            $($window).resize(function(){
                var parentWidth = $(element).parent().width();
                $(element).css("width", (parentWidth / 7) - 1);
            });
            $(element).css("width", (parentWidth / 7) - 1);
        }
    };
});


app.directive('cols', function factory() {
    var directiveDefinitionObject = {
        priority: 4,
        compile:
            function compile(tElement, tAttrs, transclude) {
                return function(scope, element, attrs) {
                    scope.$watch(attrs.duration, function(duration){
                        $(element).attr("colspan", duration);
                    })
                }
            }
    };
return directiveDefinitionObject;
});

app.directive('sidepanel', function factory() {
    return {
        restrict: "E",
        templateUrl: "components/side_panel/side_panel.html",
        replace: true,
        link: function(scope, element, attrs){
            scope.header = "";
            scope.content = "";

            if(attrs.header)
                scope.header = attrs.header;
            if(attrs.content)
                scope.content = attrs.content;


        }
    }
});

app.directive("requestdir", function (){
    return {
        restrict: "E",
        templateUrl: "components/request/request.html",
        replace: true,
        require: "?ngModel",
        link: function(scope, element, attrs, controller){
            scope.request = controller;
            //console.log(controller.$modelValue);
        }
    }
});

app.directive("message", function(){
    return {
        restrict: "E",
        templateUrl: "components/message/message.html",
        replace: true,
        require: "?ngModel",
        link: function(scope, element, attrs, controller){
            scope.message = controller;
        }
    }
});