(function() {
	'use strict';

	angular.module('cruisemonkey.controllers', ['cruisemonkey.services', 'cruisemonkey.Logging', 'cruisemonkey.Events', 'cruisemonkey.User'])
	.controller('CMDeckListCtrl', function($scope, $rootScope, $routeParams, $location, LoggingService) {
		LoggingService.info('Initializing CMDeckListCtrl');
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
	.controller('CMHeaderCtrl', function($scope, $rootScope, $location, LoggingService) {
		LoggingService.info('Initializing CMHeaderCtrl');
	})
	.controller('CMEventCtrl', function($scope, $rootScope, $routeParams, $location, $q, UserService, EventService, LoggingService) {
		LoggingService.info('Initializing CMEventCtrl');

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

		$scope.user = UserService.get();
		
		$q.when($scope.user).then(function(user) {
			var username = user.username;

			var func;
			if ($routeParams.eventType === 'official') {
				func = EventService.getOfficialEvents;
			} else if ($routeParams.eventType === 'unofficial') {
				func = EventService.getPublicEvents;
			} else if ($routeParams.eventType === 'my') {
				func = EventService.getMyEvents;
			} else {
				LoggingService.warn('unknown event type: ' + $routeParams.eventType);
			}
			$scope.events = $q.all([func(username), EventService.getMyFavorites(username)]).then(function(results) {
				var i;
				
				var ret = {};
				for (i = 0; i < results[0].length; i++) {
					var e = results[0][i];
					e.isFavorite = false;
					ret[e._id] = e;
				}
				
				for (i = 0; i < results[1].length; i++) {
					var eventId = results[1][i];
					if (ret[eventId]) {
						ret[eventId].isFavorite = true;
					} else {
						LoggingService.warn('could not find ' + eventId + ' in available events');
					}
				}

				return ret;
			});

		});

		$scope.onChange = function(eventId, checked) {
			var username = $scope.user.username;
			$q.when($scope.events).then(function(events) {
				events[eventId].isFavorite = checked;
			});
			if (checked) {
				EventService.addFavorite(username, eventId);
			} else {
				EventService.removeFavorite(username, eventId);
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

		/*
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
		*/
	})
	;
}());