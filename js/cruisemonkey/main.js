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
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
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
}]);
