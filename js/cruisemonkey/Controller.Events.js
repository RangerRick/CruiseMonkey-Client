(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Events', ['ngRoute', 'cruisemonkey.User', 'cruisemonkey.Events', 'cruisemonkey.Logging', 'ui.bootstrap.modal'])
	.controller('CMAddEventCtrl', ['$scope', '$modal', 'LoggingService', function($scope, $modal, log) {
		log.info('Initializing CMAddEventCtrl');
	}])
	.controller('CMEventCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$q', '$modal', '$templateCache', 'UserService', 'EventService', 'LoggingService', function($scope, $rootScope, $routeParams, $location, $q, $modal, $templateCache, UserService, EventService, log) {
		log.info('Initializing CMEventCtrl');

		$rootScope.actions = [
			{
				'name': 'Add Event',
				'iconClass': 'add',
				'launch': function() {
					log.info('launching modal');
					$modal.open({
						templateUrl:'add-event.html',
						controller:'CMAddEventCtrl',
						backdrop:false
					});
				}
			}
		];

		$scope.eventType = $routeParams.eventType;
		$rootScope.title = $routeParams.eventType.capitalize() + ' Events';

		if (!$scope.events) {
			$scope.events = {};
		}

		$q.when($rootScope.user).then(function(user) {
			var username = user.username;

			var func;
			if ($routeParams.eventType === 'official') {
				func = EventService.getOfficialEvents;
			} else if ($routeParams.eventType === 'unofficial') {
				func = EventService.getPublicEvents;
			} else if ($routeParams.eventType === 'my') {
				func = EventService.getMyEvents;
			} else {
				log.warn('unknown event type: ' + $routeParams.eventType);
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
						log.warn('could not find ' + eventId + ' in available events');
					}
				}

				return ret;
			});

		});

		$scope.onChange = function(eventId, checked) {
			var username = $rootScope.user.username;
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
	}]);
}());