(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Events', ['ngRoute', 'cruisemonkey.User', 'cruisemonkey.Events', 'cruisemonkey.Logging', 'ui.bootstrap.modal', 'datePicker'])
	.controller('CMEditEventCtrl', ['$q', '$scope', '$modal', 'UserService', 'LoggingService', function($q, $scope, $modal, UserService, log) {
		log.info('Initializing CMEditEventCtrl');

		$q.when(UserService.get()).then(function(user) {
			var start = new Date();
			$scope.event = {
				'start':    start,
				'end':      new Date(start.getTime() + 60 * 60 * 1000),
				'type':     'event',
				'username': user.username
			};
		});
	}])
	.controller('CMEventCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$q', '$modal', '$templateCache', 'UserService', 'EventService', 'LoggingService', function($scope, $rootScope, $routeParams, $location, $q, $modal, $templateCache, UserService, EventService, log) {
		log.info('Initializing CMEventCtrl');

		$scope.eventType = $routeParams.eventType;
		$rootScope.title = $routeParams.eventType.capitalize() + ' Events';
		$rootScope.actions = [];

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

		if (!$scope.events) {
			$scope.events = {};
		}

		$q.when(UserService.get()).then(function(user) {
			var username = '';
			if (user.username) {
				username = user.username;
			}

			if (username && username !== '') {
				$rootScope.actions.push({
					'name': 'Add Event',
					'iconClass': 'add',
					'launch': function() {
						log.info('launching modal');
						var modalInstance = $modal.open({
							templateUrl:'edit-event.html',
							controller:'CMEditEventCtrl'
						});
						modalInstance.result.then(function(result) {
							log.info("Add finished!");
							$q.all([EventService.addEvent(result), $scope.events]).then(function(results) {
								var added = results[0];
								var events = results[1];
								events[added._id] = added;
							});
						}, function() {
							log.warn("Add canceled!");
						});
					}
				});
			}

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

		$scope.fuzzy = function(date) {
			return moment(date).fromNow();
		};
		$scope.justTime = function(date) {
			return moment(date).format('HH:mm');
		};

		$scope.trash = function(ev) {
			$scope.safeApply(function() {
				$q.all([EventService.removeEvent(ev), $scope.events]).then(function(response) {
					var removed = response[0];
					var events  = response[1];
					console.log('removed = ', removed);
					delete events[removed.id];
				});
			});
		};
		
		$scope.edit = function(ev) {
			$scope.safeApply(function() {
				console.log('edit: ', ev);
			});
		};

		$scope.onFavoriteChanged = function(eventId, checked) {
			$q.when(UserService.get()).then(function(user) {
				var username = user.username;
				$q.when($scope.events).then(function(events) {
					events[eventId].isFavorite = checked;
				});
				if (checked) {
					EventService.addFavorite(username, eventId);
				} else {
					EventService.removeFavorite(username, eventId);
				}
			});
		};

		$scope.onPublicChanged = function(event, pub) {
			console.log('onPublicChanged: ', event, pub);
			event.isPublic = pub;
			$q.when(UserService.get()).then(function(user) {
				var username = user.username;
				$q.when($scope.events).then(function(events) {
					events[event._id].isPublic = pub;
					EventService.updateEvent(events[event._id]);
				});
			});
		};

		$scope.$on('entryChange', function(ev, doc) {
			if (doc && doc.type === 'event') {
				console.log('changed document: ', doc);
			}
		});
		$scope.$on('entryDeleted', function(ev, id) {
			console.log('deleted document: ' + id);
		});
	}]);
}());