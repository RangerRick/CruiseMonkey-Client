(function() {
	'use strict';

	angular.module('cruisemonkey.User', [])
	.factory('UserService', function() {
		var user = {
			'loggedIn': false,
			'username': '',
			'password': ''
		};

		return {
			'loggedIn': function() {
				return user.loggedIn;
			},
			'get': function() {
				return angular.copy(user);
			},
			'save': function(newUser) {
				user = angular.copy(newUser);
			},
			'reset': function() {
				user = {
					'loggedIn': false,
					'username': '',
					'password': ''
				};
				return user;
			}
		};
	});

}());