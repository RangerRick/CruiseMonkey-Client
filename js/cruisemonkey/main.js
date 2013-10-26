(function () {
	'use strict';

	angular.module('cruisemonkey',
	[
		'ngRoute',
		'cruisemonkey.filters',
		'cruisemonkey.services',
		'cruisemonkey.directives',
		'cruisemonkey.controllers.About',
		'cruisemonkey.controllers.DeckList',
		'cruisemonkey.controllers.Events',
		'cruisemonkey.controllers.Header',
		'cruisemonkey.controllers.Login',
		'cruisemonkey.controllers.Logout',
		'cruisemonkey.Database',
		'cruisemonkey.Navigation',
		'cruisemonkey.Events',
		'cruisemonkey.User',
		'ek.mobileFrame',
		'btford.phonegap.ready'
	])
	.config(['$routeProvider', '$mobileFrameProvider', function($routeProvider, $mobileFrameProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'template/login.html',
				controller: 'CMLoginCtrl'
			})
			.when('/logout', {
				templateUrl: 'template/logout.html',
				controller: 'CMLogoutCtrl'
			})
			.when('/events', {
				redirectTo: '/events/official/'
			})
			.when('/events/:eventType', {
				templateUrl: 'template/event-list.html',
				controller: 'CMEventCtrl'
			})
			.when('/deck-plans', {
				redirectTo: '/deck-plans/2/'
			})
			.when('/deck-plans/:deck', {
				templateUrl: 'template/deck-plans.html',
				controller: 'CMDeckListCtrl'
			})
			.when('/about', {
				templateUrl: 'template/about.html',
				controller: 'CMAboutCtrl'
			})
			.otherwise({
				redirectTo: '/events/official/'
			});
		$mobileFrameProvider
			.setHeaderHeight(40)
			.setFooterHeight(0)
			.setNavWidth(250);
	}])
	.run(['$rootScope', '$location', 'UserService', 'phonegapReady', function($rootScope, $location, UserService, phonegapReady) {
		phonegapReady(function() {
			if (StatusBar) {
				console.log('StatusBar exists, isVisible = ' + StatusBar.isVisible);
				StatusBar.overlaysWebView(false);
				StatusBar.backgroundColorByName('black');
			}
		});

		$rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
			$rootScope.actions = [];
			$rootScope.user = UserService.get();

			if (UserService.loggedIn()) {
				angular.noop();
				return;
			}

			if (currRoute.templateUrl === 'template/event-list.html' && currRoute.params.eventType === 'my') {
				event.preventDefault();
				$location.path('/login/');
				angular.noop();
				return;
			}

			if (prevRoute && prevRoute.access) {
				if (prevRoute.access.requiresLogin) {
					event.preventDefault();
					$location.path('/login/');
					angular.noop();
				}
			}

			angular.noop();
			return;
		});
		
		var updateMenu = function() {
			var path = $location.path();
			angular.forEach(document.getElementById('nav').children, function(li, key) {
				if (li.children[0]) {
					var href = li.children[0].href;
					var index = href.indexOf('#');
					if (index !== -1) {
						href = href.substring(href.indexOf('#') + 1);
					}
					if (path.startsWith(href)) {
						angular.element(li).addClass('selected');
					} else {
						angular.element(li).removeClass('selected');
					}
				}
			});
		};

		$rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute) {
			updateMenu();
		});
		$rootScope.$on('cmUpdateMenu', function(event) {
			console.log('cmUpdateMenu fired');
			updateMenu();
		});
	}])
	;
}());