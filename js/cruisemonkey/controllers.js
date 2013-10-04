(function() {
	'use strict';

	angular.module('cruisemonkey.controllers', ['cruisemonkey.services'])
	.controller('CMLoginCtrl', function($scope, $rootScope, UserService) {
		console.log('Initializing CMLoginCtrl');
		$rootScope.title = "Log In";
		$scope.user = UserService.get();
		$scope.reset = function() {
			var user = UserService.get();
			console.log('resetting user: ', user);
			$scope.user = user;
		};
		$scope.isUnchanged = function(newUser) {
			var savedUser = UserService.get();
			if (savedUser == null) {
				if (newUser == null) {
					return true;
				} else {
					return false;
				}
			}
			return savedUser.username === newUser.username && savedUser.password === newUser.password;
		};
		$scope.update = function(user) {
			user.isLoggedIn = true;
			console.log('saving user: ', user);
			UserService.save(user);
		};
	})
	.controller('CMDeckListCtrl', function($scope, $rootScope, $routeParams, $location) {
		console.log('Initializing CMDeckListCtrl');
		$scope.deck = parseInt($routeParams.deck, 10);
		$rootScope.title = "Deck " + $scope.deck;
		$scope.previous = function() {
			if ($scope.deck !== 2) {
				$location.path('/deck-plans/' + ($scope.deck - 1));
			}
		};
		$scope.next = function() {
			if ($scope.deck !== 15) {
				$location.path('/deck-plans/' + ($scope.deck + 1));
			}
		};
	})
	.controller('CMHeaderCtrl', function($scope, $rootScope, $location) {
		console.log('Initializing CMHeaderCtrl');
	})
	.controller('CMEventCtrl', function($scope, $rootScope, $routeParams, pouchWrapper, $location, UserService) {
		console.log('Initializing CMEventCtrl');

		$rootScope.actions = [
			{
				'name': 'Add Event',
				'iconClass': 'add'
			}
		];

		$scope.eventType = $routeParams.eventType;
		$rootScope.title = $routeParams.eventType.capitalize() + ' Events';

		if (!$scope.events) {
			$scope.events = {};
		}
		if (!$scope.favorites) {
			$scope.favorites = {};
		}

		$scope.isFavorite = function(id) {
			return $scope.favorites[id];
		}

		$scope.save = function(eventId) {
			console.log("this = ", this);
			console.log("eventId = " + eventId);

			if ($scope.favorites[eventId]) {
				$scope.favorites[eventId] = false;
			} else {
				$scope.favorites[eventId] = true;
			}
		};

		$scope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if(phase === '$apply' || phase === '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		var dbEvents = pouchWrapper.getEvents($routeParams.eventType);
		dbEvents.then(function(docs) {
			var events = {};
			docs.rows.forEach(function(doc) {
				events[doc.value._id] = doc.value;
			});
			$scope.events = events;
		});

		var dbFavorites = pouchWrapper.getFavorites();
		dbFavorites.then(function(docs) {
			console.log('new favorites: ', docs);
			var favorites = {};
			docs.rows.forEach(function(fav) {
				favorites[fav] = true;
			});
			$scope.favorites = favorites;
		});

		$scope.$on('newEvent', function(jsEvent, event) {
			console.log('addEvent: ' + event._id);
			$scope.safeApply(function() {
				if (event.eventType === $scope.eventType) {
					for (var i = 0; i < $scope.events.length; i++) {
						if ($scope.events[i]._id === event._id) {
							$scope.events[i] = event;
							return;
						}
					}
					$scope.events.push(event);
				}
			});
		});
		$scope.$on('delEvent', function(jsEvent, id) {
			console.log('delEvent: ' + id);
			$scope.safeApply(function() {
				for (var i = 0; i < $scope.events.length; i++) {
					if ($scope.events[i]._id === id) {
						$scope.events.splice(i,1);
						break;
					}
				}
			});
		});
	})
	;
}());