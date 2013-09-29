(function () {
	'use strict';

	angular.module('cruisemonkey', [
		'cruisemonkey.filters',
		'cruisemonkey.services',
		'cruisemonkey.directives',
		'cruisemonkey.controllers',
		'cruisemonkey.factories',
		'$strap.directives',
		'hmTouchEvents'
	])
	.config(function ($routeProvider) {
		log.info('Configuring route provider.');
		$routeProvider
			.when('/login', {
				templateUrl: 'partials/login.html',
				controller: 'CMLoginCtrl'
			})
			.when('/events', {
				redirectTo: '/events/official'
			})
			.when('/events/:type', {
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
	})
	.run(function($rootScope, $location, UserService) {
		log.info('rootscope: ' + $rootScope);
		$rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
			/*
			log.warn("$routeChangeStart");
			if (UserService.isLoggedIn) {
				angular.noop();
				return;
			}

			if (prevRoute && prevRoute)
			if (prevRoute && prevRoute.access && !prevRoute.access.requiresLogin) {
				angular.noop();
				return;
			}

			event.preventDefault();
			$location.path('/login');
			*/
			angular.noop();
		});
	})		
	;
}());