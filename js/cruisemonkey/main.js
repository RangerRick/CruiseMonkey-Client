(function () {
	'use strict';

	angular.module('cruisemonkey',
	[
		'cruisemonkey.filters',
		'cruisemonkey.services',
		'cruisemonkey.directives',
		'cruisemonkey.controllers',
		'cruisemonkey.factories',
		'cruisemonkey.Navigation',
		'cruisemonkey.Events',
		'ek.mobileFrame',
		/* '$strap.directives', */
		'hmTouchEvents'
	])
	.config(['$routeProvider', '$mobileFrameProvider', function($routeProvider, $mobileFrameProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'partials/login.html',
				controller: 'CMLoginCtrl'
			})
			.when('/events', {
				redirectTo: '/events/official'
			})
			.when('/events/:eventType', {
				templateUrl: 'partials/event-list.html',
				controller: 'CMEventCtrl'
			})
			.when('/deck-plans', {
				redirectTo: '/deck-plans/2'
			})
			.when('/deck-plans/:deck', {
				templateUrl: 'partials/deck-plans.html',
				controller: 'CMDeckListCtrl'
			})
			.otherwise({
				redirectTo: '/events/official'
			});
		$mobileFrameProvider
			.setHeaderHeight(40)
			.setFooterHeight(0)
			.setNavWidth(250);
	}])
	.run(['$rootScope', '$location', 'UserService', function($rootScope, $location, UserService) {
		$rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
			console.log("$routeChangeStart: template = " + currRoute.templateUrl + ", eventType = " + currRoute.params.eventType);

			if (UserService.isLoggedIn()) {
				angular.noop();
				return;
			}

			if (currRoute.templateUrl === 'partials/event-list.html' && currRoute.params.eventType === 'my') {
				event.preventDefault();
				$location.path('/login');
				angular.noop();
				return;
			}

			if (prevRoute && prevRoute.access) {
				if (prevRoute.access.requiresLogin) {
					event.preventDefault();
					$location.path('/login');
					angular.noop();
				}
			}

			angular.noop();
			return;
		});
	}])
	;
}());