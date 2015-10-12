'use strict';

/* App Module */
var app = angular.module('auto_requests', ['filters', 'directives', 'infinite-scroll', "$strap.directives"]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {redirectTo: '/list'}).
			//when('/list', {templateUrl: 'partials/list.html', controller: ListViewCtrl}).
            when('/list', {templateUrl: 'partials/the_list.html', controller: ListViewCtrl}).
            when('/panorama', {templateUrl: 'partials/panorama.html', controller: PanoramaViewCtrl}).
			//when('/all', {templateUrl: 'partials/list.html', controller: ListViewCtrl}).
			//when('/my', {templateUrl: 'partials/myRequests.html', controller: MyListViewCtrl}).
			when('/transport', {templateUrl: 'partials/sorter.html', controller: SorterCtrl}).
            when('/drivers', {templateUrl: 'partials/drivers.html', controller: DriversCtrl}).
			when('/help', {templateUrl: 'partials/help.html', controller: HelpCtrl}).
            when('/users', {templateUrl: 'partials/users.html', controller: UsersCtrl}).
			otherwise({redirectTo: '/list'});
}]);
