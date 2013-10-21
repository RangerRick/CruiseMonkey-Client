(function() {
	'use strict';

	angular.module('cruisemonkey.User', [])
	.factory('UserService', function() {
		var user = {
			loggedIn: false,
			username: '',
			password: ''
		};

		return {
			'isLoggedIn': function() {
				return user.loggedIn;
			},
			'get': function() {
				return angular.copy(user);
			},
			'save': function(newUser) {
				user = angular.copy(newUser);
			}
		};
	});

}());