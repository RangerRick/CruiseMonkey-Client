(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Login', ['cruisemonkey.Logging', 'cruisemonkey.User'])
	.controller('CMLoginCtrl', ['$scope', '$rootScope', 'UserService', 'LoggingService', function($scope, $rootScope, UserService, LoggingService) {
		LoggingService.info('Initializing CMLoginCtrl');
		$rootScope.title = "Log In";
		$scope.user = UserService.get();
		$scope.reset = function() {
			var user = UserService.get();
			LoggingService.info('resetting user: ', user);
			$scope.user = user;
		};
		$scope.isUnchanged = function(newUser) {
			var savedUser = UserService.get();
			if (savedUser === null || savedUser === undefined) {
				if (newUser === null || newUser === undefined) {
					return true;
				} else {
					return false;
				}
			}
			return savedUser.username === newUser.username && savedUser.password === newUser.password;
		};
		$scope.update = function(user) {
			user.loggedIn = true;
			LoggingService.info('saving user: ', user);
			UserService.save(user);
		};
	}]);
}());